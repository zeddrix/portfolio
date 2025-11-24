import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

/**
 * Email data for contact form submissions
 */
interface ContactEmailData {
	name: string;
	email: string;
	message: string;
	timestamp: string;
	clientIp: string;
}

/**
 * Send contact form email notification
 *
 * This function sends an email notification when someone submits the contact form.
 * You can implement this using:
 * 1. Supabase Edge Functions (recommended)
 * 2. Resend API
 * 3. SendGrid API
 * 4. Mailgun API
 * 5. Nodemailer with SMTP
 *
 * For now, this is a placeholder that logs the message.
 * Replace this with your preferred email service.
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
	const { name, email, message, timestamp, clientIp } = data;

	// Format email content
	const emailSubject = `Portfolio Contact: Message from ${name}`;
	const emailBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Timestamp: ${timestamp}
IP Address: ${clientIp}

Message:
${message}

---
Sent from zeddrix.com portfolio contact form
	`.trim();

	// Option 1: Log to console (development/testing)
	console.log('=== Contact Form Email ===');
	console.log('Subject:', emailSubject);
	console.log('Body:', emailBody);
	console.log('========================');

	// Option 2: Use Supabase Edge Functions (uncomment when ready)
	/*
	try {
		const response = await fetch(`${PUBLIC_SUPABASE_URL}/functions/v1/send-contact-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
			},
			body: JSON.stringify({
				to: process.env.CONTACT_EMAIL_TO || 'your-email@example.com',
				subject: emailSubject,
				body: emailBody,
				replyTo: email
			})
		});

		if (!response.ok) {
			throw new Error(`Email function failed: ${response.statusText}`);
		}

		const result = await response.json();
		console.log('Email sent successfully:', result);
	} catch (error) {
		console.error('Failed to send email via Supabase:', error);
		throw error;
	}
	*/

	// Option 3: Use Resend API (uncomment when ready)
	/*
	const RESEND_API_KEY = process.env.RESEND_API_KEY;
	if (!RESEND_API_KEY) {
		throw new Error('RESEND_API_KEY is not set');
	}

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${RESEND_API_KEY}`
			},
			body: JSON.stringify({
				from: 'Portfolio Contact Form <noreply@zeddrix.com>',
				to: process.env.CONTACT_EMAIL_TO || 'your-email@example.com',
				reply_to: email,
				subject: emailSubject,
				text: emailBody
			})
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(`Resend API error: ${JSON.stringify(error)}`);
		}

		const result = await response.json();
		console.log('Email sent successfully via Resend:', result);
	} catch (error) {
		console.error('Failed to send email via Resend:', error);
		throw error;
	}
	*/

	// Option 4: Save to database as fallback (always recommended)
	/*
	try {
		const { error: dbError } = await supabase.from('contact_submissions').insert({
			name,
			email,
			message,
			ip_address: clientIp,
			created_at: timestamp
		});

		if (dbError) {
			console.error('Failed to save contact submission to database:', dbError);
		}
	} catch (error) {
		console.error('Database error:', error);
	}
	*/

	// For now, just resolve successfully (logging only)
	return Promise.resolve();
}

/**
 * Helper function to validate email service configuration
 */
export function checkEmailConfiguration(): {
	configured: boolean;
	service: string | null;
	error: string | null;
} {
	// Check for Resend API key
	const resendKey = process.env.RESEND_API_KEY;
	if (resendKey) {
		return { configured: true, service: 'Resend', error: null };
	}

	// Check for Supabase Edge Functions
	if (PUBLIC_SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
		return { configured: true, service: 'Supabase Edge Functions', error: null };
	}

	// No email service configured
	return {
		configured: false,
		service: null,
		error: 'No email service configured. Contact form submissions will be logged only.'
	};
}
