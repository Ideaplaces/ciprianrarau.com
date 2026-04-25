import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'If you are building something interesting and want to compare notes, I read every message.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-20 pb-20 md:pt-28">
          <Container size="narrow">
            <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
              <span className="inline-block h-px w-10 bg-secondary" />
              <span>Get in touch</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Send a message.
            </h1>
            <p className="text-lg leading-relaxed text-foreground-muted max-w-2xl mb-10">
              If you are building something interesting and want to compare notes, I read
              every message. The fastest way to reach me is{' '}
              <a
                href="mailto:chip@ideaplaces.com"
                className="text-primary font-semibold hover:text-primary-dark"
              >
                chip@ideaplaces.com
              </a>
              . The form below routes to the same inbox.
            </p>
            <ContactForm />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
