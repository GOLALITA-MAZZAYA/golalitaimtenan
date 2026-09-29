# React Native / Hermes / JNI
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

-keepclassmembers @com.facebook.react.uimanager.ReactProp class * {
    void set*(***);
    *** get*();
}

-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.yoga.** { *; }
-keep class com.facebook.react.defaults.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp *;
    @com.facebook.react.uimanager.annotations.ReactPropGroup *;
}

-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.ReactContextBaseJavaModule { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes Exceptions
-keepattributes SourceFile,LineNumberTable
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-renamesourcefileattribute SourceFile

-keepclasseswithmembernames class * {
    native <methods>;
}

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

# App entry points (manifest)
-keep class com.golalitaimtenanrewards.MainApplication { *; }
-keep class com.golalitaimtenanrewards.MainActivity { *; }
-keep class com.golalitaimtenanrewards.orientation.** { *; }
-keep class com.golalitaimtenanrewards.security.** { *; }

# Firebase / Google Play Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.gms.internal.** { *; }
-dontwarn com.google.android.gms.internal.**
-dontwarn com.google.**

# Play Services Location — R8 Kotlin Companion (minifyReleaseWithR8)
-keep class com.google.android.gms.internal.location.** { *; }
-keepclassmembers class * {
    public static ** Companion;
}
-keepclassmembers class **$Companion {
    *;
}

# React Native Firebase / Notifee
-keep class io.invertase.firebase.** { *; }
-keep class io.invertase.notifee.** { *; }
-keep class app.notifee.** { *; }

# Common React Native libraries
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.rnscreens.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }
-keep class com.reactnativecommunity.** { *; }
-keep class com.zoontek.rnbootsplash.** { *; }
-keep class com.imagepicker.** { *; }
-keep class com.reactnative.ivpusic.imagepicker.** { *; }
-keep class com.rnfs.** { *; }
-keep class com.reactnativecommunity.webview.** { *; }
-keep class com.reactnativepagerview.** { *; }
-keep class com.airbnb.android.react.lottie.** { *; }
-keep class com.dylanvann.fastimage.** { *; }
-keep class cl.json.** { *; }
-keep class com.reactnative.sslpublickeypinning.** { *; }
-keep class com.rnmaps.maps.** { *; }
-keep class com.agontuk.RNFusedLocation.** { *; }
-keep class com.agontuk.RNFusedLocation.RNFusedLocationModule { *; }
-keep class com.github.wumke.RNExitApp.** { *; }
-keep class com.wix.reactnativenotifications.** { *; }

# FreeRASP / Talsec
# Do not blanket-keep freeraspreactnative/talsec packages: the SDK ships its own
# consumer ProGuard rules (including "-repackageclasses 'ts'"). A wildcard -keep
# would defeat that repackaging and fail freeRASP's obfuscation self-check.
-dontwarn java.lang.invoke.StringConcatFactory

-if @kotlinx.serialization.Serializable class **
-keep class <1> {
    *;
}

-keep class com.freeraspreactnative.models.RNSuspiciousAppInfo$Companion
-keep class com.freeraspreactnative.models.RNPackageInfo$Companion

# Fresco / OkHttp (React Native image stack)
-keep class com.facebook.imagepipeline.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Kotlin (metadata for GMS / third-party Kotlin libs under R8)
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
