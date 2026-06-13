package com.devijewellers.signage

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import com.devijewellers.signage.ui.screens.ControlPanelScreen
import com.devijewellers.signage.ui.screens.WebControlScreen

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object NativeParams : Screen("native", "Native Tweaks", Icons.Filled.Build)
    object WebControl : Screen("web", "Full Extranet", Icons.Filled.Home)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFFD4AF37),
                    background = Color.Black
                )
            ) {
                MainAppScreen()
            }
        }
    }
}

@Composable
fun MainAppScreen() {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.WebControl) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF15161A),
                contentColor = Color.White
            ) {
                val items = listOf(Screen.WebControl, Screen.NativeParams)
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = currentScreen == screen,
                        onClick = { currentScreen = screen },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.Black,
                            selectedTextColor = Color(0xFFD4AF37),
                            indicatorColor = Color(0xFFD4AF37),
                            unselectedIconColor = Color.Gray,
                            unselectedTextColor = Color.Gray
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding).fillMaxSize()) {
            when (currentScreen) {
                is Screen.NativeParams -> ControlPanelScreen()
                is Screen.WebControl -> WebControlScreen()
            }
        }
    }
}

