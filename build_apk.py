import os
import sys
import shutil
import subprocess
import zipfile

def run(cmd, cwd=None):
    print("RUN:", " ".join(cmd) if isinstance(cmd, list) else cmd)
    res = subprocess.run(cmd, cwd=cwd, shell=isinstance(cmd, str), capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)
    if res.returncode != 0:
        raise RuntimeError(f"Command failed with exit code {res.returncode}")
    return res

BASE_DIR = r"C:\Users\ujwal\.gemini\antigravity\scratch\FocusShieldAI"
BUILD_DIR = os.path.join(BASE_DIR, "build_apk")
WEB_DIST = os.path.join(BASE_DIR, "web", "dist")

SDK_DIR = r"D:\Android\Sdk"
STUDIO_DIR = r"D:\Android Studio"
JBR_DIR = os.path.join(STUDIO_DIR, "jbr")
JAVA_EXE = os.path.join(JBR_DIR, "bin", "java.exe")
JAVAC_EXE = os.path.join(JBR_DIR, "bin", "javac.exe")
KEYTOOL_EXE = os.path.join(JBR_DIR, "bin", "keytool.exe")
JARSIGNER_EXE = os.path.join(JBR_DIR, "bin", "jarsigner.exe")

BUILD_TOOLS = os.path.join(SDK_DIR, "build-tools", "36.0.0")
AAPT2_EXE = os.path.join(BUILD_TOOLS, "aapt2.exe")
D8_JAR = os.path.join(BUILD_TOOLS, "lib", "d8.jar")
ZIPALIGN_EXE = os.path.join(BUILD_TOOLS, "zipalign.exe")
APKSIGNER_JAR = os.path.join(BUILD_TOOLS, "lib", "apksigner.jar")
ANDROID_JAR = os.path.join(SDK_DIR, "platforms", "android-37.0", "android.jar")

if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
os.makedirs(BUILD_DIR, exist_ok=True)

# 1. Prepare Directory Structure
SRC_DIR = os.path.join(BUILD_DIR, "src")
COM_DIR = os.path.join(SRC_DIR, "com", "focusshield", "ai")
SERVICE_DIR = os.path.join(COM_DIR, "service")
BIN_DIR = os.path.join(BUILD_DIR, "bin")
RES_DIR = os.path.join(BUILD_DIR, "res")
RES_DRAWABLE = os.path.join(RES_DIR, "drawable")
RES_VALUES = os.path.join(RES_DIR, "values")
ASSETS_DIR = os.path.join(BUILD_DIR, "assets")

os.makedirs(COM_DIR, exist_ok=True)
os.makedirs(SERVICE_DIR, exist_ok=True)
os.makedirs(BIN_DIR, exist_ok=True)
os.makedirs(RES_DRAWABLE, exist_ok=True)
os.makedirs(RES_VALUES, exist_ok=True)

