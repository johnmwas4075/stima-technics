"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroCarousel, SectionHeading, ServiceCard, SiteFooter, SiteHeader, Reveal, TestimonialCard } from "@/components/site";
import { accreditations, services, stats, testimonials } from "@/lib/site-data";
import { useSiteContent } from '@/components/content-provider'

export default function Home() {
  const content = useSiteContent()
  const liveServices = services.map((service) => ({ ...service, ...((content.serviceItems as { id: string }[] | undefined)?.find((item) => item.id === service.slug) ?? {}) }))
  const featuredServices = liveServices.filter((service) => ((content.featuredServices as string[] | undefined) ?? liveServices.filter((item) => item.slug !== 'hvac').slice(0, 3).map((item) => item.slug)).includes(service.slug))
  const liveStats: { number: string; label: string }[] = (content.statValues as { number: string; label: string }[] | undefined) ?? stats.map(([number, label]) => ({ number, label }))
  const liveAccreditations = ((content.accreditationItems as { name: string }[] | undefined)?.map((item) => item.name).filter(Boolean)) ?? accreditations
  const liveTestimonials = (content.testimonialItems as typeof testimonials | undefined) ?? testimonials

  return <><SiteHeader /><main>
    <HeroCarousel />
    <section className="section"><div className="shell split">
      <Reveal><div className="image-frame"><Image src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85" alt="Engineer reviewing electrical plans on site" fill unoptimized /></div></Reveal>
      <Reveal className="about-copy"><p className="eyebrow">About Stima Technics</p><h2>Engineering solutions built around reliability.</h2><p>{(content.homeSummary as string | undefined) ?? 'Stima Technics is a Kenya-based electrical contracting and engineering company headquartered in Thika. We serve commercial, industrial, institutional, and construction clients with technical depth, disciplined delivery, and a long-term view.'}</p><Link href="/about" className="text-link">Learn more about us <ArrowRight size={15} /></Link></Reveal>
    </div></section>
    <section className="stats"><div className="shell stats-grid">{liveStats.map(({ number, label }) => <div className="stat" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></section>
    <section className="section services-section"><div className="shell">
      <SectionHeading eyebrow="What we do" title="Our engineering & technical services" text="Focused expertise for the systems that keep your project moving." />
      <div className="service-grid">{featuredServices.map((service) => <ServiceCard key={service.slug} service={{ ...service, icon: undefined as never }} featured />)}</div>
      <div className="view-all"><Link href="/services" className="text-link">View all services <ArrowRight size={15} /></Link></div>
    </div></section>
    <section className="accreditations-section"><div className="shell">
      <SectionHeading eyebrow="Accredited by" title="Standards that support dependable delivery." text="Our work is shaped by the professional and regulatory standards that matter to our clients." align="center" />
      <div className="accreditation-grid">{liveAccreditations.map((accreditation) => <div className="accreditation-badge" key={accreditation}>{accreditation}</div>)}</div>
    </div></section>
    <section className="section testimonial"><div className="shell">
      <SectionHeading eyebrow="Client voices" title="Trusted by teams who need the work to hold up." text="A few words from clients who have worked with Stima Technics." align="center" />
      <div className="testimonial-grid">{liveTestimonials.map((testimonial) => <TestimonialCard key={testimonial.name} testimonial={testimonial} />)}</div>
    </div></section>
  </main><SiteFooter /></>;
}
