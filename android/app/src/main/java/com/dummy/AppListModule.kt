package com.dummy

import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.UserManager
import android.os.UserHandle
import android.util.Base64
import android.app.WallpaperManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray
import org.json.JSONObject
import android.provider.Settings
import android.net.Uri
import java.io.ByteArrayOutputStream
import java.net.URL
import android.os.AsyncTask

class AppListModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppList"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val launcherApps = reactApplicationContext.getSystemService(Context.LAUNCHER_APPS_SERVICE) as android.content.pm.LauncherApps
            val userManager = reactApplicationContext.getSystemService(Context.USER_SERVICE) as UserManager
            val profiles: List<UserHandle> = userManager.userProfiles // personal + work

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
    fun setWallpaper(imageUrl: String, promise: Promise) {
        object : AsyncTask<Void, Void, Boolean>() {
            override fun doInBackground(vararg params: Void?): Boolean {
                return try {
                    val url = URL(imageUrl)
                    val inputStream = url.openStream()
                    val wallpaperManager = WallpaperManager.getInstance(reactApplicationContext)
                    wallpaperManager.setStream(inputStream)
                    true
                } catch (e: Exception) {
                    e.printStackTrace()
                    false
                }
            }

            override fun onPostExecute(result: Boolean) {
                if (result) promise.resolve(true)
                else promise.reject("Error", "Failed to set wallpaper")
            }
        }.execute()
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
}