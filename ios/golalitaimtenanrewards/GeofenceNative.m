// ios/Golalita/GeofenceNative.m

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(GeofenceNative, NSObject)

RCT_EXTERN_METHOD(setAuthData:(nonnull NSNumber *)userId
                  token:(NSString *)fcmToken)

RCT_EXTERN_METHOD(registerMerchants:(NSArray *)points
                  radiusMeters:(nonnull NSNumber *)radiusMeters)

@end
