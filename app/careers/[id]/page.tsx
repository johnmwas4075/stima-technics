import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import { notFound } from 'next/navigation'
import { JobApplicationForm } from '@/components/forms'
import { SiteFooter, SiteHeader } from '@/components/site'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const now = new Date()
  const position = await prisma.jobPosition.findFirst({
    where: { id, isOpen: true, AND: [{ OR: [{ publishOn: null }, { publishOn: { lte: now } }] }, { OR: [{ closesOn: null }, { closesOn: { gte: now } }] }] },
    select: { id: true, title: true, responsibilities: true, qualifications: true, closesOn: true },
  })
  if (!position) notFound()

  return <><SiteHeader/><main>
    <section className="job-detail-hero"><div className="shell">
      <Link className="job-back-link" href="/careers"><ArrowLeft size={16}/> All opportunities</Link>
      <p className="eyebrow">Career opportunity</p><h1>{position.title}</h1>
      <p className="job-deadline"><CalendarDays size={17}/>{position.closesOn ? `Apply before ${position.closesOn.toLocaleDateString()}` : 'Applications are open'}</p>
      <a className="button button-primary" href="#apply">Apply for this role <ArrowRight size={16}/></a>
    </div></section>
    <section className="content-section"><div className="shell job-detail-layout">
      <div className="job-detail-copy"><section><p className="eyebrow">The role</p><h2>Responsibilities</h2><p>{position.responsibilities || 'Responsibilities will be discussed during the recruitment process.'}</p></section>
      {position.qualifications && <section><p className="eyebrow">What you bring</p><h2>Qualifications</h2><p>{position.qualifications}</p></section>}
      </div>
      <section className="job-apply-panel" id="apply"><p className="eyebrow">Apply now</p><h2>Interested in this role?</h2><p>Complete the form and upload your CV as a PDF.</p><JobApplicationForm positions={[{ id: position.id, title: position.title }]} /></section>
    </div></section>
  </main><SiteFooter/></>
}
