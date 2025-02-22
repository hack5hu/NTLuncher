package com.dummy

import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar


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

            for (app in launchables) {
                val obj = JSONObject()
                obj.put("label", app.loadLabel(pm).toString()) // App name
                obj.put("packageName", app.activityInfo.packageName) // Package name
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
    fun r(promise: Promise) {
        try {
            val usageStatsManager =
                reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

            val calendar = Calendar.getInstance()
            val endTime = calendar.timeInMillis // Current time

            calendar.add(Calendar.DAY_OF_YEAR, -7) // Go back 7 days
            val startTime = calendar.timeInMillis

            val usageStats = usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            )

            val totalTimeInMillis = usageStats.sumOf { it.totalTimeInForeground }
            val totalMinutes = (totalTimeInMillis / 60000).toInt()

            promise.resolve(totalMinutes.toString()) // Return time in minutes

        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get screen time: ${e.localizedMessage}")
        }
    }
}