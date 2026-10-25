package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Circle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.TaskEntity
import com.example.data.model.TaskPriority
import com.example.util.DateTimeUtils
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

/**
 * Kotak Ketiga: Kalender dengan Tanda Tanggal yang Memiliki Deadline.
 */
@Composable
fun DeadlineCalendarCard(
    allTasks: List<TaskEntity>,
    onToggleCompleted: (TaskEntity) -> Unit,
    onAddNewTaskForDate: (Long) -> Unit,
    isKetuaKelas: Boolean = false,
    showHeader: Boolean = true,
    modifier: Modifier = Modifier
) {
    var calendarMonthOffset by remember { mutableIntStateOf(0) }
    var selectedDateMillis by remember { mutableLongStateOf(DateTimeUtils.getStartOfDay()) }
    var selectedDateWithTasksMillis by remember { mutableStateOf<Long?>(null) }

    val currentMonthCalendar = remember(calendarMonthOffset) {
        Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            add(Calendar.MONTH, calendarMonthOffset)
            set(Calendar.DAY_OF_MONTH, 1)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
    }

    val daysInMonth = currentMonthCalendar.getActualMaximum(Calendar.DAY_OF_MONTH)
    val firstDayOfWeek = currentMonthCalendar.get(Calendar.DAY_OF_WEEK) // 1=Sunday, 2=Monday, ...
    val leadingEmptyDays = (firstDayOfWeek - Calendar.SUNDAY)

    // Map tasks to days of this month (to mark dates that have deadlines)
    val tasksByDay = remember(allTasks, currentMonthCalendar) {
        val map = mutableMapOf<Int, MutableList<TaskEntity>>()
        allTasks.forEach { task ->
            val taskCal = Calendar.getInstance().apply { timeInMillis = task.dueDateMillis }
            if (taskCal.get(Calendar.YEAR) == currentMonthCalendar.get(Calendar.YEAR) &&
                taskCal.get(Calendar.MONTH) == currentMonthCalendar.get(Calendar.MONTH)
            ) {
                val day = taskCal.get(Calendar.DAY_OF_MONTH)
                map.getOrPut(day) { mutableListOf() }.add(task)
            }
        }
        map
    }

    // Tasks for currently clicked/selected date
    val selectedDayTasks = remember(allTasks, selectedDateMillis) {
        val selCal = Calendar.getInstance().apply { timeInMillis = selectedDateMillis }
        allTasks.filter { task ->
            val taskCal = Calendar.getInstance().apply { timeInMillis = task.dueDateMillis }
            taskCal.get(Calendar.YEAR) == selCal.get(Calendar.YEAR) &&
            taskCal.get(Calendar.DAY_OF_YEAR) == selCal.get(Calendar.DAY_OF_YEAR)
        }
    }

    val monthYearFormat = remember { SimpleDateFormat("MMMM yyyy", Locale.forLanguageTag("id-ID")) }
    val monthTitle = monthYearFormat.format(currentMonthCalendar.time)

    val todayCalendar = Calendar.getInstance()
    val isCurrentViewingMonthThisMonth = todayCalendar.get(Calendar.YEAR) == currentMonthCalendar.get(Calendar.YEAR) &&
            todayCalendar.get(Calendar.MONTH) == currentMonthCalendar.get(Calendar.MONTH)
    val todayDayOfMonth = if (isCurrentViewingMonthThisMonth) todayCalendar.get(Calendar.DAY_OF_MONTH) else -1

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
            // Month Navigation Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFFFF5F5), RoundedCornerShape(10.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = { calendarMonthOffset-- },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Bulan Lalu",
                        tint = Color(0xFFB71C1C),
                        modifier = Modifier.size(16.dp)
                    )
                }

                Text(
                    text = monthTitle,
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB71C1C)
                )

                IconButton(
                    onClick = { calendarMonthOffset++ },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                        contentDescription = "Bulan Berikutnya",
                        tint = Color(0xFFB71C1C),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Weekday Headers (Min, Sen, Sel, Rab, Kam, Jum, Sab)
            Row(modifier = Modifier.fillMaxWidth()) {
                val dayHeaders = listOf("Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab")
                dayHeaders.forEachIndexed { index, header ->
                    Text(
                        text = header,
                        modifier = Modifier.weight(1f),
                        textAlign = TextAlign.Center,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (index == 0) Color(0xFFD32F2F) else Color(0xFF757575)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Calendar Grid (Senin - Sabtu + Minggu)
            val totalCells = leadingEmptyDays + daysInMonth
            val rows = (totalCells + 6) / 7

            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                for (rowIndex in 0 until rows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        for (colIndex in 0 until 7) {
                            val cellIndex = rowIndex * 7 + colIndex
                            val dayNumber = cellIndex - leadingEmptyDays + 1

                            if (cellIndex < leadingEmptyDays || dayNumber > daysInMonth) {
                                // Empty cell
                                Spacer(modifier = Modifier.weight(1f))
                            } else {
                                val dayTasks = tasksByDay[dayNumber] ?: emptyList()
                                val hasDeadline = dayTasks.isNotEmpty()
                                val pendingDeadlineCount = dayTasks.count { !it.isCompleted }

                                val cellDateCalendar = Calendar.getInstance().apply {
                                    timeInMillis = currentMonthCalendar.timeInMillis
                                    set(Calendar.DAY_OF_MONTH, dayNumber)
                                }
                                val cellDateMillis = DateTimeUtils.getStartOfDay(cellDateCalendar.timeInMillis)
                                val isSelected = cellDateMillis == selectedDateMillis
                                val isToday = dayNumber == todayDayOfMonth

                                // Cell Box
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(
                                            when {
                                                isSelected -> Color(0xFFD32F2F)
                                                hasDeadline && pendingDeadlineCount > 0 -> Color(0xFFFFEBEE)
                                                isToday -> Color(0xFFFFF9C4)
                                                else -> Color(0xFFFAFAFA)
                                            }
                                        )
                                        .border(
                                            width = 1.dp,
                                            color = when {
                                                isSelected -> Color(0xFFB71C1C)
                                                hasDeadline && pendingDeadlineCount > 0 -> Color(0xFFEF9A9A)
                                                isToday -> Color(0xFFFBC02D)
                                                else -> Color(0xFFEEEEEE)
                                            },
                                            shape = RoundedCornerShape(8.dp)
                                        )
                                        .clickable {
                                            selectedDateMillis = cellDateMillis
                                            if (dayTasks.isNotEmpty()) {
                                                selectedDateWithTasksMillis = cellDateMillis
                                            } else {
                                                selectedDateWithTasksMillis = null
                                            }
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center
                                    ) {
                                        Text(
                                            text = dayNumber.toString(),
                                            fontSize = 11.5.sp,
                                            fontWeight = if (hasDeadline || isSelected || isToday) FontWeight.Bold else FontWeight.Normal,
                                            color = when {
                                                isSelected -> Color.White
                                                hasDeadline && pendingDeadlineCount > 0 -> Color(0xFFC62828)
                                                colIndex == 0 -> Color(0xFFD32F2F) // Sunday
                                                else -> Color(0xFF212121)
                                            }
                                        )

                                        // TANDA DEADLINE (Titik Merah / Badge Indikator)
                                        if (hasDeadline) {
                                            Spacer(modifier = Modifier.height(2.dp))
                                            Row(
                                                horizontalArrangement = Arrangement.Center,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(5.dp)
                                                        .clip(CircleShape)
                                                        .background(
                                                            if (isSelected) Color.White
                                                            else if (pendingDeadlineCount > 0) Color(0xFFD32F2F)
                                                            else Color(0xFF2E7D32)
                                                        )
                                                )
                                                if (dayTasks.size > 1) {
                                                    Spacer(modifier = Modifier.width(2.dp))
                                                    Text(
                                                        text = "${dayTasks.size}",
                                                        fontSize = 7.5.sp,
                                                        fontWeight = FontWeight.Black,
                                                        color = if (isSelected) Color.White else Color(0xFFB71C1C)
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

            // Rincian Deadline HANYA muncul ketika tanggal yang memiliki tugas di-klik
            if (selectedDateWithTasksMillis != null) {
                val tasksOnDate = allTasks.filter { task ->
                    DateTimeUtils.isSameDay(task.dueDateMillis, selectedDateWithTasksMillis!!)
                }

                if (tasksOnDate.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(14.dp))
                    HorizontalDivider(color = Color(0xFFFFCDD2))
                    Spacer(modifier = Modifier.height(10.dp))

                    val selectedDateStr = DateTimeUtils.formatDate(selectedDateWithTasksMillis!!)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Tugas pada: $selectedDateStr",
                                fontSize = 12.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFB71C1C)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = CircleShape,
                                color = Color(0xFFFFEBEE)
                            ) {
                                Text(
                                    text = "${tasksOnDate.size} tugas",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFD32F2F),
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (isKetuaKelas) {
                                TextButton(
                                    onClick = { onAddNewTaskForDate(selectedDateWithTasksMillis!!) },
                                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color(0xFFD32F2F))
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text("+ Tambah", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFFD32F2F))
                                }
                            }
                            IconButton(
                                onClick = { selectedDateWithTasksMillis = null },
                                modifier = Modifier.size(26.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Close,
                                    contentDescription = "Tutup",
                                    tint = Color(0xFF757575),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        tasksOnDate.forEach { task ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = if (task.isCompleted) Color(0xFFF9FDF9) else Color(0xFFFFF0F0),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFCDD2)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { onToggleCompleted(task) }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = if (task.isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                        contentDescription = null,
                                        tint = if (task.isCompleted) Color(0xFF2E7D32) else Color(0xFFD32F2F),
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = task.title,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (task.isCompleted) Color.Gray else Color(0xFF212121),
                                            textDecoration = if (task.isCompleted) TextDecoration.LineThrough else TextDecoration.None
                                        )
                                        Text(
                                            text = "Jam: ${DateTimeUtils.formatTime(task.dueTimeHour, task.dueTimeMinute)} • Prioritas ${task.priority.displayName}",
                                            fontSize = 10.sp,
                                            color = Color(0xFF757575)
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
