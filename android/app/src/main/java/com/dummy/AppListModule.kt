package com.dummy

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.UserManager
import android.os.UserHandle
import android.util.Base64
import android.app.WallpaperManager
import android.app.usage.UsageStatsManager
import android.app.AppOpsManager
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray
import org.json.JSONObject
import android.provider.AlarmClock
import android.provider.CalendarContract
import android.provider.Settings
import android.net.Uri
import java.io.ByteArrayOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.lang.reflect.Method
import java.util.Calendar
import android.os.AsyncTask

class AppListModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var authPromise: Promise? = null

    init {
        reactContext?.addActivityEventListener(this)
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE_CONFIRM_CREDENTIAL) {
            val promise = authPromise
            authPromise = null
            promise?.resolve(resultCode == Activity.RESULT_OK)
        }
    }

    override fun onNewIntent(intent: Intent) {
        // No-op
    }

    companion object {
        private const val REQUEST_CODE_CONFIRM_CREDENTIAL = 9102
    }

    override fun getName(): String {
        return "AppList"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        Thread {
            try {
                val launcherApps = reactApplicationContext.getSystemService(Context.LAUNCHER_APPS_SERVICE) as android.content.pm.LauncherApps
                val userManager = reactApplicationContext.getSystemService(Context.USER_SERVICE) as UserManager
                val profiles: List<UserHandle> = userManager.userProfiles

                val appList = JSONArray()
                var indexCounter = 0

                profiles.forEach { profile ->
                    val appsForProfile = launcherApps.getActivityList(null, profile)

                    appsForProfile.forEach { appInfo ->
                        val obj = JSONObject().apply {
                            put("label", appInfo.label.toString())
                            put("packageName", appInfo.applicationInfo.packageName)
                            put("index", indexCounter++)
                            put("isWorkApp", profile != android.os.Process.myUserHandle())
                        }
                        appList.put(obj)
                    }
                }

                promise.resolve(appList.toString())
            } catch (e: Exception) {
                promise.reject("Error", e)
            }
        }.start()
    }

    @ReactMethod
    fun getAppIcon(packageName: String, promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val icon = pm.getApplicationIcon(packageName)
            val bitmap = drawableToBitmap(icon)
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            val base64Icon = Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)
            promise.resolve(base64Icon)
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    private fun drawableToBitmap(drawable: Drawable): Bitmap {
        if (drawable is BitmapDrawable) {
            return drawable.bitmap
        }
        val bitmap = Bitmap.createBitmap(
            drawable.intrinsicWidth.coerceAtLeast(1),
            drawable.intrinsicHeight.coerceAtLeast(1),
            Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return bitmap
    }

    @ReactMethod
    fun launchApp(packageName: String?) {
        try {
            val pm = reactApplicationContext.packageManager
            var launchIntent = pm.getLaunchIntentForPackage(packageName!!)

            if (launchIntent == null) {
                val intent = Intent(Intent.ACTION_MAIN, null)
                intent.addCategory(Intent.CATEGORY_LAUNCHER)
                intent.setPackage(packageName)
                val activities = pm.queryIntentActivities(intent, 0)
                if (activities.isNotEmpty()) {
                    val activityInfo = activities[0].activityInfo
                    launchIntent = Intent(Intent.ACTION_MAIN)
                    launchIntent.addCategory(Intent.CATEGORY_LAUNCHER)
                    launchIntent.setClassName(activityInfo.packageName, activityInfo.name)
                }
            }

            launchIntent?.let {
                it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(it)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun openAppSettings(packageName: String) {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun uninstallApp(packageName: String) {
        val intent = Intent(Intent.ACTION_DELETE).apply {
            data = Uri.parse("package:$packageName")
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        reactApplicationContext.startActivity(intent)
    }

    @ReactMethod
    fun expandNotifications() {
        try {
            val statusBarService = reactApplicationContext.getSystemService("statusbar")
            val statusBarManager = Class.forName("android.app.StatusBarManager")
            val expand: Method = statusBarManager.getMethod("expandNotificationsPanel")
            expand.invoke(statusBarService)
        } catch (e: Exception) {
            try {
                val statusBarService = reactApplicationContext.getSystemService("statusbar")
                val statusBarManager = Class.forName("android.app.StatusBarManager")
                val expand: Method = statusBarManager.getMethod("expand")
                expand.invoke(statusBarService)
            } catch (fallbackEx: Exception) {
                fallbackEx.printStackTrace()
            }
        }
    }

    @ReactMethod
    fun openDefaultLauncherSettings() {
        try {
            val intent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactApplicationContext.startActivity(intent)
        } catch (e: Exception) {
            try {
                val intent = Intent(Settings.ACTION_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactApplicationContext.startActivity(intent)
            } catch (fallbackEx: Exception) {
                fallbackEx.printStackTrace()
            }
        }
    }

    @ReactMethod
    fun getScreenTime(promise: Promise) {
        try {
            val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                reactApplicationContext.packageName
            )
            val hasPermission = mode == AppOpsManager.MODE_ALLOWED

            if (!hasPermission) {
                val result = JSONObject().apply {
                    put("hasPermission", false)
                    put("totalTimeInForeground", 0)
                    put("formattedTime", "")
                }
                promise.resolve(result.toString())
                return
            }

            val usageStatsManager = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val startTime = calendar.timeInMillis
            val endTime = System.currentTimeMillis()

            val stats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            var totalTimeMs: Long = 0
            if (stats != null) {
                for (usageStat in stats) {
                    if (usageStat.lastTimeUsed >= startTime) {
                        totalTimeMs += usageStat.totalTimeInForeground
                    }
                }
            }

            val hours = totalTimeMs / (1000 * 60 * 60)
            val minutes = (totalTimeMs % (1000 * 60 * 60)) / (1000 * 60)
            val formattedTime = when {
                hours > 0 -> "${hours}h ${minutes}m"
                else -> "${minutes}m"
            }

            val result = JSONObject().apply {
                put("hasPermission", true)
                put("totalTimeInForeground", totalTimeMs)
                put("formattedTime", formattedTime)
            }
            promise.resolve(result.toString())
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun openDigitalWellbeingOrUsageSettings() {
        try {
            val intent = Intent().apply {
                action = Intent.ACTION_MAIN
                component = android.content.ComponentName(
                    "com.google.android.apps.wellbeing",
                    "com.google.android.apps.wellbeing.home.TopLevelSettingsActivity"
                )
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactApplicationContext.startActivity(intent)
        } catch (e: Exception) {
            try {
                val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactApplicationContext.startActivity(intent)
            } catch (fallbackEx: Exception) {
                fallbackEx.printStackTrace()
            }
        }
    }

    @ReactMethod
    fun setWallpaper(imageUrl: String, promise: Promise) {
        Thread {
            var connection: HttpURLConnection? = null
            try {
                val url = URL(imageUrl)
                connection = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 8000
                    readTimeout = 8000
                    instanceFollowRedirects = true
                    setRequestProperty("User-Agent", "NTLuncher/1.0")
                    connect()
                }
                val bitmap = connection.inputStream.use { inputStream ->
                    BitmapFactory.decodeStream(inputStream)
                }
                if (bitmap == null) {
                    promise.reject("Error", "Failed to decode wallpaper image")
                    return@Thread
                }
                val wallpaperManager = WallpaperManager.getInstance(reactApplicationContext)
                wallpaperManager.setBitmap(bitmap)
                bitmap.recycle()
                promise.resolve(true)
            } catch (e: Exception) {
                e.printStackTrace()
                promise.reject("Error", e.message ?: "Failed to set wallpaper")
            } finally {
                connection?.disconnect()
            }
        }.start()
    }

    @ReactMethod
    fun getIconPacks(promise: Promise) {
        val pm = reactApplicationContext.packageManager
        val iconPacks = JSONArray()
        
        val intent = Intent("com.novalauncher.THEME")
        val activities = pm.queryIntentActivities(intent, 0)
        
        for (ri in activities) {
            val obj = JSONObject().apply {
                put("label", ri.loadLabel(pm).toString())
                put("packageName", ri.activityInfo.packageName)
            }
            iconPacks.put(obj)
        }
        promise.resolve(iconPacks.toString())
    }

    @ReactMethod
    fun openClock() {
        val pm = reactApplicationContext.packageManager
        val intents = listOf(
            Intent(AlarmClock.ACTION_SHOW_ALARMS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            },
            Intent(AlarmClock.ACTION_SET_ALARM).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
        )
        for (intent in intents) {
            try {
                reactApplicationContext.startActivity(intent)
                return
            } catch (_: Exception) {}
        }

        val fallbackPackages = listOf(
            "com.google.android.deskclock",
            "com.android.deskclock",
            "com.sec.android.app.clockpackage",
            "com.oneplus.deskclock",
            "com.miui.clock"
        )
        for (pkg in fallbackPackages) {
            val launchIntent = pm.getLaunchIntentForPackage(pkg)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(launchIntent)
                return
            }
        }
    }

    @ReactMethod
    fun openCalendar() {
        val pm = reactApplicationContext.packageManager
        val intents = listOf(
            Intent.makeMainSelectorActivity(Intent.ACTION_MAIN, Intent.CATEGORY_APP_CALENDAR).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            },
            Intent(Intent.ACTION_VIEW).apply {
                data = CalendarContract.CONTENT_URI.buildUpon().appendPath("time").build()
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
        )
        for (intent in intents) {
            try {
                reactApplicationContext.startActivity(intent)
                return
            } catch (_: Exception) {}
        }

        val fallbackPackages = listOf(
            "com.google.android.calendar",
            "com.android.calendar",
            "com.samsung.android.calendar"
        )
        for (pkg in fallbackPackages) {
            val launchIntent = pm.getLaunchIntentForPackage(pkg)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(launchIntent)
                return
            }
        }
    }

    @ReactMethod
    fun lockScreen(promise: Promise) {
        val service = LockScreenAccessibilityService.instance
        if (service != null && service.lockNow()) {
            promise.resolve(true)
            return
        }
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactApplicationContext.startActivity(intent)
        } catch (_: Exception) {}
        promise.resolve(false)
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactApplicationContext.startActivity(intent)
        } catch (_: Exception) {}
    }

    @ReactMethod
    fun setPortraitLock(locked: Boolean) {
        val activity = reactApplicationContext.currentActivity ?: return
        activity.runOnUiThread {
            activity.requestedOrientation = if (locked) {
                ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            } else {
                ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
            }
        }
    }

    @ReactMethod
    fun authenticateUser(title: String, subtitle: String, promise: Promise) {
        val keyguardManager = reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager
        if (keyguardManager == null || !keyguardManager.isKeyguardSecure) {
            promise.resolve(true)
            return
        }
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.resolve(false)
            return
        }
        @Suppress("DEPRECATION")
        val intent = keyguardManager.createConfirmDeviceCredentialIntent(title, subtitle)
        if (intent == null) {
            promise.resolve(true)
            return
        }
        authPromise?.resolve(false)
        authPromise = promise
        try {
            activity.startActivityForResult(intent, REQUEST_CODE_CONFIRM_CREDENTIAL)
        } catch (e: Exception) {
            authPromise = null
            promise.resolve(false)
        }
    }
}
