'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Cable,
  Camera,
  Fan,
  Gauge,
  Hammer,
  ShieldCheck,
  Sun,
  Wrench,
} from 'lucide-react'
import { logoUrl, nav, heroSlides, type Service, type Testimonial } from '@/lib/site-data'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="Stima Technics home">
          <Image src={logoUrl} alt="Stima Technics logo" width={58} height={58} unoptimized />
          <span>
            <strong>STIMA</strong>
            <small>TECHNICS</small>
          </span>
        </Link>
        <nav className="desktop-nav">
          {nav.map((item) => (
            <div className="nav-item" key={item.label}>
              {item.children ? (
                <button onClick={() => setOpen(!open)} aria-expanded={open}>
                  {item.label}
                  <ChevronDown size={15} />
                </button>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {item.children && open && (
                <div className="dropdown">
                  {item.children.map((child) => (
                    <Link href="/about" key={child}>
                      {child}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link className="quote-button" href="/request-quote">
            Request a quote <ArrowRight size={15} />
          </Link>
        </nav>
        <button className="mobile-toggle" onClick={() => setMobile(!mobile)} aria-label="Toggle navigation">
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
      {mobile && (
        <nav className="mobile-nav">
          {nav.map((item) => (
            <Link onClick={() => setMobile(false)} href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
          <Link className="quote-button" href="/request-quote">
            Request a quote <ArrowRight size={15} />
          </Link>
        </nav>
      )}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <Image src={logoUrl} alt="Stima Technics logo" width={54} height={54} unoptimized />
            <span>
              <strong>STIMA</strong>
              <small>TECHNICS</small>
            </span>
          </Link>
          <p>Dependable electrical contracting and engineering solutions for Kenya's most demanding projects.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/about">About us</Link>
          <Link href="/services">Services</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <p className="footer-label">Get in touch</p>
          <span>
            <MapPin size={15} />
            Thika, Kenya
          </span>
          <span>
            <Phone size={15} />
            +254 700 000 000
          </span>
          <span>
            <Mail size={15} />
            hello@stimatechnics.co.ke
          </span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Stima Technics. All rights reserved.</span>
        <span>Electrical engineering, delivered with confidence.</span>
      </div>
    </footer>
  )
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % heroSlides.length), 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = heroSlides[index]

  return (
    <section className="hero hero-compact">
      <div className="hero-image" style={{ backgroundImage: `url(${slide.image})` }} />
      <div className="hero-overlay" />
      <div className="shell hero-content">
        <p className="eyebrow hero-eyebrow">{slide.eyebrow}</p>
        <h1>{slide.title}</h1>
        <p className="hero-text">{slide.text}</p>
        <div className="hero-actions">
          <Link href="/services" className="button button-primary">
            Explore our services <ArrowRight size={17} />
          </Link>
          <Link href="/request-quote" className="button button-outline">
            Request a quote
          </Link>
        </div>
        <div className="hero-controls">
          <div className="slide-dots">
            {heroSlides.map((_, dot) => (
              <button
                key={dot}
                aria-label={`Go to slide ${dot + 1}`}
                className={dot === index ? 'active' : ''}
                onClick={() => setIndex(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const serviceIcons = {
  'electrical-wiring-installation': Cable,
  hvac: Fan,
  'cctv-installation': Camera,
  'lifts-escalators': Gauge,
  'solar-design-installation': Sun,
  'generator-installation-maintenance': Wrench,
  'electrical-maintenance': Wrench,
  'electric-systems-alarms': ShieldCheck,
  'electrical-supplies-installation': Hammer,
}

export function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const Icon = serviceIcons[service.slug as keyof typeof serviceIcons] || Cable

  return (
    <article className={`service-card ${featured ? 'featured' : ''}`}>
      <div className="service-image">
        <Image src={service.image} alt={service.title} fill sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
        <div className="service-icon">
          <Icon size={21} />
        </div>
      </div>
      <div className="service-card-body">
        <p className="card-kicker">Technical service</p>
        <h3>{service.title}</h3>
        <p>{service.short}</p>
        <Link href={`/services/${service.slug}`} className="text-link">
          Learn more <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  )
}

export function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string
  title: string
  text?: string
  image?: string
}) {
  return (
    <section className={`page-hero ${image ? 'page-hero-media' : ''}`}>
      {image && (
        <div className="page-hero-media-layer" aria-hidden="true">
          <Image src={image} alt="" fill unoptimized className="page-hero-image" />
          <div className="page-hero-overlay" />
        </div>
      )}
      <div className="shell page-hero-content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-card-image">
        <Image src={testimonial.image} alt={testimonial.name} width={88} height={88} unoptimized />
      </div>
      <p className="testimonial-card-quote">{testimonial.quote}</p>
      <div className="testimonial-card-meta">
        <strong>{testimonial.name}</strong>
        <span>{testimonial.role}</span>
      </div>
    </article>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left',
}: {
  eyebrow: string
  title: string
  text?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={`section-heading ${align === 'center' ? 'center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>
}
