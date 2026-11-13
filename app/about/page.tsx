"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SiteFooter, SiteHeader, SectionHeading } from "@/components/site";
import { coreValues, markets, principles } from "@/lib/site-data";
import { useSiteContent } from '@/components/content-provider'

const valueExplanations = [
  "We do what we say we will do, communicate honestly, and take responsibility for every commitment we make.",
  "We listen closely, value skilled work, and create respectful partnerships with clients, colleagues, and suppliers.",
  "We keep building our technical knowledge so that every project benefits from better judgement and stronger delivery.",
  "We choose practical new ideas and technology when they create safer, more efficient, and more reliable outcomes.",
];

export default function About() {
  const [openValue, setOpenValue] = useState(0);
  const content = useSiteContent()
  const livePrinciples = (content.whyWork as typeof principles | undefined) ?? principles
  const liveValues = (content.values as { title: string; explanation: string }[] | undefined) ?? coreValues.map((title, index) => ({ title, explanation: valueExplanations[index] }))
  const liveMarkets = (content.marketItems as string[] | undefined) ?? markets

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero page-hero-media about-hero">
          <div className="page-hero-media-layer" aria-hidden="true">
            <Image
              className="page-hero-image"
              src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=2000&q=90"
              alt=""
              fill
              priority
              unoptimized
            />
            <div className="page-hero-overlay" />
          </div>
          <div className="shell page-hero-content">
            <p className="eyebrow" style={{ color: "#8bd0ff" }}>
              Who we are
            </p>
            <h1>Technical confidence, from the ground up.</h1>
            <p>
              We are a focused electrical contracting and engineering partner
              for Kenya’s built environment.
            </p>
          </div>
        </section>

        <section className="content-section" id="history">
          <div className="shell history-layout">
            <div className="history-image">
              <Image
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=85"
                alt="Electrical engineer at work"
                fill
                unoptimized
              />
            </div>
            <div className="prose-copy history-story">
              <p className="eyebrow">Our history</p>
              <h2>Built in Thika. Trusted across Kenya.</h2>
              <p>{(content.history as string | undefined) ?? 'Stima Technics began with a simple belief: electrical work should be delivered with the same care as the structure it powers. From our headquarters in Thika, we have grown by supporting project teams with practical engineering, clean installation, and responsive aftercare.'}</p>
              <p>
                Today, our people bring together field experience and modern
                technical thinking across commercial, industrial, institutional,
                and construction environments.
              </p>
            </div>
          </div>
        </section>

        <section
          className="content-section"
          id="mission-vision"
          style={{ background: "white" }}
        >
          <div className="shell">
            <SectionHeading
              eyebrow="Our direction"
              title="Purpose that guides the work"
            />
            <div className="mission-grid">
              <div className="mission-card">
                <p className="eyebrow">Mission</p>
                <h3>Make complex systems dependable.</h3>
                <p>{(content.mission as string | undefined) ?? 'To deliver safe, high-quality electrical and technical solutions that help our clients operate with confidence.'}</p>
              </div>
              <div className="mission-card">
                <p className="eyebrow">Vision</p>
                <h3>Be the partner people call first.</h3>
                <p>{(content.vision as string | undefined) ?? 'To become one of East Africa’s most trusted engineering contractors through capability, integrity, and consistent delivery.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="content-section about-split-section"
          id="why-work-with-us"
        >
          <div className="shell about-split">
            <div className="about-split-copy">
              <SectionHeading
                eyebrow="Why Stima"
                title="Why work with us"
                text="A dependable partner is built through the choices people make before, during, and after every project."
              />
              <div className="value-list">
                {livePrinciples.map((principle, index) => (
                  <div className="value-row" key={principle.title}>
                    <strong>0{index + 1}</strong>
                    <h3>{principle.title}</h3>
                    <p>{principle.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-split-image">
              <Image
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85"
                alt="Technical team collaborating on site"
                fill
                unoptimized
              />
            </div>
          </div>
        </section>

        <section
          className="content-section about-split-section core-values-section"
          id="core-values"
        >
          <div className="shell about-split about-split-reverse">
            <div className="about-split-image">
              <Image
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                alt="Engineering workspace"
                fill
                unoptimized
              />
            </div>
            <div className="about-split-copy">
              <SectionHeading
                eyebrow="What matters"
                title="Our core values"
                text="The principles that guide how we plan, communicate, and deliver."
              />
              <div className="values-accordion">
                {liveValues.map((value, index) => {
                  const isOpen = openValue === index;
                  return (
                    <div
                      className={`value-accordion-item ${isOpen ? "open" : ""}`}
                      key={value.title}
                    >
                      <button
                        type="button"
                        className="value-accordion-trigger"
                        onClick={() => setOpenValue(index)}
                        aria-expanded={isOpen}
                        aria-controls={`value-panel-${index}`}
                      >
                        <span>0{index + 1}</span>
                        <strong>{value.title}</strong>
                        <ChevronDown size={19} />
                      </button>
                      <div
                        className="value-accordion-panel"
                        id={`value-panel-${index}`}
                        hidden={!isOpen}
                      >
                        <p>{value.explanation || valueExplanations[index] || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section
          className="content-section"
          id="markets"
          style={{ background: "white" }}
        >
          <div className="shell">
            <SectionHeading
              eyebrow="Where we work"
              title="Markets we serve"
              text="Our technical teams adapt to the operating realities of each environment."
            />
            <div className="markets-grid">
              {liveMarkets.map((market) => (
                <div className="market-card" key={market}>
                  {market}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
