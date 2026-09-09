'use client'

import { useEffect, useState } from 'react'
import { accreditations, coreValues, markets, principles, services, stats, testimonials } from '@/lib/site-data'

type Tab = 'home' | 'about' | 'services' | 'careers' | 'applications' | 'contact' | 'messages' | 'quotes' | 'media'
type ServiceDraft = { id: string; title: string; short: string; description: string; image: string; sections: Record<string, boolean> }
type Position = { id: number; title: string; responsibilities: string; closesOn: string; postedOn: string }

const tabs: { id: Tab; label: string; hint: string }[] = [
  { id: 'home', label: 'Home', hint: 'Homepage content' },
  { id: 'about', label: 'About', hint: 'Company information' },
  { id: 'services', label: 'Services', hint: 'Cards and details' },
  { id: 'careers', label: 'Careers', hint: 'Open positions' },
  { id: 'applications', label: 'Received applications', hint: 'Candidates and CVs' },
  { id: 'contact', label: 'Contact', hint: 'Contact details' },
  { id: 'messages', label: 'Messages', hint: 'Contact enquiries' },
  { id: 'quotes', label: 'Request a quote', hint: 'Project briefs' },
  { id: 'media', label: 'Media library', hint: 'Cloudinary images' },
]

const initialServices: ServiceDraft[] = services.map((service) => ({
  id: service.slug, title: service.title, short: service.short, description: service.description, image: service.image,
  sections: { 'Scope of services': true, 'Key capabilities': true, 'Why it matters': true, 'Where it fits': true, 'Industries served': true },
}))

