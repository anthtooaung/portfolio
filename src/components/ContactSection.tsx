import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { getSection } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GithubLogo, LinkedinLogo, TwitterLogo, PaperPlaneRight, CheckCircle, Spinner } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact';

interface Social {
  name: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, typeof GithubLogo> = {
  GitHub: GithubLogo,
  LinkedIn: LinkedinLogo,
  Twitter: TwitterLogo,
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSection() {
  const contactData = getSection('home/contact.md');
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  if (!contactData) return null;

  const title = contactData.meta.title ? String(contactData.meta.title) : "Let's work together";
  const email = contactData.meta.email ? String(contactData.meta.email) : null;
  const socials = (contactData.meta.socials as Social[]) || [];

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('submitting');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error('EmailJS configuration missing');
        setSubmitStatus('error');
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        publicKey
      );

      setSubmitStatus('success');
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/30 scroll-mt-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="max-w-xl mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2 animate-fade-up">
            {title}
          </h2>
          <div className="prose prose-lg dark:prose-invert text-muted-foreground animate-fade-up animation-delay-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contactData.content}
            </ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Contact info */}
          <div className="space-y-8 animate-fade-up animation-delay-200">
            {/* Terminal-style email block */}
            {email && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  Email
                </h3>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/20 hover:bg-muted transition-all duration-300"
                >
                  <span className="text-primary font-bold font-mono">{'>'}</span>
                  <span className="text-foreground group-hover:text-primary transition-colors font-mono">
                    {email}
                  </span>
                </a>
              </div>
            )}

            {/* Social links */}
            {socials.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  Connect
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {socials.map((social) => {
                    const Icon = SOCIAL_ICONS[social.name];
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        {Icon && <Icon weight="bold" className="size-4" />}
                        {social.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Contact form */}
          <div className="animate-fade-up animation-delay-300">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  <span className="text-primary font-mono">{'>'}</span> Name
                </label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register('name')}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  <span className="text-primary font-mono">{'>'}</span> Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Message field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  <span className="text-primary font-mono">{'>'}</span> Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or just say hi..."
                  rows={5}
                  {...register('message')}
                  aria-invalid={errors.message ? 'true' : 'false'}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.message.message}</p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                disabled={submitStatus === 'submitting'}
                className="w-full"
              >
                {submitStatus === 'submitting' ? (
                  <>
                    <Spinner weight="bold" className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle weight="bold" className="size-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <PaperPlaneRight weight="bold" className="size-4" />
                    Send Message
                  </>
                )}
              </Button>

              {/* Status messages */}
              {submitStatus === 'success' && (
                <p className="text-sm text-primary text-center">
                  Thanks! I'll get back to you soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-sm text-destructive text-center">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
