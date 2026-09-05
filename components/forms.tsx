'use client'

import { useState } from 'react'
import { services } from '@/lib/site-data'

function FormSuccess({ children }: { children: React.ReactNode }) {
  return <p className="form-success" role="status">{children}</p>
}

export function RequestQuoteForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <div className="form-card"><FormSuccess>Thank you. We have received your project brief and will be in touch soon.</FormSuccess></div>
  }

  return (
    <form className="form-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
      <div className="form-grid">
        <div className="field"><label htmlFor="quote-name">Full name</label><input id="quote-name" name="name" required /></div>
        <div className="field"><label htmlFor="quote-company">Company</label><input id="quote-company" name="company" /></div>
        <div className="field"><label htmlFor="quote-email">Email address</label><input id="quote-email" name="email" type="email" required /></div>
        <div className="field"><label htmlFor="quote-phone">Phone number</label><input id="quote-phone" name="phone" type="tel" required /></div>
        <div className="field"><label htmlFor="quote-service">Service required</label><select id="quote-service" name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}</select></div>
        <div className="field"><label htmlFor="quote-location">Project location</label><input id="quote-location" name="location" required /></div>
        <div className="field full"><label htmlFor="quote-type">Project type</label><select id="quote-type" name="projectType" required defaultValue=""><option value="" disabled>Select project type</option><option>New build</option><option>Renovation or fit-out</option><option>Maintenance</option><option>Consultation</option><option>Other</option></select></div>
        <div className="field full"><label htmlFor="quote-message">Tell us about the project</label><textarea id="quote-message" name="message" required /></div>
      </div>
      <button className="button button-primary form-submit" type="submit">Send project brief</button>
    </form>
  )
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return <div className="form-card"><FormSuccess>Thank you. Your message has been received and our team will respond soon.</FormSuccess></div>
  }

  return (
    <form className="form-card" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
      <div className="form-grid">
        <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" required /></div>
        <div className="field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" required /></div>
        <div className="field full"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" required /></div>
      </div>
      <button className="button button-primary form-submit" type="submit">Send message</button>
    </form>
  )
}

export const ProjectForm = RequestQuoteForm
