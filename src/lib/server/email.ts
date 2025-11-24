import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

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
 * Initialize Resend client
 */
function getResendClient(): Resend | null {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn('RESEND_API_KEY not configured - emails will be logged to console only');
		return null;
	}
	return new Resend(apiKey);
}

/**
 * Send contact form email notification using Resend
 *
 * Environment variables required:
 * - RESEND_API_KEY: Your Resend API key
 * - CONTACT_EMAIL_FROM: Email address to send from (must be verified in Resend)
 * - CONTACT_EMAIL_TO: Your email address to receive contact form submissions
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

	// Try to send via Resend if configured
	const resend = getResendClient();

	if (resend) {
		const fromEmail = env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev';
		const toEmail = env.CONTACT_EMAIL_TO;

		if (!toEmail) {
			console.error('CONTACT_EMAIL_TO is not set - cannot send email');
			throw new Error('Email service not properly configured');
		}

		try {
			const result = await resend.emails.send({
				from: fromEmail,
				to: toEmail,
				replyTo: email,
				subject: emailSubject,
				text: emailBody
			});

			console.log('Email sent successfully via Resend:', result);
			return;
		} catch (error) {
			console.error('Failed to send email via Resend:', error);
			throw error;
		}
	}

	// Fallback: Log to console if Resend is not configured
	console.log('=== Contact Form Email (Console Only) ===');
	console.log('Subject:', emailSubject);
	console.log('Body:', emailBody);
	console.log('=========================================');

	// In development/testing without Resend configured, just resolve successfully
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
	const resendKey = env.RESEND_API_KEY;
	const toEmail = env.CONTACT_EMAIL_TO;

	if (resendKey && toEmail) {
		return { configured: true, service: 'Resend', error: null };
	}

	if (resendKey && !toEmail) {
		return {
			configured: false,
			service: null,
			error: 'RESEND_API_KEY is set but CONTACT_EMAIL_TO is missing'
		};
	}

	// No email service configured
	return {
		configured: false,
		service: null,
		error: 'No email service configured. Contact form submissions will be logged only.'
	};
}