function Field({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <label className="admin-field"><span>{label}</span>{type === 'textarea' ? <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /> : <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />}</label>
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('home')
  const [saved, setSaved] = useState(false)
  const [homeSummary, setHomeSummary] = useState('Stima Technics is a Kenya-based electrical contracting and engineering company headquartered in Thika. We serve commercial, industrial, institutional, and construction clients with technical depth, disciplined delivery, and a long-term view.')
  const [statValues, setStatValues] = useState(stats.map(([number, label]) => ({ number, label })))
  const [featuredServices, setFeaturedServices] = useState(services.filter((service) => service.slug !== 'hvac').slice(0, 3).map((service) => service.slug))
  const [accreditationItems, setAccreditationItems] = useState(accreditations.map((name) => ({ name, image: '' })))
  const [testimonialItems, setTestimonialItems] = useState(testimonials.map((item) => ({ ...item })))
  const [history, setHistory] = useState('Stima Technics began with a simple belief: electrical work should be delivered with the same care as the structure it powers. From our headquarters in Thika, we have grown by supporting project teams with practical engineering, clean installation, and responsive aftercare.')
  const [mission, setMission] = useState('To deliver safe, high-quality electrical and technical solutions that help our clients operate with confidence.')
  const [vision, setVision] = useState('To become one of East Africa’s most trusted engineering contractors through capability, integrity, and consistent delivery.')
  const [whyWork, setWhyWork] = useState(principles.map((item) => ({ ...item })))
  const [values, setValues] = useState(coreValues.map((title) => ({ title, explanation: '' })))
  const [marketItems, setMarketItems] = useState(markets)
  const [serviceItems, setServiceItems] = useState(initialServices)
  const [selectedService, setSelectedService] = useState(initialServices[0].id)
  const [positions, setPositions] = useState<Position[]>([])
  const [contact, setContact] = useState({ phone: '+254 700 000 000', email: 'hello@stimatechnics.co.ke', office: 'Thika, Kenya', hours: 'Monday - Friday, 8:00am - 5:00pm' })
  const [messages, setMessages] = useState<{ name: string; email: string; message: string; receivedAt: string }[]>([])
  const [quotes, setQuotes] = useState<{ name: string; email: string; service: string; receivedAt: string }[]>([])
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null)

  useEffect(() => {
    const draft = JSON.parse(window.localStorage.getItem('stima-admin-draft') || 'null')
    if (draft) {
      if (draft.homeSummary) setHomeSummary(draft.homeSummary)
      if (draft.statValues) setStatValues(draft.statValues)
      if (draft.featuredServices) setFeaturedServices(draft.featuredServices)
      if (draft.accreditationItems) setAccreditationItems(draft.accreditationItems)
      if (draft.testimonialItems) setTestimonialItems(draft.testimonialItems)
      if (draft.history) setHistory(draft.history)
      if (draft.mission) setMission(draft.mission)
      if (draft.vision) setVision(draft.vision)
      if (draft.whyWork) setWhyWork(draft.whyWork)
      if (draft.values) setValues(draft.values)
      if (draft.marketItems) setMarketItems(draft.marketItems)
      if (draft.serviceItems) setServiceItems(draft.serviceItems)
      if (draft.positions) setPositions(draft.positions)
      if (draft.contact) setContact(draft.contact)
    }
    const storedMessages = window.localStorage.getItem('stima-contact-messages')
    const storedQuotes = window.localStorage.getItem('stima-quote-requests')
    if (storedMessages) setMessages(JSON.parse(storedMessages))
    if (storedQuotes) setQuotes(JSON.parse(storedQuotes))
  }, [])

  const save = () => {
    window.localStorage.setItem('stima-admin-draft', JSON.stringify({ homeSummary, statValues, featuredServices, accreditationItems, testimonialItems, history, mission, vision, whyWork, values, marketItems, serviceItems, positions, contact }))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }
  const currentService = serviceItems.find((service) => service.id === selectedService) ?? serviceItems[0]
  const updateService = (key: keyof ServiceDraft, value: string) => setServiceItems((items) => items.map((service) => service.id === selectedService ? { ...service, [key]: value } : service))
  const addService = () => { const id = `service-${Date.now()}`; setServiceItems((items) => [...items, { id, title: 'New service', short: '', description: '', image: '', sections: { 'Scope of services': true, 'Key capabilities': true, 'Why it matters': true, 'Where it fits': true, 'Industries served': true } }]); setSelectedService(id) }
  const addPosition = () => setPositions((items) => [...items, { id: Date.now(), title: 'New position', responsibilities: '', closesOn: '', postedOn: new Date().toISOString().slice(0, 10) }])

  return <main className="admin-page"><aside className="admin-sidebar"><a className="admin-brand" href="/"><strong>STIMA</strong><span>ADMIN PANEL</span></a><nav>{tabs.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><strong>{item.label}</strong><small>{item.hint}</small></button>)}</nav><a className="admin-view-site" href="/" target="_blank" rel="noreferrer">View public website ↗</a></aside>
    <section className="admin-content"><header className="admin-topbar"><div><p className="eyebrow">Content management</p><h1>{tabs.find((item) => item.id === tab)?.label}</h1></div><button className="admin-save" onClick={save}>{saved ? 'Saved locally' : 'Save changes'}</button></header>

      {tab === 'home' && <div className="admin-stack"><AdminCard title="About us summary" description="The introduction shown on the homepage."><Field label="Summary" type="textarea" value={homeSummary} onChange={setHomeSummary} /></AdminCard><AdminCard title="Company statistics" description="Update the figures that appear below the homepage introduction."><div className="admin-grid three">{statValues.map((stat, index) => <Field key={stat.label} label={stat.label} value={stat.number} onChange={(number) => setStatValues((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, number } : item))} />)}</div></AdminCard><AdminCard title="Featured services" description="Choose up to three services for the homepage."><div className="admin-check-list">{serviceItems.map((service) => <label key={service.id}><input type="checkbox" checked={featuredServices.includes(service.id)} onChange={() => setFeaturedServices((items) => items.includes(service.id) ? items.filter((id) => id !== service.id) : items.length < 3 ? [...items, service.id] : items)} />{service.title}</label>)}</div><small className="admin-note">{featuredServices.length}/3 services selected</small></AdminCard><AdminCard title="Accreditations" description="Add the accreditation name and its logo image URL."><Repeater items={accreditationItems} addLabel="Add accreditation" onAdd={() => setAccreditationItems((items) => [...items, { name: '', image: '' }])} onRemove={(index) => setAccreditationItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(item, index) => <div className="admin-grid two"><Field label="Name" value={item.name} onChange={(name) => setAccreditationItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, name } : entry))} /><Field label="Logo image URL" value={item.image} onChange={(image) => setAccreditationItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, image } : entry))} /></div>} /></AdminCard><AdminCard title="Testimonials" description="Edit the client testimonials displayed on the homepage."><Repeater items={testimonialItems} addLabel="Add testimonial" onAdd={() => setTestimonialItems((items) => [...items, { name: '', role: '', quote: '', image: '' }])} onRemove={(index) => setTestimonialItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(item, index) => <div className="admin-grid two"><Field label="Client name" value={item.name} onChange={(name) => setTestimonialItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, name } : entry))} /><Field label="Role / company" value={item.role} onChange={(role) => setTestimonialItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, role } : entry))} /><Field label="Quote" type="textarea" value={item.quote} onChange={(quote) => setTestimonialItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, quote } : entry))} /><Field label="Photo URL" value={item.image} onChange={(image) => setTestimonialItems((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, image } : entry))} /></div>} /></AdminCard></div>}

      {tab === 'about' && <div className="admin-stack"><AdminCard title="Our history"><Field label="History story" type="textarea" value={history} onChange={setHistory} /></AdminCard><AdminCard title="Mission and vision"><div className="admin-grid two"><Field label="Mission" type="textarea" value={mission} onChange={setMission} /><Field label="Vision" type="textarea" value={vision} onChange={setVision} /></div></AdminCard><AdminCard title="Why work with us"><Repeater items={whyWork} addLabel="Add reason" onAdd={() => setWhyWork((items) => [...items, { title: '', text: '' }])} onRemove={(index) => setWhyWork((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(item, index) => <div className="admin-grid two"><Field label="Title" value={item.title} onChange={(title) => setWhyWork((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, title } : entry))} /><Field label="Explanation" type="textarea" value={item.text} onChange={(text) => setWhyWork((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, text } : entry))} /></div>} /></AdminCard><AdminCard title="Core values"><Repeater items={values} addLabel="Add core value" onAdd={() => setValues((items) => [...items, { title: '', explanation: '' }])} onRemove={(index) => setValues((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(item, index) => <div className="admin-grid two"><Field label="Value" value={item.title} onChange={(title) => setValues((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, title } : entry))} /><Field label="Explanation" type="textarea" value={item.explanation} onChange={(explanation) => setValues((items) => items.map((entry, entryIndex) => entryIndex === index ? { ...entry, explanation } : entry))} /></div>} /></AdminCard><AdminCard title="Markets we serve"><Repeater items={marketItems} addLabel="Add market" onAdd={() => setMarketItems((items) => [...items, ''])} onRemove={(index) => setMarketItems((items) => items.filter((_, itemIndex) => itemIndex !== index))} render={(item, index) => <Field label="Market" value={item} onChange={(value) => setMarketItems((items) => items.map((entry, itemIndex) => itemIndex === index ? value : entry))} />} /></AdminCard></div>}

      {tab === 'services' && <div className="admin-stack"><AdminCard title="Service cards" description="Add, remove, or select a service to edit its card and detail page."><div className="service-admin-layout"><div className="service-admin-list">{serviceItems.map((service) => <button key={service.id} className={selectedService === service.id ? 'active' : ''} onClick={() => setSelectedService(service.id)}>{service.title || 'Untitled service'}</button>)}<button className="admin-add" onClick={addService}>+ Add service</button></div><div className="service-admin-editor"><div className="admin-grid two"><Field label="Service title" value={currentService.title} onChange={(value) => updateService('title', value)} /><Field label="Card image URL" value={currentService.image} onChange={(value) => updateService('image', value)} /></div><Field label="Card summary" type="textarea" value={currentService.short} onChange={(value) => updateService('short', value)} /><Field label="Service detail introduction" type="textarea" value={currentService.description} onChange={(value) => updateService('description', value)} /><p className="admin-label">Detail-page sections</p><div className="admin-toggle-list">{Object.entries(currentService.sections).map(([label, enabled]) => <label key={label}><span>{label}</span><input type="checkbox" checked={enabled} onChange={() => setServiceItems((items) => items.map((service) => service.id === selectedService ? { ...service, sections: { ...service.sections, [label]: !enabled } } : service))} /></label>)}</div><p className="admin-note">Turn a section on to show and edit its content on this service&apos;s individual detail page.</p></div></div></AdminCard></div>}

      {tab === 'careers' && <div className="admin-stack"><AdminCard title="Open positions" description="Add a role, its key responsibilities, publish date, and closing date."><button className="admin-add" onClick={addPosition}>+ Add open position</button><div className="admin-stack compact">{positions.length === 0 && <p className="admin-empty">No positions have been added yet.</p>}{positions.map((position) => <div className="admin-repeater" key={position.id}><div className="admin-grid two"><Field label="Position title" value={position.title} onChange={(title) => setPositions((items) => items.map((item) => item.id === position.id ? { ...item, title } : item))} /><Field label="Posted on" type="date" value={position.postedOn} onChange={(postedOn) => setPositions((items) => items.map((item) => item.id === position.id ? { ...item, postedOn } : item))} /><Field label="Key responsibilities" type="textarea" value={position.responsibilities} onChange={(responsibilities) => setPositions((items) => items.map((item) => item.id === position.id ? { ...item, responsibilities } : item))} /><Field label="Apply before / closing date" type="date" value={position.closesOn} onChange={(closesOn) => setPositions((items) => items.map((item) => item.id === position.id ? { ...item, closesOn } : item))} /></div><button className="admin-remove" onClick={() => setPositions((items) => items.filter((item) => item.id !== position.id))}>Remove position</button></div>)}</div></AdminCard></div>}

      {tab === 'applications' && <div className="admin-stack"><AdminCard title="Received applications" description="Applications are ordered by when the job was first posted.">{positions.length === 0 ? <p className="admin-empty">There are no job posts or received applications yet.</p> : <div className="application-list">{[...positions].sort((a, b) => a.postedOn.localeCompare(b.postedOn)).map((position) => <div key={position.id} className="application-role"><button onClick={() => setExpandedPosition(expandedPosition === position.id ? null : position.id)}><span><strong>{position.title}</strong><small>Posted {position.postedOn || '—'} · Closes {position.closesOn || '—'}</small></span><span>{expandedPosition === position.id ? '−' : '+'}</span></button>{expandedPosition === position.id && <div className="application-candidates"><p>No applications have been received for this position yet.</p><p className="admin-note">When applications arrive, each candidate’s name, submission date, and CV download link will appear here.</p></div>}</div>)}</div>}</AdminCard></div>}

      {tab === 'contact' && <div className="admin-stack"><AdminCard title="Contact page details"><div className="admin-grid two"><Field label="Phone" value={contact.phone} onChange={(phone) => setContact({ ...contact, phone })} /><Field label="Email" type="email" value={contact.email} onChange={(email) => setContact({ ...contact, email })} /><Field label="Office" value={contact.office} onChange={(office) => setContact({ ...contact, office })} /><Field label="Working hours" value={contact.hours} onChange={(hours) => setContact({ ...contact, hours })} /></div></AdminCard></div>}

      {tab === 'messages' && <InboxCard title="Contact messages" items={messages} empty="No contact messages have been received yet." fields={['name', 'email', 'message', 'receivedAt']} />}
      {tab === 'quotes' && <InboxCard title="Quote requests" items={quotes} empty="No quote requests have been received yet." fields={['name', 'email', 'service', 'receivedAt']} />}
      {tab === 'media' && <CloudinaryMediaLibrary />}
    </section>
  </main>
}

function AdminCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) { return <section className="admin-card"><div className="admin-card-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</section> }
function Repeater<T>({ items, render, onAdd, onRemove, addLabel }: { items: T[]; render: (item: T, index: number) => React.ReactNode; onAdd: () => void; onRemove: (index: number) => void; addLabel: string }) { return <div className="admin-stack compact">{items.map((item, index) => <div className="admin-repeater" key={index}>{render(item, index)}<button className="admin-remove" onClick={() => onRemove(index)}>Remove</button></div>)}<button className="admin-add" onClick={onAdd}>+ {addLabel}</button></div> }
function InboxCard({ title, items, empty, fields }: { title: string; items: Record<string, string>[]; empty: string; fields: string[] }) { return <div className="admin-stack"><AdminCard title={title}>{items.length === 0 ? <p className="admin-empty">{empty}</p> : <div className="admin-inbox">{items.map((item, index) => <article key={index}>{fields.map((field) => item[field] && <p key={field}><strong>{field.replace(/([A-Z])/g, ' $1')}:</strong> {item[field]}</p>)}</article>)}</div>}</AdminCard></div> }

type CloudinaryImage = { publicId: string; url: string; width: number; height: number; createdAt: string }
function CloudinaryMediaLibrary() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [replacePublicId, setReplacePublicId] = useState('')

  const load = async () => { setLoading(true); const response = await fetch('/api/cloudinary/images'); const data = await response.json(); setLoading(false); if (!response.ok) setMessage(data.error || 'Unable to load images.'); else { setImages(data.images); setMessage('') } }
  useEffect(() => { load() }, [])
  const upload = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (!form.get('file')) return; if (replacePublicId) form.set('replacePublicId', replacePublicId); setUploading(true); const response = await fetch('/api/cloudinary/images', { method: 'POST', body: form }); const data = await response.json(); setUploading(false); if (!response.ok) setMessage(data.error || 'Upload failed.'); else { setReplacePublicId(''); event.currentTarget.reset(); await load() } }
  const remove = async (publicId: string) => { if (!window.confirm(`Delete ${publicId} from Cloudinary?`)) return; const response = await fetch('/api/cloudinary/images', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId }) }); const data = await response.json(); if (!response.ok) setMessage(data.error || 'Delete failed.'); else await load() }

  return <div className="admin-stack"><AdminCard title="Cloudinary media library" description="Upload, replace, and delete images in Cloudinary’s stima_technics folder."><form className="cloudinary-upload" onSubmit={upload}><label className="admin-field"><span>Image file</span><input name="file" type="file" accept="image/*" required /></label><Field label="Replace existing public ID (optional)" value={replacePublicId} placeholder="stima_technics/example-image" onChange={setReplacePublicId} /><button className="admin-save" type="submit" disabled={uploading}>{uploading ? 'Uploading…' : replacePublicId ? 'Replace image' : 'Upload image'}</button></form>{message && <p className="admin-error">{message}</p>}<p className="admin-note">Use “Replace image” with an existing public ID to update an image while retaining its Cloudinary URL. Copy an image URL into an image field elsewhere in the admin panel.</p></AdminCard><AdminCard title="Stored images">{loading ? <p className="admin-empty">Loading Cloudinary images…</p> : images.length === 0 ? <p className="admin-empty">No images found in stima_technics.</p> : <div className="cloudinary-grid">{images.map((image) => <article key={image.publicId}><img src={image.url} alt="" /><div><strong>{image.publicId.replace('stima_technics/', '')}</strong><small>{image.width} × {image.height}</small><button onClick={() => navigator.clipboard.writeText(image.url)}>Copy URL</button><button className="cloudinary-delete" onClick={() => remove(image.publicId)}>Delete</button></div></article>)}</div>}</AdminCard></div>
}
