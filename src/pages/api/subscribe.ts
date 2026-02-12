import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = body.email?.trim();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.RESEND_API_KEY;
    const audienceId = import.meta.env.RESEND_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      console.error('Missing RESEND_API_KEY or RESEND_AUDIENCE_ID');
      return new Response(
        JSON.stringify({ error: 'Newsletter service is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ message: 'Successfully subscribed!' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resend returns 409 if already subscribed — treat as success
    if (response.status === 409) {
      return new Response(
        JSON.stringify({ message: "You're already subscribed!" }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const errorData = await response.json().catch(() => ({}));
    console.error('Resend API error:', response.status, errorData);

    return new Response(
      JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscribe endpoint error:', error);

    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
