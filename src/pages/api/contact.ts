import type { APIRoute } from 'astro';

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY not configured, skipping verification');
    return true; // Allow if not configured (for development)
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const turnstileToken = formData.get('cf-turnstile-response') as string;

    // Verify Turnstile CAPTCHA
    if (import.meta.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/contact?error=captcha' },
        });
      }

      const isValid = await verifyTurnstile(turnstileToken);
      if (!isValid) {
        return new Response(null, {
          status: 302,
          headers: { Location: '/contact?error=captcha' },
        });
      }
    }

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const recipientEmail = import.meta.env.RECIPIENT_EMAIL || 'me@ciprianrarau.com';

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY');
      return new Response(null, {
        status: 302,
        headers: { Location: '/contact?error=true' },
      });
    }

    // HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
              }
              .header {
                  background-color: #f8f9fa;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 20px;
              }
              .content {
                  background-color: white;
                  padding: 20px;
                  border: 1px solid #e9ecef;
                  border-radius: 8px;
              }
              .field {
                  margin-bottom: 15px;
              }
              .label {
                  font-weight: bold;
                  color: #495057;
              }
              .value {
                  margin-top: 5px;
                  padding: 10px;
                  background-color: #f8f9fa;
                  border-radius: 4px;
              }
              .message-content {
                  white-space: pre-wrap;
                  line-height: 1.5;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h2>New Contact Form Submission</h2>
              <p>From: ciprianrarau.com</p>
          </div>

          <div class="content">
              <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
              </div>

              <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${email}</div>
              </div>

              <div class="field">
                  <div class="label">Message:</div>
                  <div class="value message-content">${message}</div>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Contact Form <contact@ciprianrarau.com>',
        to: [recipientEmail],
        reply_to: email,
        subject: `New Contact: ${name}`,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Resend API error:', response.status, errorData);
      return new Response(null, {
        status: 302,
        headers: { Location: '/contact?error=true' },
      });
    }

    // Return success response with redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/contact?success=true',
      },
    });

  } catch (error) {
    console.error('Email sending failed:', error);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/contact?error=true',
      },
    });
  }
};
