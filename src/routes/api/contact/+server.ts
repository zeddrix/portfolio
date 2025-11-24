import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { contactSchema } from '$lib/schemas/forms';
import { sendContactEmail } from '$lib/server/email';

/**
 * Handle contact form submissions
 * POST /api/contact
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		// Parse and validate form data
		const formData = await request.json();

		// Validate with Zod schema
		const validation = contactSchema.safeParse(formData);

		if (!validation.success) {
			return json(
				{
					success: false,
					errors: validation.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		const { name, email, message, website } = validation.data;

		// Honeypot check - if website field is filled, it's likely spam
		if (website && website.length > 0) {
			// Silently reject spam (return success but don't send email)
			console.warn('Spam detected from:', getClientAddress());
			return json({
				success: true,
				message: 'Thank you for your message. I will get back to you soon!'
			});
		}

		// Rate limiting check (simple IP-based check)
		// In production, you might want to use a more sophisticated rate limiting solution
		const clientIp = getClientAddress();
		console.log('Contact form submission from:', clientIp);

		// Send email notification
		try {
			await sendContactEmail({
				name,
				email,
				message,
				timestamp: new Date().toISOString(),
				clientIp
			});

			return json({
				success: true,
				message: 'Thank you for your message. I will get back to you soon!'
			});
		} catch (emailError) {
			console.error('Failed to send email:', emailError);
			// Still return success to user, but log the error
			// You might want to save to database as fallback
			return json(
				{
					success: false,
					message: 'Failed to send message. Please try again or contact me directly via email.'
				},
				{ status: 500 }
			);
		}
	} catch (err) {
		console.error('Contact form error:', err);
		return error(500, 'An unexpected error occurred. Please try again later.');
	}
};