# 2. Write Java source files
MAIN_ACTIVITY = """package com.focusshield.ai;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.focusshield.ai.service.FocusShieldNotificationListenerService;
import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {
    private WebView mWebView;

    public class QuietPulseBridge {
        private final Context mContext;

        public QuietPulseBridge(Context context) {
            this.mContext = context;
        }

        @JavascriptInterface
        public boolean isAndroidApp() {
            return true;
        }

        @JavascriptInterface
        public boolean isNotificationAccessGranted() {
            String pkgName = mContext.getPackageName();
            String flat = Settings.Secure.getString(mContext.getContentResolver(), "enabled_notification_listeners");
            if (!TextUtils.isEmpty(flat)) {
                String[] names = flat.split(":");
                for (String name : names) {
                    ComponentName cn = ComponentName.unflattenFromString(name);
                    if (cn != null && pkgName.equals(cn.getPackageName())) {
                        return true;
                    }
                }
            }
            return false;
        }

        @JavascriptInterface
        public void openNotificationSettings() {
            try {
                Intent intent = new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS");
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(intent);
            } catch (Exception e) {
                try {
                    Intent intent = new Intent(Settings.ACTION_SETTINGS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    mContext.startActivity(intent);
                } catch (Exception ignored) {}
            }
        }

        @JavascriptInterface
        public String getCapturedNotifications() {
            return FocusShieldNotificationListenerService.getRecentNotificationsJson(mContext);
        }

        @JavascriptInterface
        public void clearCapturedNotifications() {
            FocusShieldNotificationListenerService.clearNotifications(mContext);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().setStatusBarColor(Color.BLACK);
        getWindow().setNavigationBarColor(Color.BLACK);

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(Color.BLACK);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setDisplayZoomControls(false);

        // Bind Native Android Bridge to JavaScript
        mWebView.addJavascriptInterface(new QuietPulseBridge(this), "QuietPulseAndroid");

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            private WebResourceResponse serveAsset(String path) {
                if (path == null) return null;

                String assetPath = path;
                while (assetPath.startsWith("/")) {
                    assetPath = assetPath.substring(1);
                }
                if (assetPath.startsWith("android_asset/")) {
                    assetPath = assetPath.substring("android_asset/".length());
                }

                String mimeType = null;
                if (assetPath.endsWith(".png")) mimeType = "image/png";
                else if (assetPath.endsWith(".jpg") || assetPath.endsWith(".jpeg")) mimeType = "image/jpeg";
                else if (assetPath.endsWith(".svg")) mimeType = "image/svg+xml";
                else if (assetPath.endsWith(".css")) mimeType = "text/css";
                else if (assetPath.endsWith(".js")) mimeType = "application/javascript";
                else if (assetPath.endsWith(".json")) mimeType = "application/json";
                else if (assetPath.endsWith(".html")) mimeType = "text/html";
                else if (assetPath.endsWith(".apk")) mimeType = "application/vnd.android.package-archive";

                try {
                    InputStream is = getAssets().open(assetPath);
                    return new WebResourceResponse(mimeType, "UTF-8", is);
                } catch (IOException e) {
                    if (assetPath.contains("/")) {
                        String filename = assetPath.substring(assetPath.lastIndexOf("/") + 1);
                        try {
                            InputStream is2 = getAssets().open(filename);
                            return new WebResourceResponse(mimeType, "UTF-8", is2);
                        } catch (IOException ignored) {}
                    }
                }
                return null;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    WebResourceResponse resp = serveAsset(request.getUrl().getPath());
                    if (resp != null) return resp;
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                if (url != null) {
                    try {
                        Uri u = Uri.parse(url);
                        WebResourceResponse resp = serveAsset(u.getPath());
                        if (resp != null) return resp;
                    } catch (Exception ignored) {}
                }
                return super.shouldInterceptRequest(view, url);
            }
        });
        mWebView.setWebChromeClient(new WebChromeClient());

        mWebView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mWebView != null) {
            mWebView.post(new Runnable() {
                @Override
                public void run() {
                    mWebView.evaluateJavascript(
                        "if (window.onAndroidResume) { window.onAndroidResume(); }",
                        null
                    );
                }
            });
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"""

with open(os.path.join(COM_DIR, "MainActivity.java"), "w", encoding="utf-8") as f:
    f.write(MAIN_ACTIVITY)

