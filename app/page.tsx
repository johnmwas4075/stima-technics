import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HeroCarousel,
  SectionHeading,
  ServiceCard,
  SiteFooter,
  SiteHeader,
  Reveal,
  TestimonialCard,
} from "@/components/site";
import { logoUrl, services, stats, testimonials } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroCarousel />
        <section className="section">
          <div className="shell split">
            <Reveal>
              <div className="image-frame">
                <Image
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=85"
                  alt="Engineer reviewing electrical plans on site"
                  fill
                  unoptimized
                />
              </div>
            </Reveal>
            <Reveal className="about-copy">
              <p className="eyebrow">About Stima Technics</p>
              <h2>Engineering solutions built around reliability.</h2>
              <p>
                Stima Technics is a Kenya-based electrical contracting and
                engineering company headquartered in Thika. We serve commercial,
                industrial, institutional, and construction clients with
                technical depth, disciplined delivery, and a long-term view.
              </p>
              <Link href="/about" className="text-link">
                Learn more about us <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </section>
        <section className="stats">
          <div className="shell stats-grid">
            {stats.map(([number, label]) => (
              <div className="stat" key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="section services-section">
          <div className="shell">
            <SectionHeading
              eyebrow="What we do"
              title="Our engineering & technical services"
              text="Focused expertise for the systems that keep your project moving."
            />
            <div className="service-grid">
              {services.slice(0, 4).map((service) => (
                <ServiceCard
                  key={service.slug}
                  service={{ ...service, icon: undefined as never }}
                  featured
                />
              ))}
            </div>
            <div className="view-all">
              <Link href="/services" className="text-link">
                View all services <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section testimonial">
          <div className="shell">
            <SectionHeading
              eyebrow="Client voices"
              title="Trusted by teams who need the work to hold up."
              text="A few words from clients who have worked with Stima Technics."
              center
            />
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="cta-band">
          <div className="shell cta-inner">
            <div>
              <p className="eyebrow" style={{ color: "#8bd0ff" }}>
                Start a conversation
              </p>
              <h2>Let’s make your next project work better.</h2>
            </div>
            <Link href="/request-quote" className="button button-outline">
              Request a quote <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
