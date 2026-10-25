package com.example.data.model

import java.util.UUID

/**
 * Model data untuk jadwal perkuliahan mingguan dari Senin sampai Sabtu.
 */
data class CourseSchedule(
    val id: String = UUID.randomUUID().toString(),
    val dayOfWeek: Int, // 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
    val courseName: String,
    val timeRange: String,
    val room: String,
    val lecturer: String,
    val sks: Int = 3,
    val courseCode: String = ""
) {
    companion object {
        fun getDayName(day: Int): String {
            return when (day) {
                1 -> "Senin"
                2 -> "Selasa"
                3 -> "Rabu"
                4 -> "Kamis"
                5 -> "Jumat"
                6 -> "Sabtu"
                else -> "Senin"
            }
        }
    }
}