SERVICE_CODE = """package com.focusshield.ai.service;

import android.app.Notification;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class FocusShieldNotificationListenerService extends NotificationListenerService {
    private static final String TAG = "QuietPulseService";
    private static final String PREFS_NAME = "quietpulse_notifications";
    private static final String KEY_EVENTS = "cached_events";
    private static final int MAX_EVENTS = 50;

    private static final List<String> memoryEvents = Collections.synchronizedList(new ArrayList<String>());
    private static FocusShieldNotificationListenerService instance;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        Log.d(TAG, "QuietPulse NotificationListenerService created");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        instance = null;
    }

    public static FocusShieldNotificationListenerService getInstance() {
        return instance;
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        try {
            String pkg = sbn.getPackageName();
            if (pkg != null && pkg.equals(getPackageName())) return;

            Notification n = sbn.getNotification();
            if (n == null) return;

            Bundle extras = n.extras;
            String title = "";
            String text = "";
            if (extras != null) {
                CharSequence titleSeq = extras.getCharSequence(Notification.EXTRA_TITLE);
                if (titleSeq != null) title = titleSeq.toString();

                CharSequence textSeq = extras.getCharSequence(Notification.EXTRA_TEXT);
                if (textSeq != null) text = textSeq.toString();
                if (text.isEmpty()) {
                    CharSequence bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT);
                    if (bigText != null) text = bigText.toString();
                }
            }

            String appName = pkg;
            try {
                PackageManager pm = getPackageManager();
                ApplicationInfo ai = pm.getApplicationInfo(pkg, 0);
                CharSequence label = pm.getApplicationLabel(ai);
                if (label != null) appName = label.toString();
            } catch (Exception ignored) {}

            String category = n.category != null ? n.category : "other";
            long postTime = sbn.getPostTime() > 0 ? sbn.getPostTime() : System.currentTimeMillis();
            String id = pkg + "_" + postTime + "_" + sbn.getId();

            String jsonItem = "{"
                    + "\\"id\\":\\"" + escapeJson(id) + "\\","
                    + "\\"packageName\\":\\"" + escapeJson(pkg) + "\\","
                    + "\\"appName\\":\\"" + escapeJson(appName) + "\\","
                    + "\\"title\\":\\"" + escapeJson(title) + "\\","
                    + "\\"text\\":\\"" + escapeJson(text) + "\\","
                    + "\\"category\\":\\"" + escapeJson(category) + "\\","
                    + "\\"timestamp\\":" + postTime + ","
                    + "\\"sourceType\\":\\"REAL\\""
                    + "}";

            memoryEvents.add(jsonItem);
            while (memoryEvents.size() > MAX_EVENTS) {
                memoryEvents.remove(0);
            }

            persistEvents();
            Log.d(TAG, "Notification captured from: " + appName + " (" + pkg + ")");
        } catch (Exception e) {
            Log.e(TAG, "Error processing notification: " + e.getMessage());
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        if (sbn == null) return;
        Log.d(TAG, "Notification dismissed from: " + sbn.getPackageName());
    }

    private void persistEvents() {
        try {
            SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            StringBuilder sb = new StringBuilder("[");
            synchronized (memoryEvents) {
                for (int i = 0; i < memoryEvents.size(); i++) {
                    if (i > 0) sb.append(",");
                    sb.append(memoryEvents.get(i));
                }
            }
            sb.append("]");
            prefs.edit().putString(KEY_EVENTS, sb.toString()).apply();
        } catch (Exception ignored) {}
    }

    public static String getRecentNotificationsJson(Context context) {
        if (!memoryEvents.isEmpty()) {
            StringBuilder sb = new StringBuilder("[");
            synchronized (memoryEvents) {
                for (int i = 0; i < memoryEvents.size(); i++) {
                    if (i > 0) sb.append(",");
                    sb.append(memoryEvents.get(i));
                }
            }
            sb.append("]");
            return sb.toString();
        }

        if (context != null) {
            try {
                SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                return prefs.getString(KEY_EVENTS, "[]");
            } catch (Exception ignored) {}
        }
        return "[]";
    }

    public static void clearNotifications(Context context) {
        memoryEvents.clear();
        if (context != null) {
            try {
                SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
                prefs.edit().remove(KEY_EVENTS).apply();
            } catch (Exception ignored) {}
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"') sb.append("\\\\\\\"");
            else if (c == '\\\\') sb.append("\\\\\\\\");
            else if (c == '\\b') sb.append("\\\\b");
            else if (c == '\\f') sb.append("\\\\f");
            else if (c == '\\n') sb.append("\\\\n");
            else if (c == '\\r') sb.append("\\\\r");
            else if (c == '\\t') sb.append("\\\\t");
            else if (c < ' ') {
                String hex = Integer.toHexString(c);
                sb.append("\\\\u");
                for (int k = 0; k < 4 - hex.length(); k++) sb.append('0');
                sb.append(hex);
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
"""

with open(os.path.join(SERVICE_DIR, "FocusShieldNotificationListenerService.java"), "w", encoding="utf-8") as f:
    f.write(SERVICE_CODE)

# 3. Resources
icon_src = os.path.join(WEB_DIST, "quietpulse-logo-transparent.png")
shutil.copyfile(icon_src, os.path.join(RES_DRAWABLE, "ic_launcher.png"))

with open(os.path.join(RES_VALUES, "strings.xml"), "w", encoding="utf-8") as f:
    f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">QuietPulse</string>
</resources>
""")

# 4. Copy Web Dist Assets
shutil.copytree(WEB_DIST, ASSETS_DIR)

# 5. Write AndroidManifest.xml
MANIFEST_PATH = os.path.join(BUILD_DIR, "AndroidManifest.xml")
with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    f.write("""<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.focusshield.ai"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk
        android:minSdkVersion="26"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="false"
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:hardwareAccelerated="true">

        <activity
            android:name="com.focusshield.ai.MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:label="@string/app_name">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name="com.focusshield.ai.service.FocusShieldNotificationListenerService"
            android:exported="true"
            android:label="QuietPulse Notification Intelligence"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

    </application>

