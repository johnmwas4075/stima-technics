import { RequestQuoteForm } from '@/components/forms'
import { PageHero, SiteFooter, SiteHeader } from '@/components/site'

export default function RequestQuote() {
  return <><SiteHeader /><main>
    <PageHero eyebrow="Request a quote" title="Give us the brief. We’ll bring the clarity." text="Share the essentials of your project and our team will follow up with the right questions, scope, and next steps." image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2200&q=85" />
    <section className="content-section"><div className="shell form-layout"><div><p className="eyebrow">Your project</p><h2 style={{ fontSize: '2.8rem', lineHeight: 1.05, letterSpacing: '-.05em', color: 'var(--navy)' }}>Good decisions start with good information.</h2><p className="prose-copy" style={{ fontSize: '1rem', marginTop: 20 }}>Whether you need an installation partner, a maintenance plan, or a second opinion on a technical scope, tell us what you know. We’ll help shape what comes next.</p></div><RequestQuoteForm /></div></section>
  </main><SiteFooter /></>
}
