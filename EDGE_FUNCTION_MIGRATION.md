# Edge Function Migration Guide

## Overview

This document explains the migration from using database triggers to calling the edge function directly from the frontend. The edge function now handles all database operations, email notifications, and calendar entries in a single, secure location.

## What Changed

### Before (Database Triggers)
1. Frontend creates/updates records in Supabase
2. Database triggers automatically call the edge function
3. Edge function sends emails and handles calendar entries

### After (Direct Frontend Calls)
1. Frontend sends data to edge function
2. Edge function handles database operations, emails, and calendar entries
3. Frontend updates local state based on edge function response

## Updated Files

### New Files
- `src/utils/edgeFunctionUtils.ts` - Utility functions for calling the edge function

### Modified Files
- `src/hooks/useCreateBooking.ts` - Now sends booking data to edge function
- `src/hooks/useCreateRequest.ts` - Now sends request data to edge function
- `src/hooks/useApprovalOperations.ts` - Now sends approval data to edge function
- `src/hooks/useRequestCommentOperations.ts` - Now sends comment data to edge function
- `src/hooks/useCancellationOperations.ts` - Now sends cancellation data to edge function
- `src/hooks/useCancelRequest.ts` - Now sends cancellation data to edge function
- `src/hooks/useCompleteRequest.ts` - Now sends completion data to edge function
- `bookingsystem-dbtrigger/supabase/functions/bookingnotifications/index.ts` - Now handles database operations

## How It Works

### Edge Function Responsibilities
The edge function now handles all operations in a single place:

1. **Database Operations** - Inserts/updates records in Supabase
2. **Email Notifications** - Sends appropriate emails based on operation type
3. **Calendar Entries** - Creates calendar events and Nostr posts
4. **Error Handling** - Provides comprehensive error handling and logging

### Frontend Integration
The frontend sends data to the edge function and handles the response:

```typescript
// The Supabase client handles authentication automatically
const { data, error } = await supabase.functions.invoke('bookingnotifications', {
  body: payload,
});
```

This approach:
- Uses Supabase's built-in authentication
- Doesn't require webhook signatures (which are deprecated)
- Provides better error handling
- Is more secure and reliable
- Centralizes all business logic in the edge function

### Payload Structure
All edge function calls use the same payload structure:

```typescript
{
  record: {
    // Complete record data for database operations
  },
  type: 'new_booking' | 'confirmed_booking' | 'new_request' | 'new_request_comment'
}
```

## Benefits

1. **Better Security** - Database operations happen server-side with proper authentication
2. **Centralized Logic** - All business logic in one place
3. **Better Error Handling** - Comprehensive error handling and logging
4. **No Database Dependencies** - Eliminates need for database triggers
5. **Easier Testing** - Can test edge function calls independently
6. **Modern Approach** - Uses current best practices instead of deprecated webhook signatures
7. **Atomic Operations** - Database operations, emails, and calendar entries happen atomically

## Migration Steps

### 1. Deploy Updated Edge Function
Deploy the updated edge function that handles database operations, emails, and calendar entries.

### 2. Update Frontend Code
The frontend code has been updated to send data to the edge function. No additional changes needed.

### 3. Remove Database Triggers (Recommended)
Since we're no longer using database triggers, you can remove them:

1. Drop the trigger functions:
   ```sql
   DROP TRIGGER IF EXISTS on_new_booking_inserted ON bookings;
   DROP TRIGGER IF EXISTS on_booking_approved ON bookings;
   DROP TRIGGER IF EXISTS on_new_request_inserted ON requests;
   DROP TRIGGER IF EXISTS on_new_request_comment_inserted ON request_comments;
   ```

2. Drop the trigger functions:
   ```sql
   DROP FUNCTION IF EXISTS public.handle_new_booking();
   DROP FUNCTION IF EXISTS public.handle_booking_approval();
   DROP FUNCTION IF EXISTS public.handle_new_request();
   DROP FUNCTION IF EXISTS public.handle_new_request_comment();
   ```

3. Drop the helper functions:
   ```sql
   DROP FUNCTION IF EXISTS public.get_trigger_auth_secret();
   DROP FUNCTION IF EXISTS public.create_webhook_signature();
   ```

4. Remove the email triggers SQL file:
   ```bash
   rm bookingsystem-dbtrigger/email_triggers.sql
   ```

## Error Handling

The frontend hooks include comprehensive error handling:

- If the edge function call fails, it shows an error message to the user
- Database operations, emails, and calendar entries happen atomically
- If any part fails, the entire operation is rolled back
- Users get clear feedback about what went wrong

## Testing

### Test Edge Function Directly
```typescript
import { callEdgeFunction, createBookingPayload } from '@/utils/edgeFunctionUtils';

const testPayload = createBookingPayload({
  id: 'test-id',
  title: 'Test Booking',
  // ... other fields
}, 'new_booking');

const result = await callEdgeFunction(testPayload);
console.log(result);
```

### Test in Development
1. Create a booking/request through the UI
2. Check browser console for edge function call logs
3. Verify database records are created
4. Verify emails are sent and calendar entries are created

## Troubleshooting

### Edge Function Not Called
1. Check browser console for errors
2. Verify Supabase client is properly authenticated
3. Check edge function logs in Supabase dashboard

### Database Operations Fail
1. Check edge function logs for database errors
2. Verify Supabase service role key is configured
3. Check database permissions and RLS policies

### Emails Not Sent
1. Check edge function logs for email configuration errors
2. Verify environment variables are set correctly
3. Check if `EMAIL_DISABLED` is set to `true`

### Calendar Entries Not Created
1. Check edge function logs for calendar integration errors
2. Verify Google Calendar credentials are configured
3. Check Nostr integration settings

## Future Enhancements

1. **Add More Event Types** - Support for cancellation and completion notifications
2. **Retry Logic** - Implement retry mechanism for failed operations
3. **Queue System** - Use a queue for edge function calls to handle high load
4. **Metrics** - Add monitoring and metrics for edge function calls
5. **Transaction Support** - Implement proper database transactions for complex operations 