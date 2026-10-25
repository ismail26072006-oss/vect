package com.example.ui.components

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.HourglassEmpty
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material.icons.filled.TaskAlt
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TaskEntity
import com.example.data.model.TaskPriority
import com.example.util.DateTimeUtils

/**
 * Kotak Kedua: Daftar Deadline Tugas Apa Saja.
 */
@Composable
fun TaskDeadlinesCard(
    tasks: List<TaskEntity>,
    onToggleCompleted: (TaskEntity) -> Unit,
    onEditTask: (TaskEntity) -> Unit,
    onDeleteTask: (TaskEntity) -> Unit,
    onAddNewTask: () -> Unit,
    isKetuaKelas: Boolean = false,
    modifier: Modifier = Modifier
) {
    var selectedFilter by remember { mutableIntStateOf(0) } // 0 = Semua, 1 = Belum Selesai, 2 = Selesai

    val filteredTasks = remember(tasks, selectedFilter) {
        val sorted = tasks.sortedBy { it.dueDateMillis }
        when (selectedFilter) {
            1 -> sorted.filter { !it.isCompleted }
            2 -> sorted.filter { it.isCompleted }
            else -> sorted
        }
    }

    val pendingCount = tasks.count { !it.isCompleted }
    val completedCount = tasks.count { it.isCompleted }

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
            // Header Kotak 2
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
                                imageVector = Icons.Default.Alarm,
                                contentDescription = null,
                                tint = Color(0xFFD32F2F),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = "Deadline Tugas Kuliah",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF212121)
                        )
                        Text(
                            text = "Pantau semua tenggat waktu pengumpulan tugas",
                            fontSize = 11.sp,
                            color = Color(0xFF757575)
                        )
                    }
                }

                if (isKetuaKelas) {
                    Button(
                        onClick = onAddNewTask,
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFFD32F2F),
                            contentColor = Color.White
                        ),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.testTag("add_deadline_task_button")
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Tambah", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Filter status chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                StatusFilterChip(
                    label = "Semua (${tasks.size})",
                    selected = selectedFilter == 0,
                    onClick = { selectedFilter = 0 }
                )
                StatusFilterChip(
                    label = "Belum Selesai ($pendingCount)",
                    selected = selectedFilter == 1,
                    onClick = { selectedFilter = 1 }
                )
                StatusFilterChip(
                    label = "Selesai ($completedCount)",
                    selected = selectedFilter == 2,
                    onClick = { selectedFilter = 2 }
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Daftar Tugas Deadline
            if (filteredTasks.isEmpty()) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFFAFAFA),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(18.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = if (tasks.isEmpty()) "Belum ada deadline tugas terdaftar" else "Tidak ada tugas dengan status ini",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF757575)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Tekan tombol + Tambah untuk mencatat tugas baru.",
                            fontSize = 11.sp,
                            color = Color(0xFF9E9E9E)
                        )
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    filteredTasks.forEach { task ->
                        val isOverdue = DateTimeUtils.isOverdue(task.dueDateMillis, task.dueTimeHour, task.dueTimeMinute, task.isCompleted)
                        val todayStart = DateTimeUtils.getStartOfDay()
                        val taskDayStart = DateTimeUtils.getStartOfDay(task.dueDateMillis)
                        val isToday = taskDayStart == todayStart
                        val oneDayMillis = 24 * 60 * 60 * 1000L
                        val daysRemaining = ((taskDayStart - todayStart) / oneDayMillis).toInt()

                        val deadlineText = when {
                            task.isCompleted -> "Selesai"
                            isOverdue -> "⚠️ Lewat Deadline!"
                            isToday -> "🔴 Deadline Hari Ini!"
                            daysRemaining == 1 -> "🟠 Deadline Besok"
                            daysRemaining in 2..7 -> "⏱️ $daysRemaining hari lagi"
                            else -> DateTimeUtils.formatDate(task.dueDateMillis)
                        }

                        val deadlineBgColor = when {
                            task.isCompleted -> Color(0xFFE8F5E9)
                            isOverdue -> Color(0xFFFFEBEE)
                            isToday -> Color(0xFFFFEBEE)
                            daysRemaining == 1 -> Color(0xFFFFF3E0)
                            else -> Color(0xFFF5F5F5)
                        }

                        val deadlineTextColor = when {
                            task.isCompleted -> Color(0xFF2E7D32)
                            isOverdue || isToday -> Color(0xFFC62828)
                            daysRemaining == 1 -> Color(0xFFE65100)
                            else -> Color(0xFF616161)
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (task.isCompleted) Color(0xFFF9FDF9) else Color(0xFFFFFFFF),
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (isToday && !task.isCompleted) Color(0xFFEF5350) else Color(0xFFEEEEEE)
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onToggleCompleted(task) }
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Status Checkbox
                                IconButton(
                                    onClick = { onToggleCompleted(task) },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(
                                        imageVector = if (task.isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                        contentDescription = null,
                                        tint = if (task.isCompleted) Color(0xFF2E7D32) else Color(0xFFD32F2F),
                                        modifier = Modifier.size(22.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(8.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Text(
                                            text = task.title,
                                            fontSize = 13.5.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (task.isCompleted) Color.Gray else Color(0xFF212121),
                                            textDecoration = if (task.isCompleted) TextDecoration.LineThrough else TextDecoration.None,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            modifier = Modifier.weight(1f)
                                        )

                                        // Priority badge
                                        Surface(
                                            shape = RoundedCornerShape(4.dp),
                                            color = when (task.priority) {
                                                TaskPriority.TINGGI -> Color(0xFFFFEBEE)
                                                TaskPriority.SEDANG -> Color(0xFFFFF3E0)
                                                TaskPriority.RENDAH -> Color(0xFFE8F5E9)
                                            }
                                        ) {
                                            Text(
                                                text = task.priority.displayName,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = when (task.priority) {
                                                    TaskPriority.TINGGI -> Color(0xFFB71C1C)
                                                    TaskPriority.SEDANG -> Color(0xFFE65100)
                                                    TaskPriority.RENDAH -> Color(0xFF2E7D32)
                                                },
                                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(4.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        // Deadline Status Pill
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = deadlineBgColor
                                        ) {
                                            Text(
                                                text = deadlineText,
                                                fontSize = 10.5.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = deadlineTextColor,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }

                                        Text(
                                            text = "${DateTimeUtils.formatDate(task.dueDateMillis)} • ${DateTimeUtils.formatTime(task.dueTimeHour, task.dueTimeMinute)}",
                                            fontSize = 11.sp,
                                            color = Color(0xFF757575)
                                        )

                                        if (task.isClassTask) {
                                            Surface(
                                                shape = RoundedCornerShape(4.dp),
                                                color = Color(0xFFFFEBEE)
                                            ) {
                                                Text(
                                                    text = "Tugas Kelas",
                                                    fontSize = 9.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Color(0xFFD32F2F),
                                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                                )
                                            }
                                        }
                                    }
                                }

                                if (isKetuaKelas) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        IconButton(
                                            onClick = { onEditTask(task) },
                                            modifier = Modifier.size(26.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Edit,
                                                contentDescription = "Edit",
                                                tint = Color(0xFF757575),
                                                modifier = Modifier.size(15.dp)
                                            )
                                        }

                                        IconButton(
                                            onClick = { onDeleteTask(task) },
                                            modifier = Modifier.size(26.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Hapus",
                                                tint = Color(0xFFE57373),
                                                modifier = Modifier.size(15.dp)
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
    }
}

@Composable
private fun StatusFilterChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = if (selected) Color(0xFFD32F2F) else Color(0xFFF5F5F5),
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (selected) Color(0xFFB71C1C) else Color(0xFFE0E0E0)
        ),
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
    ) {
        Text(
            text = label,
            fontSize = 11.5.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
            color = if (selected) Color.White else Color(0xFF424242),
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
        )
    }
}
