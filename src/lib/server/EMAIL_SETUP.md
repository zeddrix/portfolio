# Email Configuration for Contact Form

This guide explains how to set up email notifications for the contact form submissions.

## Current Status

The contact form validation and API endpoint are fully functional. Currently, form submissions are **logged to the console** for development/testing purposes.

## Email Service Options

You can choose from several email service providers. Uncomment the relevant section in `src/lib/server/email.ts` to enable your preferred service.

### Option 1: Resend (Recommended)

Resend is a modern, developer-friendly email API service with a generous free tier.

**Steps:**

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to your `.env` file:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   CONTACT_EMAIL_TO=your-email@example.com
   ```
4. Uncomment the Resend section in `src/lib/server/email.ts` (lines marked "Option 3")
5. Comment out the console.log section (lines marked "Option 1")

**Pros:**

- Simple API
- Free tier: 3,000 emails/month
- Good deliverability
- No credit card required for free tier

### Option 2: Supabase Edge Functions

Use Supabase's serverless functions to send emails via any SMTP provider.

**Steps:**

1. Create a Supabase Edge Function:

   ```bash
   supabase functions new send-contact-email
   ```

2. Implement the function to send emails (use Resend, SendGrid, or SMTP)

3. Deploy the function:

   ```bash
   supabase functions deploy send-contact-email
   ```

4. Add environment variable:

   ```bash
   CONTACT_EMAIL_TO=your-email@example.com
   ```

5. Uncomment the Supabase section in `src/lib/server/email.ts` (lines marked "Option 2")
6. Comment out the console.log section (lines marked "Option 1")

**Pros:**

- Integrated with your existing Supabase project
- Can use any SMTP provider
- Serverless, scales automatically

### Option 3: Save to Database (Fallback/Additional)

Store all contact form submissions in the database for backup and admin review.

**Steps:**

1. Create a new table in Supabase:

   ```sql
   CREATE TABLE contact_submissions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     message TEXT NOT NULL,
     ip_address TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

   -- Allow authenticated users (admins) to read
   CREATE POLICY "Admins can view submissions"
     ON contact_submissions FOR SELECT
     USING (is_admin());
   ```

2. Uncomment the database save section in `src/lib/server/email.ts` (lines marked "Option 4")

**Pros:**

- Never lose a submission
- Admin can review all messages
- Works even if email service fails

**Recommended:** Use this **in addition** to email notifications for redundancy.

## Testing

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to the contact form section (bottom of the homepage)

3. Fill out and submit the form

4. Check your chosen email service or console logs for the submission

## Form Validation

The contact form includes:

- **Client-side validation**: Immediate feedback using Zod schemas
- **Server-side validation**: Double-checked on the API endpoint
- **Spam protection**: Honeypot field to catch bots
- **Error handling**: User-friendly error messages
- **Field requirements**:
  - Name: 2-100 characters
  - Email: Valid email format
  - Message: 10-2000 characters

## Security Features

- **Honeypot**: Hidden field that bots typically fill but humans don't see
- **Rate limiting**: Basic IP-based logging (can be enhanced with Redis)
- **Server-side validation**: All inputs validated with Zod before processing
- **Sanitization**: Email addresses and names are trimmed and validated
- **No SQL injection**: Using Supabase client with parameterized queries

## Future Enhancements

Consider adding:

- Rate limiting with Redis or Upstash
- reCAPTCHA v3 for advanced bot protection
- Email templates with HTML formatting
- Auto-reply to confirm receipt
- Admin notification preferences (email vs. dashboard only)
- Attachment support (with file validation and scanning)

## Troubleshooting

### Form submits but no email received

1. Check console logs for errors
2. Verify your email service API key is correct
3. Check spam folder
4. Verify the `CONTACT_EMAIL_TO` environment variable
5. Test your email service API directly (using curl or Postman)

### Validation errors

- Check that Zod schemas in `src/lib/schemas/forms.ts` match your requirements
- Verify form field names match schema keys
- Check browser console for client-side validation errors

### API errors

- Check the server logs (`pnpm dev` output)
- Verify environment variables are loaded
- Test the API endpoint directly: `POST /api/contact`

## Related Files

- **Validation schemas**: `src/lib/schemas/forms.ts`
- **Email utility**: `src/lib/server/email.ts`
- **API endpoint**: `src/routes/api/contact/+server.ts`
- **Contact form component**: `src/lib/components/shared/ContactSection.svelte`
