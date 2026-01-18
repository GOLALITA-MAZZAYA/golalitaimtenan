# GlobalTix Integration

This screen integrates with the GlobalTix API to display a list of attractions, tours, and activities.

## Setup Instructions

### 1. Access Token Already Configured

The GlobalTix integration is already configured with a valid access token in `src/api/globalTix.js`. The token is valid until January 16, 2025.

### 2. Environment Configuration

Edit `src/config/globalTix.js` to switch between environments:

```javascript
// Change this to switch environments
CURRENT_ENV: 'STAGING', // or 'PRODUCTION'
```

### 2. Test the Integration

1. Run your app
2. Open the drawer menu
3. Tap "GlobalTix"
4. The screen will attempt to authenticate and load products

## Features

- ✅ **Product Listing**: Displays attractions, tours, and activities
- ✅ **Pagination**: Loads 16 items per page (GlobalTix limit)
- ✅ **Pull to Refresh**: Refresh the product list
- ✅ **Image Loading**: Loads product images from GlobalTix CDN
- ✅ **Product Details**: Shows name, location, price, category
- ✅ **Feature Badges**: Recommended, Instant Confirmation, Cancellable
- ✅ **Error Handling**: Authentication and API error handling

## API Endpoints Used

- `POST /api/auth/login` - Authentication (via useGlobalTix hook)
- `GET /api/product/list` - Product listing (via useGlobalTix hook)
- `GET /api/product/info` - Product details (ready for future use)
- `GET /api/product/options` - Product options (ready for future use)

## Architecture

- **Custom Hook**: `useGlobalTix()` - Manages all API calls and state
- **Functional Components**: All components use React hooks
- **Modern React Patterns**: useState, useCallback, useMemo for optimization

## Data Structure

The screen displays products with the following information:
- Product name
- City and country
- Price (original price or from price)
- Category (Attraction, Tours, Lifestyle, etc.)
- Feature badges (Recommended, Instant, Cancellable)

## Next Steps

1. **Add Product Details Screen**: Navigate to detailed product view
2. **Implement Booking Flow**: Add booking functionality
3. **Add Search & Filters**: Filter by category, price, etc.
4. **Add Favorites**: Save favorite products
5. **Implement Webhooks**: Real-time updates

## Troubleshooting

### Authentication Failed
- The access token is already configured and valid until January 16, 2025
- If you get authentication errors, the token may have expired
- Contact your GlobalTix account manager for a new token
- Verify staging vs production environment

### No Products Displayed
- Check API response in console
- Verify country code (currently set to 'SG' for Singapore)
- Check if products exist for the selected country

### Images Not Loading
- Verify image paths from API response
- Check network connectivity
- Ensure GlobalTix CDN is accessible

## Environment Switching

To switch between staging and production:

1. Update `CURRENT_ENV` in `src/config/globalTix.js`
2. Update credentials for the target environment
3. Restart the app

```javascript
CURRENT_ENV: 'PRODUCTION', // or 'STAGING'
```
