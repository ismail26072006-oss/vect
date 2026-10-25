package com.example.data.preferences

import android.content.Context
import android.content.SharedPreferences
import com.example.data.model.CourseSchedule
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class SchedulePreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("vecteducation_schedules", Context.MODE_PRIVATE)

    private val _schedules = MutableStateFlow<List<CourseSchedule>>(loadSchedules())
    val schedules: StateFlow<List<CourseSchedule>> = _schedules.asStateFlow()

    private fun loadSchedules(): List<CourseSchedule> {
        val raw = prefs.getString("schedules_json", null)
        if (raw.isNullOrBlank()) {
            val defaults = defaultWeeklySchedules()
            persistToPrefs(defaults)
            return defaults
        }

        return try {
            val array = JSONArray(raw)
            val list = mutableListOf<CourseSchedule>()
            for (i in 0 until array.length()) {
                val obj = array.getJSONObject(i)
                list.add(
                    CourseSchedule(
                        id = obj.optString("id", UUID.randomUUID().toString()),
                        dayOfWeek = obj.optInt("dayOfWeek", 1),
                        courseName = obj.optString("courseName", ""),
                        timeRange = obj.optString("timeRange", "08:00 - 09:40"),
                        room = obj.optString("room", "R. Kuliah"),
                        lecturer = obj.optString("lecturer", "Dosen Pengampu"),
                        sks = obj.optInt("sks", 3),
                        courseCode = obj.optString("courseCode", "INF101")
                    )
                )
            }
            if (list.isEmpty()) defaultWeeklySchedules() else list
        } catch (_: Exception) {
            defaultWeeklySchedules()
        }
    }

    private fun persistToPrefs(list: List<CourseSchedule>) {
        val array = JSONArray()
        list.forEach { item ->
            val obj = JSONObject().apply {
                put("id", item.id)
                put("dayOfWeek", item.dayOfWeek)
                put("courseName", item.courseName)
                put("timeRange", item.timeRange)
                put("room", item.room)
                put("lecturer", item.lecturer)
                put("sks", item.sks)
                put("courseCode", item.courseCode)
            }
            array.put(obj)
        }
        prefs.edit().putString("schedules_json", array.toString()).apply()
    }

    private fun saveSchedules(list: List<CourseSchedule>) {
        persistToPrefs(list)
        _schedules.value = list
    }

    fun addSchedule(schedule: CourseSchedule) {
        val current = _schedules.value.toMutableList()
        current.add(schedule)
        saveSchedules(current)
    }

    fun deleteSchedule(id: String) {
        val current = _schedules.value.filterNot { it.id == id }
        saveSchedules(current)
    }

    fun resetToDefaults() {
        val defaults = defaultWeeklySchedules()
        saveSchedules(defaults)
    }

    private fun defaultWeeklySchedules(): List<CourseSchedule> {
        return listOf(
            // Senin (day = 1)
            CourseSchedule(
                id = "senin_1",
                dayOfWeek = 1,
                courseName = "Algoritma & Struktur Data",
                timeRange = "08:00 - 09:40 WITA",
                room = "Lab Komputer 1",
                lecturer = "Dr. Ir. Zakaria, M.Kom",
                sks = 3,
                courseCode = "INF201"
            ),
            CourseSchedule(
                id = "senin_2",
                dayOfWeek = 1,
                courseName = "Matematika Diskrit",
                timeRange = "10:00 - 11:40 WITA",
                room = "R. Kuliah 302",
                lecturer = "Prof. Dr. Suryani, M.Sc",
                sks = 3,
                courseCode = "MAT102"
            ),
            // Selasa (day = 2)
            CourseSchedule(
                id = "selasa_1",
                dayOfWeek = 2,
                courseName = "Pemrograman Berorientasi Objek",
                timeRange = "08:00 - 09:40 WITA",
                room = "Lab Software 2",
                lecturer = "Ir. Ismail, M.T.",
                sks = 3,
                courseCode = "INF202"
            ),
            CourseSchedule(
                id = "selasa_2",
                dayOfWeek = 2,
                courseName = "Sistem Operasi & Linux",
                timeRange = "13:00 - 14:40 WITA",
                room = "R. Kuliah 204",
                lecturer = "Budi Hermawan, M.Kom",
                sks = 3,
                courseCode = "INF204"
            ),
            // Rabu (day = 3)
            CourseSchedule(
                id = "rabu_1",
                dayOfWeek = 3,
                courseName = "Basis Data Terdistribusi",
                timeRange = "08:00 - 09:40 WITA",
                room = "Lab Database",
                lecturer = "Dr. Nurhayati, M.Kom",
                sks = 3,
                courseCode = "INF205"
            ),
            CourseSchedule(
                id = "rabu_2",
                dayOfWeek = 3,
                courseName = "Rekayasa Perangkat Lunak",
                timeRange = "10:00 - 11:40 WITA",
                room = "R. Kuliah 305",
                lecturer = "Ahmad Dani, M.Cs",
                sks = 3,
                courseCode = "INF206"
            ),
            // Kamis (day = 4)
            CourseSchedule(
                id = "kamis_1",
                dayOfWeek = 4,
                courseName = "Jaringan Komputer & Keamanan Siber",
                timeRange = "08:00 - 09:40 WITA",
                room = "Lab Jaringan",
                lecturer = "Fajar Prasetyo, M.T.",
                sks = 3,
                courseCode = "INF207"
            ),
            CourseSchedule(
                id = "kamis_2",
                dayOfWeek = 4,
                courseName = "Interaksi Manusia & Komputer (UI/UX)",
                timeRange = "13:00 - 14:40 WITA",
                room = "R. Multimedia",
                lecturer = "Siti Aminah, M.Kom",
                sks = 2,
                courseCode = "INF208"
            ),
            // Jumat (day = 5)
            CourseSchedule(
                id = "jumat_1",
                dayOfWeek = 5,
                courseName = "Kecerdasan Buatan (Artificial Intelligence)",
                timeRange = "08:00 - 09:40 WITA",
                room = "R. Kuliah 401",
                lecturer = "Dr. M. Ridwan, M.Eng",
                sks = 3,
                courseCode = "INF209"
            ),
            CourseSchedule(
                id = "jumat_2",
                dayOfWeek = 5,
                courseName = "Etika Profesi & Hukum Siber",
                timeRange = "13:30 - 15:10 WITA",
                room = "R. Kuliah 201",
                lecturer = "Hendra Wijaya, S.H., M.H.",
                sks = 2,
                courseCode = "UNI105"
            ),
            // Sabtu (day = 6)
            CourseSchedule(
                id = "sabtu_1",
                dayOfWeek = 6,
                courseName = "Praktikum Proyek Aplikasi Web & Mobile",
                timeRange = "09:00 - 11:30 WITA",
                room = "Lab Riset Terpadu",
                lecturer = "Tim Asisten & Dosen TI",
                sks = 3,
                courseCode = "INF210"
            ),
            CourseSchedule(
                id = "sabtu_2",
                dayOfWeek = 6,
                courseName = "Kolokium & Seminar Teknologi Informasi",
                timeRange = "13:00 - 15:00 WITA",
                room = "Aula Utama Fakultas",
                lecturer = "Koordinator Seminar & Dosen Tamu",
                sks = 2,
                courseCode = "INF211"
            )
        )
    }
}
