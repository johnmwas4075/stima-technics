 'use client'
import { PageHero, SectionHeading, ServiceCard, SiteFooter, SiteHeader } from '@/components/site'
import { services } from '@/lib/site-data'
import { useSiteContent } from '@/components/content-provider'

export default function Services() {
  const content = useSiteContent()
  const saved = content.serviceItems as { id: string; title: string; short: string; description: string; image: string }[] | undefined
  const liveServices = saved ? saved.flatMap((item) => { const base = services.find((service) => service.slug === item.id); return base ? [{ ...base, ...item, slug: item.id }] : [] }) : services
  return <><SiteHeader /><main>
    <PageHero eyebrow="Our services" title="Systems designed to perform." text="From first fix to ongoing maintenance, we bring one accountable technical partner to your project." image="https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=2200&q=85" />
    <section className="section services-section"><div className="shell"><SectionHeading eyebrow="Engineering & technical" title="A complete electrical partner" text="Explore the services we provide to keep buildings, facilities, and operations safe, efficient, and resilient." /><div className="service-grid">{liveServices.map((service) => <ServiceCard key={service.slug} service={{ ...service, icon: undefined as never }} />)}</div></div></section>
  </main><SiteFooter /></>
}
