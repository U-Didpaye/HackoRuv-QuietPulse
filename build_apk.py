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
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.graphics.Color;

public class MainActivity extends Activity {
    private WebView mWebView;

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

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        mWebView.setWebChromeClient(new WebChromeClient());

        mWebView.loadUrl("file:///android_asset/index.html");
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

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

public class FocusShieldNotificationListenerService extends NotificationListenerService {
    private static final String TAG = "QuietPulseService";

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (sbn == null) return;
        String pkg = sbn.getPackageName();
        Log.d(TAG, "Notification received from: " + pkg);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        if (sbn == null) return;
        Log.d(TAG, "Notification dismissed: " + sbn.getPackageName());
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

# 15. Copy to target locations
OUT_ROOT_APK = os.path.join(BASE_DIR, "QuietPulse.apk")
OUT_DEBUG_DIR = os.path.join(BASE_DIR, "android", "app", "build", "outputs", "apk", "debug")
os.makedirs(OUT_DEBUG_DIR, exist_ok=True)
OUT_DEBUG_APK = os.path.join(OUT_DEBUG_DIR, "app-debug.apk")

shutil.copyfile(FINAL_SIGNED, OUT_ROOT_APK)
shutil.copyfile(FINAL_SIGNED, OUT_DEBUG_APK)

print("=" * 60)
print("SUCCESS: QuietPulse APK Built & Signed Successfully!")
print(f"File 1: {OUT_ROOT_APK} ({os.path.getsize(OUT_ROOT_APK)} bytes)")
print(f"File 2: {OUT_DEBUG_APK} ({os.path.getsize(OUT_DEBUG_APK)} bytes)")
print("=" * 60)
