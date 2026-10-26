package com.example.ui.screens

import android.widget.Toast
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.painterResource
import com.example.R
import com.example.data.model.UserRole
import com.example.ui.viewmodel.TaskViewModel

@Composable
fun LoginClassScreen(
    viewModel: TaskViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    var nameInput by remember { mutableStateOf("ISMAIL K. ZAKARIA") }
    var nimInput by remember { mutableStateOf("220101005") }
    var classInput by remember { mutableStateOf("TI-2026A") }
    var roleInput by remember { mutableStateOf(UserRole.MAHASISWA) }
    var leaderPinInput by remember { mutableStateOf("1234") }
    var showPin by remember { mutableStateOf(false) }
    var isVerifying by remember { mutableStateOf(false) }

    val infiniteTransition = rememberInfiniteTransition(label = "verify_rotation")
    val rotationAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFA))
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(36.dp))

        // 2. Logo VECTOREAL EDUCATION (Emblem Sigma & Teks Merah Putih)
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            // Emblem Logo Sigma
            Surface(
                shape = CircleShape,
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(2.5.dp, Color(0xFFD32F2F)),
                shadowElevation = 6.dp,
                modifier = Modifier.size(88.dp)
            ) {
                Image(
                    painter = painterResource(id = R.drawable.logo_sigma),
                    contentDescription = "Logo Sigma Vectoreal Education",
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(CircleShape)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = "VECTOREAL EDUCATION",
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.2.sp,
                color = Color(0xFFD32F2F)
            )

            Text(
                text = "SISTEM INFORMASI AKADEMIK",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.2.sp,
                color = Color(0xFF555555)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 3. Header Text: Masuk Sebagai Mahasiswa
        Text(
            text = "Masuk Sebagai Mahasiswa",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF212121)
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = "Selamat Datang di Portal Vectoreal Education",
            fontSize = 12.5.sp,
            color = Color(0xFF757575)
        )

        Spacer(modifier = Modifier.height(20.dp))

        // 4. Form Masuk Kelas (Card Web Putih Bersih)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFEEEEEE))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Field 1: Nama Mahasiswa
                Column {
                    Text(
                        text = "Nama Mahasiswa",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF333333)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = nameInput,
                        onValueChange = { nameInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("login_name_input"),
                        placeholder = { Text("Masukkan Nama Lengkap", fontSize = 13.sp) },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFD32F2F),
                            unfocusedBorderColor = Color(0xFFE0E0E0),
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color(0xFFFAFAFA)
                        ),
                        shape = RoundedCornerShape(8.dp)
                    )
                }

                // Field 2: NIM
                Column {
                    Text(
                        text = "NIM",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF333333)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = nimInput,
                        onValueChange = { nimInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("login_nim_input"),
                        placeholder = { Text("Masukkan NIM Atau Email", fontSize = 13.sp) },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFD32F2F),
                            unfocusedBorderColor = Color(0xFFE0E0E0),
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color(0xFFFAFAFA)
                        ),
                        shape = RoundedCornerShape(8.dp)
                    )
                }

                // Field 3: Kelas
                Column {
                    Text(
                        text = "Kelas / Kode Kelas",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF333333)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = classInput,
                        onValueChange = { classInput = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("login_class_input"),
                        placeholder = { Text("Masukkan Kelas (contoh: TI-2026A)", fontSize = 13.sp) },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFFD32F2F),
                            unfocusedBorderColor = Color(0xFFE0E0E0),
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color(0xFFFAFAFA)
                        ),
                        shape = RoundedCornerShape(8.dp)
                    )
                }

                // Role Selector: Mahasiswa vs Ketua Kelas
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (roleInput == UserRole.MAHASISWA) Color(0xFFFFEBEE) else Color(0xFFF5F5F5),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (roleInput == UserRole.MAHASISWA) Color(0xFFD32F2F) else Color(0xFFE0E0E0)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { roleInput = UserRole.MAHASISWA }
                    ) {
                        Row(
                            modifier = Modifier.padding(vertical = 8.dp, horizontal = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = null,
                                tint = if (roleInput == UserRole.MAHASISWA) Color(0xFFD32F2F) else Color.Gray,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "🎓 Mahasiswa",
                                fontSize = 12.sp,
                                fontWeight = if (roleInput == UserRole.MAHASISWA) FontWeight.Bold else FontWeight.Normal,
                                color = if (roleInput == UserRole.MAHASISWA) Color(0xFFB71C1C) else Color(0xFF666666)
                            )
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (roleInput == UserRole.KETUA_KELAS) Color(0xFFFFEBEE) else Color(0xFFF5F5F5),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (roleInput == UserRole.KETUA_KELAS) Color(0xFFD32F2F) else Color(0xFFE0E0E0)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .clickable { roleInput = UserRole.KETUA_KELAS }
                    ) {
                        Row(
                            modifier = Modifier.padding(vertical = 8.dp, horizontal = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Security,
                                contentDescription = null,
                                tint = if (roleInput == UserRole.KETUA_KELAS) Color(0xFFD32F2F) else Color.Gray,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "👑 Ketua Kelas",
                                fontSize = 12.sp,
                                fontWeight = if (roleInput == UserRole.KETUA_KELAS) FontWeight.Bold else FontWeight.Normal,
                                color = if (roleInput == UserRole.KETUA_KELAS) Color(0xFFB71C1C) else Color(0xFF666666)
                            )
                        }
                    }
                }

                // If Ketua Kelas, show PIN input
                if (roleInput == UserRole.KETUA_KELAS) {
                    Column {
                        Text(
                            text = "PIN Keamanan Ketua Kelas",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFFB71C1C)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        OutlinedTextField(
                            value = leaderPinInput,
                            onValueChange = { leaderPinInput = it },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true,
                            visualTransformation = if (showPin) VisualTransformation.None else PasswordVisualTransformation(),
                            trailingIcon = {
                                IconButton(onClick = { showPin = !showPin }) {
                                    Icon(
                                        imageVector = if (showPin) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                        contentDescription = null
                                    )
                                }
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFFD32F2F),
                                unfocusedBorderColor = Color(0xFFE0E0E0)
                            ),
                            shape = RoundedCornerShape(8.dp)
                        )
                    }
                }

                // Cloudflare Verification Box (seperti Screenshot 1)
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFAFAFA),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE0E0E0)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 14.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Circular spinner
                            Box(
                                modifier = Modifier
                                    .size(18.dp)
                                    .rotate(rotationAngle),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    strokeWidth = 2.dp,
                                    color = Color(0xFF2E7D32),
                                    modifier = Modifier.fillMaxSize()
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Melakukan verifikasi...",
                                fontSize = 12.sp,
                                color = Color(0xFF333333),
                                fontWeight = FontWeight.Medium
                            )
                        }

                        // Cloudflare badge
                        Column(horizontalAlignment = Alignment.End) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "☁️",
                                    fontSize = 12.sp
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "CLOUDFLARE",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFF38020)
                                )
                            }
                            Text(
                                text = "Privasi • Bantuan",
                                fontSize = 8.5.sp,
                                color = Color(0xFF888888)
                            )
                        }
                    }
                }

                // Tombol Merah MASUK (seperti Screenshot 1)
                Button(
                    onClick = {
                        val cleanName = nameInput.trim().ifBlank { "ISMAIL K. ZAKARIA" }
                        val cleanNim = nimInput.trim().ifBlank { "220101005" }
                        val cleanClass = classInput.trim().ifBlank { "TI-2026A" }
                        val fullClassName = if (cleanClass.startsWith("TI", ignoreCase = true)) {
                            "Teknik Informatika $cleanClass"
                        } else {
                            "Kelas $cleanClass"
                        }

                        viewModel.loginWithDetails(
                            name = cleanName,
                            nim = cleanNim,
                            className = fullClassName,
                            classCode = cleanClass,
                            role = roleInput
                        )

                        Toast.makeText(
                            context,
                            "Selamat Datang, $cleanName! Berhasil masuk ke portal $cleanClass",
                            Toast.LENGTH_SHORT
                        ).show()
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFD32F2F),
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(46.dp)
                        .testTag("login_submit_button")
                ) {
                    Text(
                        text = "Masuk",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // 5. Bagian Dari Footer (Kemendikbudristek & Universitas - seperti Screenshot 1)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(bottom = 32.dp)
        ) {
            Text(
                text = "Bagian dari",
                fontSize = 11.sp,
                color = Color(0xFF9E9E9E)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Emblem 1: Kemendikbud
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFE3F2FD),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF90CAF9)),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "🇮🇩", fontSize = 18.sp)
                    }
                }

                // Emblem 2: Universitas Negeri Gorontalo
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFFFEBEE),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFCDD2)),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text(text = "🏛️", fontSize = 18.sp)
                    }
                }

                // Emblem 3: Sigma Vect Education
                Surface(
                    shape = CircleShape,
                    color = Color.White,
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFD32F2F)),
                    modifier = Modifier.size(36.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.logo_sigma),
                        contentDescription = "Logo Sigma",
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Vect Education • Academic Portal & PDDikti",
                fontSize = 10.sp,
                color = Color(0xFF757575)
            )
        }
    }
}
