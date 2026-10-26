package com.example.ui.screens

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.lazy.LazyRow
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Alarm
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.EventNote
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Laptop
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Poll
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.model.TaskEntity
import com.example.data.model.UserRole
import com.example.ui.components.ClassManagementDialog
import com.example.ui.components.DeadlineCalendarCard
import com.example.ui.components.StudentBiodataCard
import com.example.ui.components.SyncBackupDialog
import com.example.ui.components.TaskDeadlinesCard
import com.example.ui.components.TaskEditDialog
import com.example.ui.components.ThemeSettingDialog
import com.example.ui.components.WeeklyScheduleCard
import com.example.ui.theme.ThemeMode
import com.example.ui.viewmodel.TaskViewModel

enum class MainNavPage {
    DASHBOARD,
    BIODATA
}

enum class DashboardTab(
    val title: String,
    val shortLabel: String
) {
    SEMUA("Semua Fitur", "Semua"),
    JADWAL("Jadwal Mata Kuliah", "Jadwal MK"),
    TUGAS("Deadline Tugas", "Tugas"),
    KALENDER("Kalender Akademik", "Kalender")
}

data class FeatureTabItem(
    val tab: DashboardTab,
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val count: Int,
    val testTag: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: TaskViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val currentUser by viewModel.currentUser.collectAsStateWithLifecycle()

    val allTasks by viewModel.allTasks.collectAsStateWithLifecycle()
    val schedules by viewModel.schedules.collectAsStateWithLifecycle()
    val stats by viewModel.productivityStats.collectAsStateWithLifecycle()
    val themeMode by viewModel.themeMode.collectAsStateWithLifecycle()

    var activeNavPage by remember { mutableStateOf(MainNavPage.DASHBOARD) }
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val coroutineScope = rememberCoroutineScope()

    var selectedFeatureTab by remember { mutableStateOf(DashboardTab.SEMUA) }

    val featureTabs = remember(schedules.size, allTasks) {
        listOf(
            FeatureTabItem(
                tab = DashboardTab.SEMUA,
                label = "Semua",
                icon = Icons.Default.GridView,
                count = schedules.size + allTasks.size,
                testTag = "tab_semua"
            ),
            FeatureTabItem(
                tab = DashboardTab.JADWAL,
                label = "Jadwal MK",
                icon = Icons.Default.School,
                count = schedules.size,
                testTag = "tab_jadwal_mk"
            ),
            FeatureTabItem(
                tab = DashboardTab.TUGAS,
                label = "Tugas",
                icon = Icons.Default.Alarm,
                count = allTasks.count { !it.isCompleted },
                testTag = "tab_tugas"
            ),
            FeatureTabItem(
                tab = DashboardTab.KALENDER,
                label = "Kalender",
                icon = Icons.Default.CalendarMonth,
                count = allTasks.size,
                testTag = "tab_kalender"
            )
        )
    }

    var showTaskEditDialog by remember { mutableStateOf(false) }
    var taskToEdit by remember { mutableStateOf<TaskEntity?>(null) }
    var showThemeDialog by remember { mutableStateOf(false) }
    var showSyncDialog by remember { mutableStateOf(false) }
    var showClassDialog by remember { mutableStateOf(false) }
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var dateForNewTask by remember { mutableStateOf<Long?>(null) }
    var isCreatingBroadcastTask by remember { mutableStateOf(false) }
    var showProfileDropdown by remember { mutableStateOf(false) }

    // Request Notification permission on Android 13+ (API 33+)
    val notificationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { _ -> }

    LaunchedEffect(Unit) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val permissionCheck = ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.POST_NOTIFICATIONS
            )
            if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    // TAMPILAN 1: Masuk Kelas seperti Screenshot 1 (jika belum masuk / jika logout)
    if (!currentUser.isLoggedIn) {
        LoginClassScreen(
            viewModel = viewModel,
            modifier = modifier
        )
        return
    }

    BackHandler(enabled = activeNavPage != MainNavPage.DASHBOARD || drawerState.isOpen) {
        if (drawerState.isOpen) {
            coroutineScope.launch { drawerState.close() }
        } else {
            activeNavPage = MainNavPage.DASHBOARD
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        gesturesEnabled = true,
        drawerContent = {
            ModalDrawerSheet(
                modifier = Modifier.width(285.dp),
                drawerContainerColor = Color.White
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(vertical = 12.dp, horizontal = 12.dp)
                ) {
                    // Header SIAKAD seperti di Screenshot Pengguna
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp, top = 6.dp, start = 4.dp, end = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0xFFD32F2F),
                                modifier = Modifier.size(34.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.MenuBook,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "Vectoreal Education",
                                    fontSize = 14.5.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFFD32F2F)
                                )
                                Text(
                                    text = "SISTEM INFORMASI AKADEMIK",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF757575),
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }

                        IconButton(
                            onClick = { coroutineScope.launch { drawerState.close() } },
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.ChevronLeft,
                                contentDescription = "Tutup Menu",
                                tint = Color(0xFF616161)
                            )
                        }
                    }

                    HorizontalDivider(color = Color(0xFFEEEEEE))
                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Menu Utama",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF9E9E9E),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)
                    )

                    // Menu 1: Dashboard
                    DrawerItemRow(
                        title = "Dashboard",
                        icon = Icons.Default.Dashboard,
                        isSelected = activeNavPage == MainNavPage.DASHBOARD,
                        onClick = {
                            activeNavPage = MainNavPage.DASHBOARD
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 2: Biodata (Dipisahkan Mandiri sesuai Screenshot)
                    DrawerItemRow(
                        title = "Biodata",
                        icon = Icons.Default.Badge,
                        isSelected = activeNavPage == MainNavPage.BIODATA,
                        onClick = {
                            activeNavPage = MainNavPage.BIODATA
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 3: Kurikulum
                    DrawerItemRow(
                        title = "Kurikulum",
                        icon = Icons.Default.Description,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Kurikulum Akademik Terintegrasi UNG", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 4: Biaya Kuliah
                    DrawerItemRow(
                        title = "Biaya Kuliah",
                        icon = Icons.Default.CreditCard,
                        hasChevron = true,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Status UKT Semester: Lunas", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 5: Perkuliahan
                    DrawerItemRow(
                        title = "Perkuliahan",
                        icon = Icons.Default.EventNote,
                        hasChevron = true,
                        isSelected = false,
                        onClick = {
                            activeNavPage = MainNavPage.DASHBOARD
                            selectedFeatureTab = DashboardTab.JADWAL
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 6: E-Learning
                    DrawerItemRow(
                        title = "E-Learning",
                        icon = Icons.Default.Laptop,
                        hasChevron = true,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Portal E-Learning UNG", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 7: MBKM
                    DrawerItemRow(
                        title = "MBKM",
                        icon = Icons.Default.School,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Merdeka Belajar Kampus Merdeka", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 8: Kuesioner
                    DrawerItemRow(
                        title = "Kuesioner",
                        icon = Icons.Default.Poll,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Kuesioner Evaluasi Perkuliahan", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 9: Decision Support
                    DrawerItemRow(
                        title = "Decision Support",
                        icon = Icons.Default.AssignmentTurnedIn,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Sistem Pendukung Keputusan", Toast.LENGTH_SHORT).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )

                    // Menu 10: Butuh Bantuan?
                    DrawerItemRow(
                        title = "Butuh Bantuan?",
                        icon = Icons.Default.HelpOutline,
                        isSelected = false,
                        onClick = {
                            Toast.makeText(context, "Layanan Helpdesk: mahasiswa.ung.ac.id", Toast.LENGTH_LONG).show()
                            coroutineScope.launch { drawerState.close() }
                        }
                    )
                }
            }
        }
    ) {
        // TAMPILAN UTAMA WEB SIAKAD UNG
        Scaffold(
            modifier = modifier.fillMaxSize(),
            topBar = {
                Column(modifier = Modifier.fillMaxWidth()) {
                    // Web Navbar Putih (Hamburger Menu drawer, Info Pengguna, Avatar Profil + Dropdown)
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = Color.White,
                        tonalElevation = 2.dp,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 12.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                IconButton(
                                    onClick = { coroutineScope.launch { drawerState.open() } },
                                    modifier = Modifier.size(36.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Menu,
                                        contentDescription = "Buka Menu Utama",
                                        tint = Color(0xFF424242)
                                    )
                                }

                                Spacer(modifier = Modifier.width(6.dp))

                                // Divider vertikal '|' ala web portal SIAKAD (Screenshot 011844)
                                Box(
                                    modifier = Modifier
                                        .height(20.dp)
                                        .width(1.dp)
                                        .background(Color(0xFFE0E0E0))
                                )

                                Spacer(modifier = Modifier.width(10.dp))

                                Column {
                                    Text(
                                        text = if (activeNavPage == MainNavPage.DASHBOARD) "Selamat Datang, ${currentUser.name.uppercase()}" else "Biodata Mahasiswa",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF212121),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = if (activeNavPage == MainNavPage.DASHBOARD) "${currentUser.className} • ${currentUser.classCode}" else "Universitas Negeri Gorontalo",
                                        fontSize = 10.5.sp,
                                        color = Color(0xFF757575)
                                    )
                                }
                            }

                            // Profile Avatar & Dropdown Menu
                            Box {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(20.dp))
                                        .clickable { showProfileDropdown = true }
                                        .padding(horizontal = 6.dp, vertical = 4.dp)
                                ) {
                                    Surface(
                                        shape = CircleShape,
                                        color = Color(0xFFFFEBEE),
                                        border = androidx.compose.foundation.BorderStroke(1.5.dp, Color(0xFFD32F2F)),
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Icon(
                                                imageVector = if (currentUser.isKetuaKelas) Icons.Default.Security else Icons.Default.Person,
                                                contentDescription = null,
                                                tint = Color(0xFFD32F2F),
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }

                                    Icon(
                                        imageVector = Icons.Default.ArrowDropDown,
                                        contentDescription = null,
                                        tint = Color(0xFF757575),
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                DropdownMenu(
                                    expanded = showProfileDropdown,
                                    onDismissRequest = { showProfileDropdown = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("Lihat Biodata Lengkap") },
                                        leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            activeNavPage = MainNavPage.BIODATA
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Ubah Profil & NIM") },
                                        leadingIcon = { Icon(Icons.Default.Edit, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            showEditProfileDialog = true
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Kelola Kelas (${currentUser.classCode})") },
                                        leadingIcon = { Icon(Icons.Default.Group, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            showClassDialog = true
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text(if (currentUser.isKetuaKelas) "Beralih ke Mahasiswa" else "Beralih ke Ketua Kelas") },
                                        leadingIcon = { Icon(Icons.Default.SwapHoriz, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            val newRole = if (currentUser.isKetuaKelas) UserRole.MAHASISWA else UserRole.KETUA_KELAS
                                            viewModel.switchRole(newRole)
                                            Toast.makeText(context, "Peran diubah ke ${newRole.displayName}", Toast.LENGTH_SHORT).show()
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Sinkronisasi & Backup") },
                                        leadingIcon = { Icon(Icons.Default.Sync, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            showSyncDialog = true
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Ubah Tema") },
                                        leadingIcon = {
                                            Icon(
                                                imageVector = if (themeMode == ThemeMode.DARK) Icons.Default.DarkMode else Icons.Default.LightMode,
                                                contentDescription = null,
                                                tint = Color(0xFFD32F2F)
                                            )
                                        },
                                        onClick = {
                                            showProfileDropdown = false
                                            showThemeDialog = true
                                        }
                                    )
                                    HorizontalDivider()
                                    DropdownMenuItem(
                                        text = { Text("Keluar / Ganti Akun", color = Color(0xFFD32F2F), fontWeight = FontWeight.Bold) },
                                        leadingIcon = { Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = Color(0xFFD32F2F)) },
                                        onClick = {
                                            showProfileDropdown = false
                                            viewModel.logout()
                                            Toast.makeText(context, "Kembali ke halaman masuk kelas", Toast.LENGTH_SHORT).show()
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // 3. Tab Bar Opsi Perpindahan (Semua, Jadwal MK, Tugas, Kalender - Muat 1 Layar Tanpa Slide)
                    if (activeNavPage == MainNavPage.DASHBOARD) {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = Color.White,
                            tonalElevation = 2.dp,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE))
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 8.dp, vertical = 7.dp),
                                horizontalArrangement = Arrangement.spacedBy(4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                featureTabs.forEach { item ->
                                    val isSelected = selectedFeatureTab == item.tab

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
                                            .clickable { selectedFeatureTab = item.tab }
                                            .testTag(item.testTag)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(vertical = 7.dp, horizontal = 2.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.Center
                                        ) {
                                            Text(
                                                text = item.label,
                                                fontSize = 11.5.sp,
                                                fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.SemiBold,
                                                color = if (isSelected) Color.White else Color(0xFF424242),
                                                maxLines = 1
                                            )
                                            if (item.count > 0) {
                                                Spacer(modifier = Modifier.width(3.dp))
                                                Surface(
                                                    shape = CircleShape,
                                                    color = if (isSelected) Color.White else Color(0xFFFFCDD2)
                                                ) {
                                                    Text(
                                                        text = "${item.count}",
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
                        }
                    }
                }
            }
        ) { innerPadding ->
            if (activeNavPage == MainNavPage.DASHBOARD) {
                // HALAMAN 1: DASHBOARD
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFF7F7F7))
                        .padding(innerPadding)
                        .padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Container Merah DASHBOARD
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFD32F2F)), // Merah SIAKAD
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(14.dp)
                            ) {
                                // Judul Dashboard ala Web Portal SIAKAD (Screenshot 011844)
                                if (selectedFeatureTab != DashboardTab.KALENDER) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column {
                                        Text(
                                            text = when (selectedFeatureTab) {
                                                DashboardTab.SEMUA -> "Dashboard"
                                                DashboardTab.JADWAL -> "Jadwal Mata Kuliah"
                                                DashboardTab.TUGAS -> "Deadline Tugas"
                                                DashboardTab.KALENDER -> ""
                                            },
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                        if (selectedFeatureTab != DashboardTab.SEMUA) {
                                            Text(
                                                text = when (selectedFeatureTab) {
                                                    DashboardTab.JADWAL -> "Daftar jadwal perkuliahan dari Sen s/d Sab"
                                                    DashboardTab.TUGAS -> "${allTasks.count { !it.isCompleted }} tugas aktif perlu diselesaikan"
                                                    else -> ""
                                                },
                                                fontSize = 11.sp,
                                                color = Color.White.copy(alpha = 0.85f)
                                            )
                                        }
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(12.dp),
                                        color = Color.White.copy(alpha = 0.2f)
                                    ) {
                                        Text(
                                            text = "${currentUser.className} • ${currentUser.classCode}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                        )
                                    }
                                }
                                }

                                // TAMPILAN FITUR TERPISAH (Dengan hak akses Ketua Kelas / Mahasiswa Biasa)
                                AnimatedContent(
                                    targetState = selectedFeatureTab,
                                    transitionSpec = {
                                        fadeIn(animationSpec = tween(200)) togetherWith fadeOut(animationSpec = tween(150))
                                    },
                                    label = "FeatureSwitchAnimation"
                                ) { currentTab ->
                                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                        when (currentTab) {
                                            DashboardTab.SEMUA -> {
                                                // 3 KPI Akademik Sesuai Screenshot SIAKAD 011844
                                                AcademicKpiCards()

                                                WeeklyScheduleCard(
                                                    schedules = schedules,
                                                    onAddSchedule = { viewModel.addSchedule(it) },
                                                    onDeleteSchedule = { viewModel.deleteSchedule(it) },
                                                    isKetuaKelas = currentUser.isKetuaKelas
                                                )
                                                TaskDeadlinesCard(
                                                    tasks = allTasks,
                                                    onToggleCompleted = { viewModel.toggleTaskCompletion(it) },
                                                    onEditTask = {
                                                        taskToEdit = it
                                                        isCreatingBroadcastTask = it.isClassTask
                                                        showTaskEditDialog = true
                                                    },
                                                    onDeleteTask = { viewModel.deleteTask(it) },
                                                    onAddNewTask = {
                                                        taskToEdit = null
                                                        dateForNewTask = null
                                                        isCreatingBroadcastTask = currentUser.isKetuaKelas
                                                        showTaskEditDialog = true
                                                    },
                                                    isKetuaKelas = currentUser.isKetuaKelas
                                                )
                                                DeadlineCalendarCard(
                                                    allTasks = allTasks,
                                                    onToggleCompleted = { viewModel.toggleTaskCompletion(it) },
                                                    onAddNewTaskForDate = { dateMillis ->
                                                        taskToEdit = null
                                                        dateForNewTask = dateMillis
                                                        isCreatingBroadcastTask = currentUser.isKetuaKelas
                                                        showTaskEditDialog = true
                                                    },
                                                    isKetuaKelas = currentUser.isKetuaKelas
                                                )
                                            }
                                            DashboardTab.JADWAL -> {
                                                WeeklyScheduleCard(
                                                    schedules = schedules,
                                                    onAddSchedule = { viewModel.addSchedule(it) },
                                                    onDeleteSchedule = { viewModel.deleteSchedule(it) },
                                                    isKetuaKelas = currentUser.isKetuaKelas
                                                )
                                            }
                                            DashboardTab.TUGAS -> {
                                                TaskDeadlinesCard(
                                                    tasks = allTasks,
                                                    onToggleCompleted = { viewModel.toggleTaskCompletion(it) },
                                                    onEditTask = {
                                                        taskToEdit = it
                                                        isCreatingBroadcastTask = it.isClassTask
                                                        showTaskEditDialog = true
                                                    },
                                                    onDeleteTask = { viewModel.deleteTask(it) },
                                                    onAddNewTask = {
                                                        taskToEdit = null
                                                        dateForNewTask = null
                                                        isCreatingBroadcastTask = currentUser.isKetuaKelas
                                                        showTaskEditDialog = true
                                                    },
                                                    isKetuaKelas = currentUser.isKetuaKelas
                                                )
                                            }
                                            DashboardTab.KALENDER -> {
                                                DeadlineCalendarCard(
                                                    allTasks = allTasks,
                                                    onToggleCompleted = { viewModel.toggleTaskCompletion(it) },
                                                    onAddNewTaskForDate = { dateMillis ->
                                                        taskToEdit = null
                                                        dateForNewTask = dateMillis
                                                        isCreatingBroadcastTask = currentUser.isKetuaKelas
                                                        showTaskEditDialog = true
                                                    },
                                                    isKetuaKelas = currentUser.isKetuaKelas,
                                                    showHeader = false
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Kartu Akses Biodata Mahasiswa (Screenshot SIAKAD 011844)
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .clickable { activeNavPage = MainNavPage.BIODATA },
                            shape = RoundedCornerShape(14.dp),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE))
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Color(0xFFFFEBEE),
                                    modifier = Modifier.size(42.dp)
                                ) {
                                    Box(contentAlignment = Alignment.Center) {
                                        Icon(
                                            imageVector = Icons.Default.Badge,
                                            contentDescription = null,
                                            tint = Color(0xFFD32F2F),
                                            modifier = Modifier.size(24.dp)
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.width(14.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "Biodata Mahasiswa",
                                        fontSize = 15.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF212121)
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "Lengkapi biodata untuk pelaporan data ke PDDikti (Pangkalan Data Pendidikan Tinggi)",
                                        fontSize = 11.5.sp,
                                        color = Color(0xFF757575),
                                        lineHeight = 16.sp
                                    )
                                }
                                Icon(
                                    imageVector = Icons.Default.ChevronRight,
                                    contentDescription = "Buka Biodata",
                                    tint = Color(0xFF9E9E9E),
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }

                    // Web Portal Footer
                    item {
                        WebPortalFooter()
                    }
                }
            } else {
                // HALAMAN 2: BIODATA MAHASISWA (TERPISAH DARI DASHBOARD SEPERTI PADA SCREENSHOT)
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFF7F7F7))
                        .padding(innerPadding)
                        .padding(horizontal = 14.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Header Banner Biodata
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFD32F2F)),
                            elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.Badge, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = "Biodata Mahasiswa",
                                            fontSize = 17.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(3.dp))
                                    Text(
                                        text = "Sistem Informasi Akademik Universitas Negeri Gorontalo",
                                        fontSize = 10.5.sp,
                                        color = Color.White.copy(alpha = 0.88f)
                                    )
                                }

                                Button(
                                    onClick = { activeNavPage = MainNavPage.DASHBOARD },
                                    shape = RoundedCornerShape(8.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color(0xFFD32F2F)),
                                    contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text("Dashboard", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    // Kartu Biodata Mahasiswa
                    item {
                        StudentBiodataCard(
                            userProfile = currentUser,
                            totalTasksCount = allTasks.size,
                            completedTasksCount = stats.completedCount,
                            onOpenEditProfile = { showEditProfileDialog = true },
                            onLogoutToLoginScreen = {
                                viewModel.logout()
                                Toast.makeText(context, "Keluar dari sesi", Toast.LENGTH_SHORT).show()
                            },
                            onSwitchRole = { newRole ->
                                viewModel.switchRole(newRole)
                                Toast.makeText(context, "Peran beralih ke ${newRole.displayName}", Toast.LENGTH_SHORT).show()
                            }
                        )
                    }

                    // Informasi Akademik & PDDikti
                    item {
                        AcademicDetailsCard(userProfile = currentUser)
                    }

                    // Web Portal Footer
                    item {
                        WebPortalFooter()
                    }
                }
            }
        }
    }

    // Dialog Ubah Profil & NIM
    if (showEditProfileDialog) {
        var tempName by remember { mutableStateOf(currentUser.name) }
        var tempNim by remember { mutableStateOf(currentUser.nim) }

        AlertDialog(
            onDismissRequest = { showEditProfileDialog = false },
            title = { Text("Ubah Biodata Mahasiswa", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = tempName,
                        onValueChange = { tempName = it },
                        label = { Text("Nama Mahasiswa") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = tempNim,
                        onValueChange = { tempNim = it },
                        label = { Text("NIM") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.updateProfile(tempName, tempNim)
                        showEditProfileDialog = false
                        Toast.makeText(context, "Biodata berhasil diperbarui!", Toast.LENGTH_SHORT).show()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))
                ) {
                    Text("Simpan")
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditProfileDialog = false }) {
                    Text("Batal")
                }
            }
        )
    }

    // Dialog Tambah / Edit Tugas Deadline
    if (showTaskEditDialog) {
        TaskEditDialog(
            initialTask = taskToEdit,
            defaultDateMillis = dateForNewTask ?: System.currentTimeMillis(),
            isKetuaKelas = currentUser.isKetuaKelas || isCreatingBroadcastTask,
            classCode = currentUser.classCode,
            onDismiss = {
                showTaskEditDialog = false
                isCreatingBroadcastTask = false
            },
            onSaveTask = { id, title, desc, prio, cat, dueMillis, dueH, dueM, hasRem, remMillis, subTasks, isClassTask ->
                viewModel.saveTask(
                    id = id,
                    title = title,
                    description = desc,
                    priority = prio,
                    category = cat,
                    dueDateMillis = dueMillis,
                    dueHour = dueH,
                    dueMinute = dueM,
                    hasReminder = hasRem,
                    reminderEpochMillis = remMillis,
                    subTasks = subTasks,
                    isClassTask = isClassTask || isCreatingBroadcastTask
                )
                showTaskEditDialog = false
                isCreatingBroadcastTask = false
                Toast.makeText(context, "Tugas deadline berhasil disimpan!", Toast.LENGTH_SHORT).show()
            }
        )
    }

    // Dialog Kelola Kelas & Bagikan Tautan
    if (showClassDialog) {
        ClassManagementDialog(
            userProfile = currentUser,
            onDismiss = { showClassDialog = false },
            onCreateClass = { className, classCode, creatorName, leaderPin ->
                viewModel.createClass(className, classCode, creatorName, leaderPin)
                showClassDialog = false
                Toast.makeText(context, "Kelas baru $classCode berhasil dibuat!", Toast.LENGTH_SHORT).show()
            },
            onJoinClass = { classCode, studentName, isLeader ->
                viewModel.joinClassByCode(classCode, studentName, isLeader)
                showClassDialog = false
                Toast.makeText(context, "Bergabung ke kelas $classCode!", Toast.LENGTH_SHORT).show()
            },
            onAddAuthorizedLeader = { nameOrNim ->
                viewModel.addAuthorizedLeader(nameOrNim)
                Toast.makeText(context, "$nameOrNim ditambahkan sebagai Ketua Kelas!", Toast.LENGTH_SHORT).show()
            },
            onSwitchRole = { newRole ->
                viewModel.switchRole(newRole)
                Toast.makeText(context, "Peran beralih ke ${newRole.displayName}", Toast.LENGTH_SHORT).show()
            },
            onUpdateLeaderPin = { newPin ->
                viewModel.updateLeaderPin(newPin)
                Toast.makeText(context, "PIN diperbarui!", Toast.LENGTH_SHORT).show()
            }
        )
    }

    // Dialog Sinkronisasi & Ekspor JSON
    if (showSyncDialog) {
        SyncBackupDialog(
            onDismiss = { showSyncDialog = false },
            onExportData = { viewModel.exportJson() },
            onImportData = { jsonContent -> viewModel.importJson(jsonContent) }
        )
    }

    // Dialog Pengaturan Tema
    if (showThemeDialog) {
        ThemeSettingDialog(
            currentThemeMode = themeMode,
            onSelectThemeMode = { mode -> viewModel.setThemeMode(mode) },
            onDismiss = { showThemeDialog = false }
        )
    }
}

@Composable
private fun DrawerItemRow(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isSelected: Boolean,
    hasChevron: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = if (isSelected) Color(0xFFFFEBEE) else Color.Transparent,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (isSelected) Color(0xFFD32F2F) else Color(0xFF616161),
                    modifier = Modifier.size(19.dp)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Text(
                    text = title,
                    fontSize = 13.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                    color = if (isSelected) Color(0xFFD32F2F) else Color(0xFF333333)
                )
            }
            if (hasChevron) {
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = Color(0xFFBDBDBD),
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

@Composable
private fun AcademicDetailsCard(
    userProfile: com.example.data.model.UserProfile,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0E0E0))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFFEBEE),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.School,
                            contentDescription = null,
                            tint = Color(0xFFD32F2F),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "Informasi Status Akademik",
                        fontSize = 14.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                    Text(
                        text = "Data Terdaftar PDDIKTI Kemdikbudristek",
                        fontSize = 11.sp,
                        color = Color(0xFF757575)
                    )
                }
            }

            HorizontalDivider(color = Color(0xFFF0F0F0))

            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                AcademicInfoRow(label = "Perguruan Tinggi", value = "Universitas Negeri Gorontalo (UNG)")
                AcademicInfoRow(label = "Fakultas", value = "Fakultas Teknik / MIPA")
                AcademicInfoRow(label = "Program Studi", value = "S1 Sistem Informasi")
                AcademicInfoRow(label = "Semester / TA", value = "Semester Gasal 2024/2025")
                AcademicInfoRow(label = "Kelas Terdaftar", value = "${userProfile.className} (${userProfile.classCode})")
                AcademicInfoRow(label = "Status Mahasiswa", value = "Aktif Kuliah", isHighlighted = true)
                AcademicInfoRow(label = "Peran Pengguna", value = userProfile.role.displayName)
            }
        }
    }
}

@Composable
private fun AcademicInfoRow(
    label: String,
    value: String,
    isHighlighted: Boolean = false
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            color = Color(0xFF757575),
            modifier = Modifier.weight(0.42f)
        )
        Text(
            text = value,
            fontSize = 12.5.sp,
            fontWeight = if (isHighlighted) FontWeight.Bold else FontWeight.SemiBold,
            color = if (isHighlighted) Color(0xFF2E7D32) else Color(0xFF212121),
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.58f)
        )
    }
}

