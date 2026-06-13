package com.devijewellers.signage.ui.screens

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.net.http.SslError
import android.os.Build
import android.util.Base64
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.SslErrorHandler
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.FileProvider
import android.content.Context
import java.io.File
import java.io.FileOutputStream

class WebAppInterface(private val context: Context) {
    @JavascriptInterface
    fun shareImage(base64Data: String, title: String, text: String, pkg: String?) {
        try {
            val cleanBase64 = base64Data.substringAfter("base64,")
            val imageBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
            
            val imagesDir = File(context.cacheDir, "images")
            imagesDir.mkdirs()
            val imageFile = File(imagesDir, "rate_card.png")
            val fos = FileOutputStream(imageFile)
            fos.write(imageBytes)
            fos.flush()
            fos.close()
            
            val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", imageFile)
            
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "image/png"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_TITLE, title)
                putExtra(Intent.EXTRA_TEXT, text)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                
                // Set specific package if available (e.g., com.whatsapp)
                if (!pkg.isNullOrEmpty()) {
                    setPackage(pkg)
                }
            }
            // Always use chooser in case package is not installed or explicit package not provided
            val chooser = Intent.createChooser(shareIntent, "Share Image")
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(chooser)
        } catch (e: Exception) {
            e.printStackTrace()
            // Fallback for intent if specific package is invalid
            try {
                val fallbackIntent = Intent(Intent.ACTION_SEND).apply {
                    type = "image/png"
                    putExtra(Intent.EXTRA_TEXT, text)
                    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(Intent.createChooser(fallbackIntent, "Share Info"))
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebControlScreen(url: String = "https://ais-pre-6cajhzszuqvnfvet72e2bx-711791395644.asia-southeast1.run.app") {
    var webViewRef by remember { mutableStateOf<WebView?>(null) }
    var subPageCanGoBack by remember { mutableStateOf(false) }

    var fileChooserCallback by remember { mutableStateOf<ValueCallback<Array<Uri>>?>(null) }

    val fileChooserLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val data = result.data
        if (result.resultCode == Activity.RESULT_OK && data != null) {
            val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, data)
            fileChooserCallback?.onReceiveValue(uris)
        } else {
            fileChooserCallback?.onReceiveValue(null)
        }
        fileChooserCallback = null
    }

    BackHandler(enabled = subPageCanGoBack) {
        webViewRef?.goBack()
    }

    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                webViewRef = this
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.databaseEnabled = true
                settings.cacheMode = WebSettings.LOAD_DEFAULT // standard caching helps SPAs
                settings.loadsImagesAutomatically = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.mediaPlaybackRequiresUserGesture = false
                settings.javaScriptCanOpenWindowsAutomatically = true
                
                addJavascriptInterface(WebAppInterface(context), "AndroidNative")

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                }
                
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        // Return false to let the WebView handle the URL navigation natively
                        return false
                    }

                    @Deprecated("Deprecated in Java")
                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        return false
                    }

                    override fun onReceivedSslError(
                        view: WebView?,
                        handler: SslErrorHandler?,
                        error: SslError?
                    ) {
                        handler?.proceed() // Ignore SSL certificate errors just in case
                    }

                    override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                        subPageCanGoBack = view?.canGoBack() ?: false
                        super.doUpdateVisitedHistory(view, url, isReload)
                    }
                }
                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                        // Optional: Log console messages for debugging
                        return super.onConsoleMessage(consoleMessage)
                    }

                    override fun onShowFileChooser(
                        webView: WebView?,
                        filePathCallback: ValueCallback<Array<Uri>>?,
                        fileChooserParams: FileChooserParams?
                    ): Boolean {
                        fileChooserCallback?.onReceiveValue(null) // cancel any previous
                        fileChooserCallback = filePathCallback
                        
                        try {
                            val intent = fileChooserParams?.createIntent()
                            if (intent != null) {
                                fileChooserLauncher.launch(intent)
                                return true
                            }
                        } catch (e: Exception) {
                            fileChooserCallback?.onReceiveValue(null)
                            fileChooserCallback = null
                        }
                        return false
                    }
                }
                
                loadUrl(url)
            }
        },
        update = { webView ->
            // Update logic not required for static URL.
        }
    )
}
