# Add project specific ProGuard rules here.
# For more details, see:
#   https://developer.android.com/studio/build/shrink-code

-include ../../node_modules/react-native/ReactAndroid/proguard-rules.pro

# Strip Android Log calls in release builds.
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
    public static int e(...);
    public static int wtf(...);
}

# Preserve line numbers for crash reports (mapping file still required for deobfuscation).
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# App entry points
-keep class com.golalitaimtenanrewards.MainApplication { *; }
-keep class com.golalitaimtenanrewards.MainActivity { *; }
-keep class com.golalitaimtenanrewards.orientation.** { *; }
-keep class com.golalitaimtenanrewards.security.** { *; }

# React Native / Hermes / New Architecture
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.defaults.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }

# freeRASP / Talsec
# No blanket keep rules here: the SDK bundles its own consumer ProGuard rules
# (including "-repackageclasses 'ts'"), and a wildcard -keep on its packages
# would preserve its class/method names verbatim, defeating that repackaging
# and causing freeRASP's own obfuscation self-check to fail.
-dontwarn java.lang.invoke.StringConcatFactory

# Notifee / Firebase messaging
-keep class io.invertase.notifee.** { *; }
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# OkHttp / SSL pinning
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# React Native autolinked native modules
-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Kotlin metadata used by some libraries
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

# kotlinx.serialization (freeRASP malware payloads)
-if @kotlinx.serialization.Serializable class **
-keep class <1> { *; }

-keep class com.freeraspreactnative.models.RNSuspiciousAppInfo$Companion { *; }
-keep class com.freeraspreactnative.models.RNPackageInfo$Companion { *; }
