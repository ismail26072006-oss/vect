package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CourseSchedule

/**
 * Kotak Pertama: Daftar Jadwal Perkuliahan dari Senin sampai Sabtu.
 */
@Composable
fun WeeklyScheduleCard(
    schedules: List<CourseSchedule>,
    onAddSchedule: (CourseSchedule) -> Unit,
    onDeleteSchedule: (String) -> Unit,
    isKetuaKelas: Boolean = false,
    modifier: Modifier = Modifier
) {
    var selectedDay by remember { mutableIntStateOf(1) } // 1=Sen, 2=Sel, 3=Rab, 4=Kam, 5=Jum, 6=Sab
    var showAddDialog by remember { mutableStateOf(false) }

    val daysList = listOf(
        1 to "Sen",
        2 to "Sel",
        3 to "Rab",
        4 to "Kam",
        5 to "Jum",
        6 to "Sab"
    )

    val currentDaySchedules = schedules.filter { it.dayOfWeek == selectedDay }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFCDD2))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header Kotak 1
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFFFEBEE),
                        modifier = Modifier.size(38.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.CalendarMonth,
                                contentDescription = null,
                                tint = Color(0xFFD32F2F),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Jadwal Kuliah Mingguan",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF212121)
                        )
                        Text(
                            text = "Daftar jadwal dari Senin sampai Sabtu",
                            fontSize = 11.sp,
                            color = Color(0xFF757575)
                        )
                    }
                }

                if (isKetuaKelas) {
                    Button(
                        onClick = { showAddDialog = true },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFD32F2F),
                            contentColor = Color.White
                        ),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.testTag("add_schedule_button")
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Tambah", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Tab Bar Hari: Sen s/d Sab (Muat dalam 1 layar tanpa slide)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                daysList.forEach { (dayNum, dayLabel) ->
                    val isSelected = selectedDay == dayNum
                    val count = schedules.count { it.dayOfWeek == dayNum }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (isSelected) Color(0xFFD32F2F) else Color(0xFFF5F5F5),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (isSelected) Color(0xFFB71C1C) else Color(0xFFE0E0E0)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { selectedDay = dayNum }
                    ) {
                        Column(
                            modifier = Modifier.padding(vertical = 7.dp, horizontal = 2.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = dayLabel,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else Color(0xFF424242)
                            )
                            if (count > 0) {
                                Spacer(modifier = Modifier.height(2.dp))
                                Surface(
                                    shape = CircleShape,
                                    color = if (isSelected) Color.White else Color(0xFFFFCDD2)
                                ) {
                                    Text(
                                        text = "$count",
                                        fontSize = 8.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Color(0xFFD32F2F) else Color(0xFFB71C1C),
                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 0.5.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Daftar Mata Kuliah pada Hari Terpilih
            if (currentDaySchedules.isEmpty()) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFFAFAFA),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Tidak ada jadwal kuliah hari ${CourseSchedule.getDayName(selectedDay)}",
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF757575)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Hari bebas kuliah atau digunakan untuk belajar mandiri.",
                            fontSize = 11.sp,
                            color = Color(0xFF9E9E9E)
                        )
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    currentDaySchedules.forEach { item ->
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Color(0xFFFFF9F9),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFEBEE)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = item.courseName,
                                            fontSize = 13.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFFB71C1C)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = Color(0xFFD32F2F)
                                        ) {
                                            Text(
                                                text = "${item.sks} SKS",
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White,
                                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(4.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Default.AccessTime,
                                                contentDescription = null,
                                                tint = Color(0xFF616161),
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(3.dp))
                                            Text(
                                                text = item.timeRange,
                                                fontSize = 11.sp,
                                                color = Color(0xFF424242),
                                                fontWeight = FontWeight.Medium
                                            )
                                        }

                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Default.LocationOn,
                                                contentDescription = null,
                                                tint = Color(0xFF616161),
                                                modifier = Modifier.size(12.dp)
                                            )
                                            Spacer(modifier = Modifier.width(3.dp))
                                            Text(
                                                text = item.room,
                                                fontSize = 11.sp,
                                                color = Color(0xFF424242)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(2.dp))

                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Person,
                                            contentDescription = null,
                                            tint = Color(0xFF757575),
                                            modifier = Modifier.size(12.dp)
                                        )
                                        Spacer(modifier = Modifier.width(3.dp))
                                        Text(
                                            text = item.lecturer,
                                            fontSize = 10.5.sp,
                                            color = Color(0xFF616161)
                                        )
                                    }
                                }

                                if (isKetuaKelas) {
                                    IconButton(
                                        onClick = { onDeleteSchedule(item.id) },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Delete,
                                            contentDescription = "Hapus Jadwal",
                                            tint = Color(0xFFE57373),
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Dialog Tambah Jadwal Baru
    if (showAddDialog) {
        var newCourseName by remember { mutableStateOf("") }
        var newTimeRange by remember { mutableStateOf("08:00 - 09:40 WITA") }
        var newRoom by remember { mutableStateOf("R. Kuliah 301") }
        var newLecturer by remember { mutableStateOf("Dosen Pengampu") }
        var newSks by remember { mutableIntStateOf(3) }
        var newDayOfWeek by remember { mutableIntStateOf(selectedDay) }

        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = {
                Text(
                    text = "Tambah Jadwal Perkuliahan",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    // Pilihan Hari
                    Column {
                        Text(text = "Hari Kuliah", fontSize = 11.5.sp, fontWeight = FontWeight.SemiBold)
                        Spacer(modifier = Modifier.height(4.dp))
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            items(daysList) { (dNum, dLabel) ->
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = if (newDayOfWeek == dNum) Color(0xFFD32F2F) else Color(0xFFF0F0F0),
                                    modifier = Modifier.clickable { newDayOfWeek = dNum }
                                ) {
                                    Text(
                                        text = dLabel,
                                        fontSize = 11.sp,
                                        color = if (newDayOfWeek == dNum) Color.White else Color.Black,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }

                    OutlinedTextField(
                        value = newCourseName,
                        onValueChange = { newCourseName = it },
                        label = { Text("Nama Mata Kuliah") },
                        placeholder = { Text("contoh: Pemrograman Web") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newTimeRange,
                        onValueChange = { newTimeRange = it },
                        label = { Text("Jam Kuliah") },
                        placeholder = { Text("contoh: 08:00 - 09:40 WITA") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newRoom,
                        onValueChange = { newRoom = it },
                        label = { Text("Ruangan / Lab") },
                        placeholder = { Text("contoh: Lab Komputer 2") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = newLecturer,
                        onValueChange = { newLecturer = it },
                        label = { Text("Dosen Pengampu") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newCourseName.isNotBlank()) {
                            onAddSchedule(
                                CourseSchedule(
                                    dayOfWeek = newDayOfWeek,
                                    courseName = newCourseName.trim(),
                                    timeRange = newTimeRange.trim(),
                                    room = newRoom.trim(),
                                    lecturer = newLecturer.trim(),
                                    sks = newSks
                                )
                            )
                            showAddDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))
                ) {
                    Text("Simpan Jadwal")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }
}
