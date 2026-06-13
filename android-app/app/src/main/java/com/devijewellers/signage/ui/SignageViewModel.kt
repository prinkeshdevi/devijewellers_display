package com.devijewellers.signage.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.devijewellers.signage.api.SignageApi
import com.devijewellers.signage.models.DisplaySetting
import com.devijewellers.signage.models.SyncRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SignageViewModel : ViewModel() {
    private val api = SignageApi.create()

    private val _displaySetting = MutableStateFlow(DisplaySetting())
    val displaySetting: StateFlow<DisplaySetting> = _displaySetting

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _isSaving = MutableStateFlow(false)
    val isSaving: StateFlow<Boolean> = _isSaving

    init {
        loadSettings()
    }

    private fun loadSettings() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val response = api.getDisplaySettings()
                if (response.isSuccessful) {
                    val data = response.body()?.payload ?: response.body()?.data
                    data?.let { _displaySetting.value = it }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun updateSetting(updatedSetting: DisplaySetting) {
        _displaySetting.value = updatedSetting
        viewModelScope.launch {
            _isSaving.value = true
            try {
                api.updateDisplaySettings(SyncRequest(updatedSetting))
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                _isSaving.value = false
            }
        }
    }
}
