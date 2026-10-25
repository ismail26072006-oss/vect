package com.example.data.model

data class UserProfile(
    val id: String = "user_default",
    val name: String = "ISMAIL K. ZAKARIA",
    val nim: String = "220101005",
    val classCode: String = "TI-2026A",
    val className: String = "Teknik Informatika 2026-A",
    val role: UserRole = UserRole.MAHASISWA,
    val leaderPin: String = "1234",
    val authorizedLeaders: Set<String> = emptySet(),
    val isLoggedIn: Boolean = false
) {
    val isKetuaKelas: Boolean get() = role == UserRole.KETUA_KELAS
}
