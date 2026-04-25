import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ciprianrarau.com.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-20">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Legal</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-10">
              Privacy Policy
            </h1>
            <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary">
              <p>
                <em>Last updated: April 2026.</em>
              </p>
              <p>
                This site collects only the data necessary to operate it. No third-party
                tracking pixels, no advertising networks, no behaviour profiling.
              </p>
              <h2>What I collect</h2>
              <ul>
                <li>
                  <strong>Server access logs.</strong> Standard request metadata (IP, user
                  agent, path, timestamp), retained briefly for operational reasons.
                </li>
                <li>
                  <strong>Newsletter signups.</strong> If you give me your email, it goes to
                  a Resend audience that I use to send occasional updates. You can unsubscribe
                  at any time.
                </li>
                <li>
                  <strong>Contact form submissions.</strong> Sent directly to my inbox. Not
                  stored anywhere else.
                </li>
                <li>
                  <strong>Analytics.</strong> Privacy-respecting page-view counts via
                  PostHog or a comparable provider. No cross-site tracking.
                </li>
              </ul>
              <h2>What I do not collect</h2>
              <ul>
                <li>Personally identifiable information beyond what you submit.</li>
                <li>Cross-site behaviour profiles.</li>
                <li>Anything I would not be comfortable explaining to you in person.</li>
              </ul>
              <h2>How to reach me</h2>
              <p>
                If you want your data removed, or want to know exactly what I have, email{' '}
                <a href="mailto:chip@ideaplaces.com">chip@ideaplaces.com</a>.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