</manifest>
""")

# 6. Compile Resources with AAPT2
COMPILED_RES_ZIP = os.path.join(BUILD_DIR, "compiled_res.zip")
run([AAPT2_EXE, "compile", "--dir", RES_DIR, "-o", COMPILED_RES_ZIP])

# 7. Link Resources & Manifest with AAPT2 -> unaligned APK
UNALIGNED_APK = os.path.join(BUILD_DIR, "unaligned.apk")
run([
    AAPT2_EXE, "link",
    "-I", ANDROID_JAR,
    "--manifest", MANIFEST_PATH,
    "-o", UNALIGNED_APK,
    "-A", ASSETS_DIR,
    "--auto-add-overlay",
    COMPILED_RES_ZIP
])

# 8. Compile Java to class files
JAVA_FILES = [
    os.path.join(COM_DIR, "MainActivity.java"),
    os.path.join(SERVICE_DIR, "FocusShieldNotificationListenerService.java")
]
run([
    JAVAC_EXE,
    "-cp", ANDROID_JAR,
    "-d", BIN_DIR,
    "-source", "1.8",
    "-target", "1.8"
] + JAVA_FILES)

# 9. Convert class files to classes.dex using D8
CLASSES = []
for root, _, files in os.walk(BIN_DIR):
    for f in files:
        if f.endswith(".class"):
            CLASSES.append(os.path.join(root, f))

run([
    JAVA_EXE,
    "-cp", D8_JAR,
    "com.android.tools.r8.D8",
    "--output", BUILD_DIR,
    "--lib", ANDROID_JAR
] + CLASSES)

DEX_FILE = os.path.join(BUILD_DIR, "classes.dex")
print("DEX exists:", os.path.exists(DEX_FILE))

# 10. Add classes.dex to unaligned.apk
with zipfile.ZipFile(UNALIGNED_APK, "a") as z:
    z.write(DEX_FILE, "classes.dex")

# 11. Create Debug Keystore if needed
KEYSTORE_PATH = os.path.join(BUILD_DIR, "debug.keystore")
run([
    KEYTOOL_EXE,
    "-genkeypair",
    "-keystore", KEYSTORE_PATH,
    "-storepass", "android",
    "-alias", "androiddebugkey",
    "-keypass", "android",
    "-keyalg", "RSA",
    "-keysize", "2048",
    "-validity", "10000",
    "-dname", "CN=QuietPulse, OU=HackoRuv, O=QuietPulse, L=Nagpur, S=MH, C=IN"
])

# 12. Sign with jarsigner (v1 JAR signature scheme)
run([
    JARSIGNER_EXE,
    "-keystore", KEYSTORE_PATH,
    "-storepass", "android",
    "-keypass", "android",
    "-sigalg", "SHA256withRSA",
    "-digestalg", "SHA-256",
    UNALIGNED_APK,
    "androiddebugkey"
])

# 13. ZipAlign the APK
ALIGNED_APK = os.path.join(BUILD_DIR, "aligned.apk")
run([ZIPALIGN_EXE, "-p", "-f", "4", UNALIGNED_APK, ALIGNED_APK])

# 14. Sign the APK using apksigner with v2 and v3 signatures
run([
    JAVA_EXE,
    "-jar", APKSIGNER_JAR,
    "sign",
    "--ks", KEYSTORE_PATH,
    "--ks-pass", "pass:android",
    "--ks-key-alias", "androiddebugkey",
    "--key-pass", "pass:android",
    "--out", os.path.join(BUILD_DIR, "QuietPulse-signed.apk"),
    ALIGNED_APK
])

FINAL_SIGNED = os.path.join(BUILD_DIR, "QuietPulse-signed.apk")

# 14. Verify the Signature
run([
    JAVA_EXE,
    "-jar", APKSIGNER_JAR,
    "verify",
    "--verbose",
    FINAL_SIGNED
])

# 15. Copy to target locations (Root, Android Debug Output, and Web Public)
OUT_ROOT_APK = os.path.join(BASE_DIR, "QuietPulse.apk")
OUT_DEBUG_DIR = os.path.join(BASE_DIR, "android", "app", "build", "outputs", "apk", "debug")
os.makedirs(OUT_DEBUG_DIR, exist_ok=True)
OUT_DEBUG_APK = os.path.join(OUT_DEBUG_DIR, "app-debug.apk")
OUT_WEB_PUBLIC_APK = os.path.join(BASE_DIR, "web", "public", "QuietPulse.apk")

shutil.copyfile(FINAL_SIGNED, OUT_ROOT_APK)
shutil.copyfile(FINAL_SIGNED, OUT_DEBUG_APK)
shutil.copyfile(FINAL_SIGNED, OUT_WEB_PUBLIC_APK)

print("=" * 60)
print("SUCCESS: QuietPulse APK Built & Signed Successfully!")
print(f"File 1: {OUT_ROOT_APK} ({os.path.getsize(OUT_ROOT_APK)} bytes)")
print(f"File 2: {OUT_DEBUG_APK} ({os.path.getsize(OUT_DEBUG_APK)} bytes)")
print(f"File 3: {OUT_WEB_PUBLIC_APK} ({os.path.getsize(OUT_WEB_PUBLIC_APK)} bytes)")
print("=" * 60)
