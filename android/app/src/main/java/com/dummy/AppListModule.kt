package com.dummy

import android.app.WallpaperManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.Bitmap
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray
import org.json.JSONObject
import android.provider.Settings
import android.util.Base64
import java.io.ByteArrayOutputStream


class AppListModule(reactContext: ReactApplicationContext?) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "AppList"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val intent = Intent(Intent.ACTION_MAIN, null)
            intent.addCategory(Intent.CATEGORY_LAUNCHER)

            val launchables = pm.queryIntentActivities(intent, 0)
            val appList = JSONArray()

            for ((index, app) in launchables.withIndex()) {
                val obj = JSONObject()
                obj.put("label", app.loadLabel(pm).toString()) // App name
                obj.put("packageName", app.activityInfo.packageName) // Package name
                obj.put("index", index) // Assign index dynamically
                appList.put(obj)
            }

            promise.resolve(appList.toString())
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }

    @ReactMethod
    fun launchApp(packageName: String?) {
        try {
            val pm = reactApplicationContext.packageManager
            var launchIntent = pm.getLaunchIntentForPackage(packageName!!)

            if (launchIntent == null) {
                // Get all activities inside the package
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

            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(launchIntent)
            } else {
                throw Exception("Cannot launch app: $packageName")
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
    }