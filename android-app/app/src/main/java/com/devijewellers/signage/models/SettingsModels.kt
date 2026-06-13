package com.devijewellers.signage.models

import com.google.gson.annotations.SerializedName

data class DisplaySetting(
    @SerializedName("mode") val mode: String = "standard",
    @SerializedName("refreshInterval") var refreshInterval: Int = 15,
    @SerializedName("ratesDisplayDuration") var ratesDisplayDuration: Int = 12,
    @SerializedName("slideshowDisplayDuration") var slideshowDisplayDuration: Int = 8,
    @SerializedName("rateFontSize") var rateFontSize: Int = 55,
    @SerializedName("labelFontSize") var labelFontSize: Int = 25,
    @SerializedName("rotateBackgroundEnabled") var rotateBackgroundEnabled: Boolean = false,
    @SerializedName("mediaLoopEnabled") var mediaLoopEnabled: Boolean = true,
    @SerializedName("customPrimaryBg") var customPrimaryBg: String = "#8B8BBD",
    @SerializedName("customSecondaryBg") var customSecondaryBg: String = "#15161A",
    @SerializedName("customCardBg") var customCardBg: String = "#161619",
    @SerializedName("customGoldColor") var customGoldColor: String = "#D4AF37",
    @SerializedName("visibleRates") var visibleRates: List<String> = listOf("gold24k", "gold22k", "gold18k", "silver")
)

data class ApiResponse<T>(
    @SerializedName("status") val status: String,
    @SerializedName("data") val data: T? = null,
    @SerializedName("payload") val payload: T? = null
)

data class SyncRequest<T>(
    @SerializedName("payload") val payload: T
)
