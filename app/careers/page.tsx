 'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero, SiteFooter, SiteHeader, SectionHeading } from '@/components/site'
import { useSiteContent } from '@/components/content-provider'
import { JobApplicationForm } from '@/components/forms'
import { useEffect, useState } from 'react'
export default function Careers(){
    const [positions, setPositions] = useState<{ id: string; title: string; responsibilities: string; closesOn: string | null }[]>([])
    useEffect(() => { fetch('/api/jobs').then((response) => response.ok ? response.json() : null).then((result) => result && setPositions(result.positions)).catch(() => undefined) }, [])
    return <>
    <SiteHeader/>
    <main>
        <PageHero eyebrow="Careers at Stima" title="Bring your expertise to work that matters." text="We welcome skilled professionals, technicians, engineers, and talented individuals who care about the quality of the work." image="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2200&q=85" />
        <section className="section">
            <div className="shell">
                <SectionHeading eyebrow="Why Stima" title="A place to build a career, not just a CV."/>
                <div className="career-grid">
                    <div className="career-card">
                        <h3>Why work with us</h3>
                        <p>Work alongside experienced people on meaningful projects that power businesses and communities.</p>
                    </div>
                    <div className="career-card">
                        <h3>Company culture</h3>
                        <p>We value direct communication, mutual respect, ownership, and doing the right thing when it counts.</p>
                    </div>
                    <div className="career-card">
                        <h3>Professional development</h3>
                        <p>We invest in learning, site exposure, mentorship, and the practical growth of our teams.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="content-section" style={{background:'white'}}>
            <div className="shell">
                <SectionHeading eyebrow="Current opportunities" title="Open roles" text="We will post active opportunities here as they become available."/>
                {positions.length === 0 ? <div className="vacancy-empty">
                    <strong>No current vacancies</strong>
                    <p>There are no open positions at the moment, but we are always interested in meeting excellent people.</p>
                </div> : <div className="career-grid">{positions.map((position) => <article className="career-card" key={position.id}><h3>{position.title}</h3><p>{position.responsibilities}</p><p><strong>Apply before: </strong>{position.closesOn ? new Date(position.closesOn).toLocaleDateString() : 'Contact us'}</p></article>)}</div>}
                <div style={{marginTop:70}}>
                    <SectionHeading eyebrow="General application" title="Keep us in mind." text="Send us your details and a short note about the kind of work you do. We will keep your application on file for relevant future opportunities."/>
                    {positions.length > 0 ? <JobApplicationForm positions={positions} /> : <Link href="mailto:careers@stimatechnics.co.ke" className="button button-primary">Send a general application <ArrowRight size={16}/></Link>}
                </div>
            </div>
        </section>
    </main>
    <SiteFooter/>
</>}
