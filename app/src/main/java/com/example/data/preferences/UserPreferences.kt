package com.example.data.preferences

import android.content.Context
import android.content.SharedPreferences
import com.example.data.model.UserProfile
import com.example.data.model.UserRole
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

class UserPreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("tugasqu_user_prefs", Context.MODE_PRIVATE)

    private val _currentUser = MutableStateFlow(loadUser())
    val currentUser: StateFlow<UserProfile> = _currentUser.asStateFlow()

    private fun loadUser(): UserProfile {
        val id = prefs.getString("user_id", UUID.randomUUID().toString()) ?: UUID.randomUUID().toString()
        val name = prefs.getString("user_name", "ISMAIL K. ZAKARIA") ?: "ISMAIL K. ZAKARIA"
        val nim = prefs.getString("user_nim", "220101005") ?: "220101005"
        val classCode = prefs.getString("user_class_code", "TI-2026A") ?: "TI-2026A"
        val className = prefs.getString("user_class_name", "Teknik Informatika 2026-A") ?: "Teknik Informatika 2026-A"
        val roleStr = prefs.getString("user_role", UserRole.MAHASISWA.name) ?: UserRole.MAHASISWA.name
        val leaderPin = prefs.getString("leader_pin", "1234") ?: "1234"
        val authorizedLeaders = prefs.getStringSet("authorized_leaders", setOf("Budi Santoso", "ISMAIL K. ZAKARIA", "220101005")) ?: setOf("Budi Santoso", "ISMAIL K. ZAKARIA", "220101005")
        val isLoggedIn = prefs.getBoolean("user_logged_in", false)

        val role = try {
            UserRole.valueOf(roleStr)
        } catch (_: Exception) {
            UserRole.MAHASISWA
        }

        return UserProfile(
            id = id,
            name = name,
            nim = nim,
            classCode = classCode,
            className = className,
            role = role,
            leaderPin = leaderPin,
            authorizedLeaders = authorizedLeaders,
            isLoggedIn = isLoggedIn
        )
    }

    /**
     * Masuk ke portal kelas dengan format Nama, NIM, Kelas, dan Peran.
     */
    fun loginWithDetails(
        name: String,
        nim: String,
        className: String,
        classCode: String,
        role: UserRole = UserRole.MAHASISWA
    ) {
        val cleanName = name.trim().ifBlank { "ISMAIL K. ZAKARIA" }
        val cleanNim = nim.trim().ifBlank { "220101005" }
        val cleanClassCode = classCode.trim().uppercase().ifBlank { "TI-2026A" }
        val cleanClassName = className.trim().ifBlank { "Teknik Informatika 2026-A" }

        val currentLeaders = prefs.getStringSet("authorized_leaders", emptySet())?.toMutableSet() ?: mutableSetOf()
        if (role == UserRole.KETUA_KELAS) {
            currentLeaders.add(cleanName)
            currentLeaders.add(cleanNim)
        }

        prefs.edit()
            .putString("user_name", cleanName)
            .putString("user_nim", cleanNim)
            .putString("user_class_code", cleanClassCode)
            .putString("user_class_name", cleanClassName)
            .putString("user_role", role.name)
            .putBoolean("user_logged_in", true)
            .putStringSet("authorized_leaders", currentLeaders)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            name = cleanName,
            nim = cleanNim,
            classCode = cleanClassCode,
            className = cleanClassName,
            role = role,
            authorizedLeaders = currentLeaders,
            isLoggedIn = true
        )
    }

    /**
     * Membuat kelas baru. Pembuat kelas otomatis menjadi Ketua Kelas.
     */
    fun createClass(className: String, classCode: String, creatorName: String, leaderPin: String = "1234") {
        val cleanName = creatorName.trim().ifBlank { "Ketua Kelas" }
        val cleanCode = classCode.trim().uppercase().ifBlank { "TI-2026A" }
        val cleanClassName = className.trim().ifBlank { "Kelas $cleanCode" }
        val cleanPin = leaderPin.trim().ifBlank { "1234" }

        val currentLeaders = prefs.getStringSet("authorized_leaders", emptySet())?.toMutableSet() ?: mutableSetOf()
        currentLeaders.add(cleanName)

        prefs.edit()
            .putString("user_name", cleanName)
            .putString("user_class_code", cleanCode)
            .putString("user_class_name", cleanClassName)
            .putString("user_role", UserRole.KETUA_KELAS.name)
            .putString("leader_pin", cleanPin)
            .putStringSet("authorized_leaders", currentLeaders)
            .putBoolean("user_logged_in", true)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            name = cleanName,
            classCode = cleanCode,
            className = cleanClassName,
            role = UserRole.KETUA_KELAS,
            leaderPin = cleanPin,
            authorizedLeaders = currentLeaders,
            isLoggedIn = true
        )
    }

    /**
     * Gabung kelas menggunakan kode atau invite link.
     */
    fun joinClassByCode(classCode: String, studentName: String = "", isLeader: Boolean = false) {
        val cleanCode = classCode.trim().uppercase().ifBlank { "TI-2026A" }
        val cleanName = studentName.trim().ifBlank { _currentUser.value.name }
        val authorized = _currentUser.value.authorizedLeaders.contains(cleanName) || isLeader
        val resolvedRole = if (authorized) UserRole.KETUA_KELAS else UserRole.MAHASISWA

        val guessedClassName = if (cleanCode.startsWith("TI")) "Teknik Informatika $cleanCode" else "Kelas $cleanCode"

        prefs.edit()
            .putString("user_class_code", cleanCode)
            .putString("user_class_name", guessedClassName)
            .putString("user_role", resolvedRole.name)
            .putBoolean("user_logged_in", true)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            name = cleanName,
            classCode = cleanCode,
            className = guessedClassName,
            role = resolvedRole,
            isLoggedIn = true
        )
    }

    fun addAuthorizedLeader(nameOrNim: String) {
        val clean = nameOrNim.trim()
        if (clean.isBlank()) return
        val currentLeaders = prefs.getStringSet("authorized_leaders", emptySet())?.toMutableSet() ?: mutableSetOf()
        currentLeaders.add(clean)

        prefs.edit()
            .putStringSet("authorized_leaders", currentLeaders)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            authorizedLeaders = currentLeaders
        )
    }

    fun switchRole(newRole: UserRole) {
        prefs.edit()
            .putString("user_role", newRole.name)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            role = newRole
        )
    }

    fun updateLeaderPin(newPin: String) {
        val cleanPin = newPin.trim().ifBlank { "1234" }
        prefs.edit()
            .putString("leader_pin", cleanPin)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            leaderPin = cleanPin
        )
    }

    fun updateProfile(name: String, nim: String) {
        val cleanName = name.trim().ifBlank { "Mahasiswa" }
        val cleanNim = nim.trim().ifBlank { "220101005" }

        prefs.edit()
            .putString("user_name", cleanName)
            .putString("user_nim", cleanNim)
            .apply()

        _currentUser.value = _currentUser.value.copy(
            name = cleanName,
            nim = cleanNim
        )
    }

    fun saveLogin(name: String, nim: String, classCode: String, role: UserRole) {
        loginWithDetails(name, nim, "Kelas $classCode", classCode, role)
    }

    fun openAppDirectly(role: UserRole = UserRole.MAHASISWA) {
        prefs.edit().putBoolean("user_logged_in", true).apply()
        _currentUser.value = _currentUser.value.copy(isLoggedIn = true, role = role)
    }

    fun logout() {
        prefs.edit().putBoolean("user_logged_in", false).apply()
        _currentUser.value = _currentUser.value.copy(isLoggedIn = false)
    }
}
