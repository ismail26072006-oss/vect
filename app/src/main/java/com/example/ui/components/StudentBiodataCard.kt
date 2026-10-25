package com.example.ui.components

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserProfile
import com.example.data.model.UserRole

/**
 * Kartu Biodata Mahasiswa (seperti di Screenshot 2 bagian bawah).
 */
@Composable
fun StudentBiodataCard(
    userProfile: UserProfile,
    totalTasksCount: Int,
    completedTasksCount: Int,
    onOpenEditProfile: () -> Unit,
    onLogoutToLoginScreen: () -> Unit,
    onSwitchRole: (UserRole) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
        ) {
            // Header: Icon ID & Title
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFFFEBEE),
                    modifier = Modifier.size(38.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Badge,
                            contentDescription = null,
                            tint = Color(0xFFD32F2F),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "Biodata Mahasiswa",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )
                    Text(
                        text = "Lengkapi biodata untuk pelaporan data ke PDDikti",
                        fontSize = 11.sp,
                        color = Color(0xFF757575)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = Color(0xFFF0F0F0))
            Spacer(modifier = Modifier.height(12.dp))

            // Rincian Biodata
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(text = "NAMA MAHASISWA", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF757575))
                    Text(text = userProfile.name, fontSize = 13.5.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF212121))

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(text = "NIM", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF757575))
                    Text(text = userProfile.nim, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color(0xFF424242))
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(text = "PROGRAM STUDI / KELAS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF757575))
                    Text(text = "${userProfile.className} (${userProfile.classCode})", fontSize = 12.5.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB71C1C))

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(text = "PERAN DI KELAS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF757575))
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = if (userProfile.isKetuaKelas) Color(0xFFFFEBEE) else Color(0xFFE8F5E9)
                    ) {
                        Text(
                            text = if (userProfile.isKetuaKelas) "👑 Ketua Kelas" else "🎓 Mahasiswa",
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (userProfile.isKetuaKelas) Color(0xFFB71C1C) else Color(0xFF2E7D32),
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Buttons (Ubah Data, Ganti Peran, Keluar/Masuk Kelas Lain)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onOpenEditProfile,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Edit, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Ubah Data", fontSize = 11.5.sp)
                }

                Button(
                    onClick = onLogoutToLoginScreen,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F)),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Ganti Akun", fontSize = 11.5.sp)
                }
            }
        }
    }
}
