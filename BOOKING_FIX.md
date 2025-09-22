# Booking Modal Content-Type Fix

## Issue
When trying to book a property from the office page modal, the network showed this error:
```
"Unsupported Media Type: /api/bookings/"
{"detail":"Unsupported media type \"text/plain;charset=UTF-8\" in request."}
```

## Root Cause
The issue was in the `authenticatedRequest` method in `src/services/api.ts`. The header spreading order was incorrect:

**Before (incorrect):**
```typescript
headers: {
  Authorization: `Bearer ${token}`,
  ...options.headers,  // This overrode Content-Type
},
```

**After (fixed):**
```typescript
headers: {
  ...options.headers,
  Authorization: `Bearer ${token}`,  // Authorization after spread
},
```

## What Was Happening
1. The base `request` method sets `Content-Type: 'application/json'`
2. The `authenticatedRequest` method was spreading `options.headers` AFTER setting Authorization
3. When `options.headers` was empty or contained other headers, it overrode the Content-Type
4. This caused the request to be sent without the proper Content-Type header
5. Django rejected the request with a 415 "Unsupported Media Type" error

## Solution Applied
1. **Fixed header order**: Put the spread of `options.headers` first, then add Authorization
2. **Improved image upload**: Made image upload method more explicit about not setting Content-Type for FormData
3. **Tested the fix**: Confirmed booking creation now works with proper Content-Type headers

## Test Results
After the fix:
- ✅ Login works correctly
- ✅ Booking creation returns 201 status
- ✅ Proper JSON response with booking details
- ✅ Content-Type headers are sent correctly as `application/json`

## Files Modified
- `src/services/api.ts` - Fixed header order in `authenticatedRequest` method
- `src/services/api.ts` - Improved `uploadImage` method to handle FormData properly

The booking modal should now work correctly without the "Unsupported Media Type" error.