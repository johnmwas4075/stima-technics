 'use client'
import Image from 'next/image'
import Link from 'next/link'
import { getService, services } from '@/lib/site-data'
import { SiteFooter, SiteHeader } from '@/components/site'
import { useParams } from 'next/navigation'
import { useSiteContent } from '@/components/content-provider'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const content = useSiteContent()
  const baseService = getService(slug)
  if (!baseService) return null
  const savedService = (content.serviceItems as { id: string; sections?: Record<string, boolean | { enabled: boolean; content: string; bulleted: boolean }> }[] | undefined)?.find((item) => item.id === slug)
  const service = { ...baseService, ...(savedService ?? {}) }
  const sectionContent = (name: string, fallback: string[]) => { const section = savedService?.sections?.[name]; return typeof section === 'object' ? (section.content || '').split('\n').map((item) => item.trim()).filter(Boolean) : fallback }
  const enabled = (name: string) => { const section = savedService?.sections?.[name]; return typeof section === 'object' ? section.enabled : section !== false }
  const bulleted = (name: string) => { const section = savedService?.sections?.[name]; return typeof section === 'object' ? section.bulleted : name !== 'Industries served' }
  const renderItems = (name: string, items: string[]) => bulleted(name) ? <ul className="detail-list">{items.map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}</ul> : <p className="detail-prose">{items.join('\n')}</p>
  const Icon = service.icon

  return <><SiteHeader /><main>
    <section className="detail-hero">
      <div className="detail-hero-image"><Image src={service.image} alt={service.title} fill unoptimized /></div>
      <div className="detail-hero-copy"><div className="breadcrumb"><Link href="/services">Services</Link><span>/</span><span>{service.title}</span></div><div className="service-icon"><Icon size={22} /></div><h1>{service.title}</h1><p>{service.description}</p><Link href="/request-quote" className="button button-primary" style={{ width: 'fit-content', marginTop: 20 }}>Request a quote</Link></div>
    </section>
    {(enabled('Scope of services') || enabled('Key capabilities')) && <section className="content-section"><div className="shell detail-grid">{enabled('Scope of services') && <div className="detail-block"><p className="eyebrow">Scope of services</p><h2>Delivered with care.</h2>{renderItems('Scope of services', sectionContent('Scope of services', service.scope))}</div>}{enabled('Key capabilities') && <div className="detail-block"><p className="eyebrow">Key capabilities</p><h2>Technical depth, made practical.</h2>{renderItems('Key capabilities', sectionContent('Key capabilities', service.capabilities))}</div>}</div></section>}
    {(enabled('Why it matters') || enabled('Where it fits') || enabled('Industries served')) && <section className="content-section" style={{ background: 'white' }}><div className="shell detail-grid">{enabled('Why it matters') && <div className="detail-block"><p className="eyebrow">Why it matters</p><h2>Benefits for your operation.</h2>{renderItems('Why it matters', sectionContent('Why it matters', service.benefits))}</div>}{(enabled('Where it fits') || enabled('Industries served')) && <div className="detail-block">{enabled('Where it fits') && <><p className="eyebrow">Where it fits</p><h2>Typical applications.</h2>{renderItems('Where it fits', sectionContent('Where it fits', service.applications))}</>}{enabled('Industries served') && <><p className="eyebrow" style={{ marginTop: 35 }}>Industries served</p><div className="tag-list">{sectionContent('Industries served', service.industries).map((item, i) => <span className="tag" key={`${item}-${i}`}>{item}</span>)}</div></>}</div>}</div></section>}
  </main><SiteFooter /></>
}
