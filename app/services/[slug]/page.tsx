import Image from 'next/image'
import Link from 'next/link'
import { getService, services } from '@/lib/site-data'
import { SiteFooter, SiteHeader } from '@/components/site'
import { notFound } from 'next/navigation'

export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })) }

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  const Icon = service.icon

  return <><SiteHeader /><main>
    <section className="detail-hero">
      <div className="detail-hero-image"><Image src={service.image} alt={service.title} fill unoptimized /></div>
      <div className="detail-hero-copy"><div className="breadcrumb"><Link href="/services">Services</Link><span>/</span><span>{service.title}</span></div><div className="service-icon"><Icon size={22} /></div><h1>{service.title}</h1><p>{service.description}</p><Link href="/request-quote" className="button button-primary" style={{ width: 'fit-content', marginTop: 20 }}>Request a quote</Link></div>
    </section>
    <section className="content-section"><div className="shell detail-grid"><div className="detail-block"><p className="eyebrow">Scope of services</p><h2>Delivered with care.</h2><ul className="detail-list">{service.scope.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="detail-block"><p className="eyebrow">Key capabilities</p><h2>Technical depth, made practical.</h2><ul className="detail-list">{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>
    <section className="content-section" style={{ background: 'white' }}><div className="shell detail-grid"><div className="detail-block"><p className="eyebrow">Why it matters</p><h2>Benefits for your operation.</h2><ul className="detail-list">{service.benefits.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="detail-block"><p className="eyebrow">Where it fits</p><h2>Typical applications.</h2><ul className="detail-list">{service.applications.map((item) => <li key={item}>{item}</li>)}</ul><p className="eyebrow" style={{ marginTop: 35 }}>Industries served</p><div className="tag-list">{service.industries.map((item) => <span className="tag" key={item}>{item}</span>)}</div></div></div></section>
  </main><SiteFooter /></>
}
