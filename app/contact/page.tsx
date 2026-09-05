import { Mail, MapPin, Phone } from 'lucide-react'
import { ContactForm } from '@/components/forms'
import { PageHero, SiteFooter, SiteHeader } from '@/components/site'

export default function Contact() {
  return <><SiteHeader /><main>
    <PageHero eyebrow="Contact us" title="Let’s talk about your project." text="Tell us what you are planning, improving, or maintaining. Our team will point you in the right direction." image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85" />
    <section className="content-section"><div className="shell form-layout"><div><p className="eyebrow">Get in touch</p><h2 style={{ fontSize: '2.8rem', lineHeight: 1.05, letterSpacing: '-.05em', color: 'var(--navy)' }}>A technical conversation starts here.</h2><div className="contact-details" style={{ marginTop: 40 }}><div className="contact-detail"><Phone size={20} /><div><strong>Phone</strong><span>+254 700 000 000</span></div></div><div className="contact-detail"><Mail size={20} /><div><strong>Email</strong><span>hello@stimatechnics.co.ke</span></div></div><div className="contact-detail"><MapPin size={20} /><div><strong>Office</strong><span>Thika, Kenya</span></div></div><div className="contact-detail"><div style={{ width: 20 }} /><div><strong>Business hours</strong><span>Monday - Friday, 8:00am - 5:00pm</span></div></div></div></div><ContactForm /></div></section>
  </main><SiteFooter /></>
}
