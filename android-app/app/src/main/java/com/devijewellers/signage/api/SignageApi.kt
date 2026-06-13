package com.devijewellers.signage.api

import com.devijewellers.signage.models.ApiResponse
import com.devijewellers.signage.models.DisplaySetting
import com.devijewellers.signage.models.SyncRequest
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface SignageApi {
    
    @GET("/api/state/displaySetting")
    suspend fun getDisplaySettings(): Response<ApiResponse<DisplaySetting>>

    @POST("/api/state/displaySetting")
    suspend fun updateDisplaySettings(@Body request: SyncRequest<DisplaySetting>): Response<Void>

    companion object {
        // REPLACE WITH ACTUAL CLOUD RUN BACKEND URL OR LOCAL IP
        private const val BASE_URL = "https://your-api-endpoint.com"

        fun create(): SignageApi {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(SignageApi::class.java)
        }
    }
}
