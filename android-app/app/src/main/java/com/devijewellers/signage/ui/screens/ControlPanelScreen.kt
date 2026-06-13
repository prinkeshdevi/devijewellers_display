package com.devijewellers.signage.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.devijewellers.signage.models.DisplaySetting
import com.devijewellers.signage.ui.SignageViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

val GoldCustom = Color(0xFFD4AF37)
val BgPrimary = Color(0xFF0B0B0D)
val BgCard = Color(0xFF15161A)
val TextGray = Color(0xFFA1A1AA)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ControlPanelScreen(viewModel: SignageViewModel = viewModel()) {
    val settings by viewModel.displaySetting.collectAsState()
    val isSaving by viewModel.isSaving.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("OPERATIONAL COMMAND CENTER", color = GoldCustom, fontSize = 14.sp, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.Black)
            )
        },
        containerColor = Color.Black
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            TimingConfigurationSection(settings, viewModel)
            SlideshowStatusSection(settings, viewModel)
            ColorCustomizationSection(settings, viewModel)
            
            Button(
                onClick = { /* Force Trigger API but ViewModel already auto-syncs */ },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = GoldCustom),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(if (isSaving) "SAVING..." else "SAVE ALL SETTINGS", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun TimingConfigurationSection(settings: DisplaySetting, viewModel: SignageViewModel) {
    Column {
        Text("TIMING CONFIGURATION", color = GoldCustom, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TimingCard(
                title = "REFRESH INTERVAL",
                value = settings.refreshInterval,
                unit = "s",
                min = 5f,
                max = 60f,
                modifier = Modifier.weight(1f),
                onValueChange = { viewModel.updateSetting(settings.copy(refreshInterval = it.toInt())) }
            )
            TimingCard(
                title = "RATES DISPLAY DURATION",
                value = settings.ratesDisplayDuration,
                unit = "s",
                min = 5f,
                max = 60f,
                modifier = Modifier.weight(1f),
                onValueChange = { viewModel.updateSetting(settings.copy(ratesDisplayDuration = it.toInt())) }
            )
            TimingCard(
                title = "SLIDESHOW DURATION",
                value = settings.slideshowDisplayDuration,
                unit = "s",
                min = 3f,
                max = 30f,
                modifier = Modifier.weight(1f),
                onValueChange = { viewModel.updateSetting(settings.copy(slideshowDisplayDuration = it.toInt())) }
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TimingCard(
                title = "RATE VALUE FONT SIZE",
                value = settings.rateFontSize,
                unit = "PX",
                min = 20f,
                max = 120f,
                modifier = Modifier.weight(1f),
                onValueChange = { viewModel.updateSetting(settings.copy(rateFontSize = it.toInt())) }
            )
            TimingCard(
                title = "RATE LABEL FONT SIZE",
                value = settings.labelFontSize,
                unit = "PX",
                min = 12f,
                max = 60f,
                modifier = Modifier.weight(1f),
                onValueChange = { viewModel.updateSetting(settings.copy(labelFontSize = it.toInt())) }
            )
        }
    }
}

@Composable
fun TimingCard(title: String, value: Int, unit: String, min: Float, max: Float, modifier: Modifier = Modifier, onValueChange: (Float) -> Unit) {
    Column(
        modifier = modifier
            .background(BgCard, RoundedCornerShape(8.dp))
            .border(1.dp, Color.DarkGray, RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        Text(title, color = TextGray, fontSize = 9.sp, fontWeight = FontWeight.SemiBold)
        Spacer(modifier = Modifier.height(4.dp))
        Text("$value $unit", color = GoldCustom, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        Slider(
            value = value.toFloat(),
            onValueChange = onValueChange,
            valueRange = min..max,
            colors = SliderDefaults.colors(
                thumbColor = GoldCustom,
                activeTrackColor = GoldCustom,
                inactiveTrackColor = Color.DarkGray
            )
        )
    }
}

@Composable
fun SlideshowStatusSection(settings: DisplaySetting, viewModel: SignageViewModel) {
    Column {
        Text("SLIDESHOW STATUS", color = GoldCustom, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ToggleCard(
                title = "BACKGROUND ROTATION",
                subtitle = "Display media images as rotating backgrounds every 10s on the Rates screen.",
                isActive = settings.rotateBackgroundEnabled,
                modifier = Modifier.weight(1f)
            ) {
                viewModel.updateSetting(settings.copy(rotateBackgroundEnabled = it))
            }
            ToggleCard(
                title = "GLOBAL SIGNAGE LOOP",
                subtitle = "Automatically loop through enabled digital catalogs.",
                isActive = settings.mediaLoopEnabled,
                modifier = Modifier.weight(1f)
            ) {
                viewModel.updateSetting(settings.copy(mediaLoopEnabled = it))
            }
        }
    }
}

@Composable
fun ToggleCard(title: String, subtitle: String, isActive: Boolean, modifier: Modifier = Modifier, onToggle: (Boolean) -> Unit) {
    val borderColor = if (isActive) GoldCustom.copy(alpha = 0.5f) else Color.DarkGray
    val bgColor = if (isActive) GoldCustom.copy(alpha = 0.1f) else BgCard
    
    Row(
        modifier = modifier
            .clickable { onToggle(!isActive) }
            .background(bgColor, RoundedCornerShape(8.dp))
            .border(1.dp, borderColor, RoundedCornerShape(8.dp))
            .padding(12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(2.dp))
            Text(subtitle, color = TextGray, fontSize = 9.sp, lineHeight = 12.sp)
        }
        Switch(
            checked = isActive,
            onCheckedChange = onToggle,
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = GoldCustom,
                uncheckedThumbColor = Color.Gray,
                uncheckedTrackColor = Color.Companion.DarkGray
            )
        )
    }
}

@Composable
fun ColorCustomizationSection(settings: DisplaySetting, viewModel: SignageViewModel) {
    Column {
        Text("COLOR CUSTOMIZATION PALETTE", color = GoldCustom, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ColorBox("CANVAS BASE", settings.customPrimaryBg, Modifier.weight(1f))
            ColorBox("SECONDARY BASE", settings.customSecondaryBg, Modifier.weight(1f))
            ColorBox("CARDS CONTAINER", settings.customCardBg, Modifier.weight(1f))
            ColorBox("LUXURY ACCENT", settings.customGoldColor, Modifier.weight(1f))
        }
    }
}

@Composable
fun ColorBox(title: String, hexColor: String, modifier: Modifier = Modifier) {
    // Basic representation, in a real app would open a Color Picker dialog.
    val parsedColor = try { Color(android.graphics.Color.parseColor(hexColor)) } catch (e: Exception) { Color.Gray }
    Column(modifier = modifier) {
        Text(title, color = TextGray, fontSize = 8.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(4.dp))
        Box(modifier = Modifier
            .fillMaxWidth()
            .height(32.dp)
            .background(parsedColor, RoundedCornerShape(4.dp))
            .border(1.dp, Color.DarkGray, RoundedCornerShape(4.dp))
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(hexColor.uppercase(), color = Color.White, fontSize = 10.sp)
    }
}