@Composable
private fun WebPortalFooter(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp, horizontal = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            text = "Vectoreal Education • Sistem Informasi Akademik",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF757575)
        )
        Text(
            text = "Universitas Negeri Gorontalo",
            fontSize = 10.sp,
            color = Color(0xFF9E9E9E)
        )
        Text(
            text = "mahasiswa.vectoreal.education",
            fontSize = 9.5.sp,
            color = Color(0xFFBDBDBD)
        )
    }
}

@Composable
private fun AcademicKpiCards(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Row 1: IPK & Tunggakan
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Card 1: IPK
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "IPK",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF616161)
                        )
                        Icon(
                            imageVector = Icons.Default.School,
                            contentDescription = null,
                            tint = Color(0xFFD32F2F),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "3.48",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Sangat Memuaskan",
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color(0xFF2E7D32)
                    )
                }
            }

            // Card 2: Total Tunggakan
            Card(
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "Total Tunggakan",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF616161)
                        )
                        Icon(
                            imageVector = Icons.Default.CreditCard,
                            contentDescription = null,
                            tint = Color(0xFF1976D2),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Rp. 0",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Kewajiban lunas",
                        fontSize = 10.5.sp,
                        color = Color(0xFF757575)
                    )
                }
            }
        }

        // Card 3: Jumlah SKS
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(10.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.MenuBook,
                            contentDescription = null,
                            tint = Color(0xFFD32F2F),
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "Jumlah SKS",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF616161)
                        )
                    }
                    Text(
                        text = "40 / 144 SKS",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { 40f / 144f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = Color(0xFFD32F2F),
                    trackColor = Color(0xFFFFCDD2)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "104 SKS lagi untuk lulus sarjana",
                    fontSize = 11.sp,
                    color = Color(0xFF757575)
                )
            }
        }
    }
}

