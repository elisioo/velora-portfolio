"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, Menu, X, Play, FileText } from "lucide-react";
import { prompts } from "./prompts";
import { ScrollSection, ScrollSections } from "./ScrollSections";
const works = [
  {
    number: "01",
    name: "The Signature Product",
    kind: "PRODUCT PHOTOGRAPHY",
    desc: "A considered studio portrait, designed for the first impression.",
    file: "/images/Velora Labs Magnesium Glycinate Bottle.png",
  },
  {
    number: "02",
    name: "Stillness in Detail",
    kind: "EDITORIAL CAMPAIGN",
    desc: "Material, light, and restraint in a luxury product composition.",
    file: "/images/Velora Labs Magnesium Glycinate Still Life.png",
  },
  {
    number: "03",
    name: "The Morning Ritual",
    kind: "LIFESTYLE STORYTELLING",
    desc: "Everyday wellness, captured with a natural editorial sensibility.",
    file: "/images/Sunlit Morning Wellness Routine.png",
  },
  {
    number: "04",
    name: "A Clearer Story",
    kind: "PRODUCT INFOGRAPHIC",
    desc: "Useful product information with an elevated visual language.",
    file: "/images/Magnesium Glycinate Daily Ritual_infographic.png",
  },
  {
    number: "05",
    name: "A Moment in Motion",
    kind: "AI PRODUCT FILM",
    desc: "An atmospheric short-form product film for digital campaigns.",
    file: "/videos/kling_20261107_VIDEO_Create_an__5601_0.mp4",
    poster: "/images/Velora Labs Magnesium Glycinate Still Life.png",
  },
];
function Media({ item, hero = false }) {
  const [error, setError] = useState(false);
  const video = item.file.endsWith(".mp4");
  return (
    <div className={"media " + (hero ? "hero-media" : "")}>
      {!error &&
        (video ? (
          <video
            muted
            playsInline
            loop
            autoPlay
            controls
            preload="metadata"
            aria-label={item.name}
            poster={item.poster}
            onError={() => setError(true)}
            src={item.file}
          />
        ) : (
          <img src={item.file} alt={item.name} onError={() => setError(true)} />
        ))}
      {error && (
        <div className="media-fallback">
          <span className="ornament">✳</span>
          <small>VELORA LABS / CREATIVE STUDY</small>
          <strong>{item.name}</strong>
          <span>{video ? "VIDEO" : "IMAGE"} UNAVAILABLE</span>
        </div>
      )}
      {video && !error && (
        <span className="video-label">
          <Play size={13} /> AI FILM
        </span>
      )}
    </div>
  );
}
export default function Home() {
  const [menu, setMenu] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (selectedPrompt === null) return;
    const drawer = drawerRef.current;
    drawer.showModal();
    drawer.scrollTop = 0;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPrompt]);
  return (
    <ScrollSections>
      <header className="site-header">
        <a href="#top" className="wordmark">
          ELI SOROÑO <span>✳</span>
        </a>
        <nav className={menu ? "open" : ""}>
          <a onClick={() => setMenu(false)} href="#work">
            THE WORK
          </a>
          <a onClick={() => setMenu(false)} href="#approach">
            THE APPROACH
          </a>
          <a onClick={() => setMenu(false)} href="#about">
            ABOUT
          </a>
          <a className="nav-contact" href="mailto:sronoile@gmail.com">
            LET'S CONNECT <ArrowUpRight size={14} />
          </a>
        </nav>
        <button
          className="menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <ScrollSection className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="line" /> INDEPENDENT CREATIVE PORTFOLIO · 2026
          </div>
          <h1 style={{ fontWeight: "600" }}>
            Thoughtfully
            <br />
            made, <em>beautifully</em>
            <br />
            imagined.
          </h1>
          <p>
            AI-crafted product imagery, cinematic storytelling and considered
            web experiences for the modern wellness world.
          </p>
          <a className="text-link" href="#work">
            DISCOVER THE COLLECTION <ArrowDown size={17} />
          </a>
          <div className="hero-bottom">
            CREATIVE DIRECTION <span>·</span> AI VISUALS <span>·</span> WEB
            DEVELOPMENT
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-art-inner">
            <Media item={works[0]} hero />
            <span className="art-caption">THE ART OF EVERYDAY WELLNESS</span>
          </div>
          <div className="art-index">01 / THE VELORA EDIT</div>
        </div>
      </ScrollSection>
      <ScrollSection className="statement">
        <span>AN EXPLORATION OF FORM & FEELING</span>
        <h2>
          Where thoughtful design
          <br />
          meets <em>modern possibility.</em>
        </h2>
        <p>
          A curated creative study for VELORA LABS, a fictional premium wellness
          brand. Five pieces. One cohesive visual identity.
        </p>
      </ScrollSection>
      <ScrollSection id="work" className="work">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 / SELECTED WORK</div>
            <h2>
              The Velora <em>edit.</em>
            </h2>
          </div>
          <p>
            AN AI-ASSISTED WELLNESS CAMPAIGN
            <br />
            FICTIONAL BRAND CONCEPT · 2026
          </p>
        </div>
        <div className="gallery">
          {works.map((item, i) => (
            <article className={"project project-" + i} key={item.number}>
              <Media item={item} />
              <div className="project-meta">
                <span>
                  {item.number} / {item.kind}
                </span>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <button
                  type="button"
                  className="prompt-button"
                  aria-haspopup="dialog"
                  aria-controls="prompt-drawer"
                  aria-label={`View prompt for ${item.name}`}
                  onClick={() => setSelectedPrompt(i)}
                >
                  <FileText size={16} aria-hidden="true" /> View prompt
                </button>
              </div>
            </article>
          ))}
        </div>
      </ScrollSection>
      <ScrollSection className="interlude">
        <span>THE CREATIVE PHILOSOPHY</span>
        <h2>
          Quiet luxury.
          <br />
          <em>Intentional impact.</em>
        </h2>
        <p>
          Warmth over noise. Authenticity over excess. Every visual crafted to
          feel natural, elevated, and distinctly human.
        </p>
      </ScrollSection>
      <ScrollSection id="approach" className="approach">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / THE APPROACH</div>
            <h2>
              From concept
              <br />
              to <em>commerce.</em>
            </h2>
          </div>
        </div>
        <div className="steps">
          <div>
            <span>01</span>
            <h3>Visual direction</h3>
            <p>
              Building a consistent visual world through lighting, material,
              palette, and art direction.
            </p>
          </div>
          <div>
            <span>02</span>
            <h3>AI-assisted production</h3>
            <p>
              Developing product imagery, lifestyle concepts, infographics, and
              short-form motion.
            </p>
          </div>
          <div>
            <span>03</span>
            <h3>Digital experience</h3>
            <p>
              Translating creative assets into clean, responsive
              e-commerce-ready page layouts.
            </p>
          </div>
        </div>
      </ScrollSection>
      <ScrollSection id="about" className="about">
        <div className="about-kicker">03 / BEHIND THE WORK</div>
        <div>
          <h2>
            A creative eye.
            <br />
            <em>A developer's mind.</em>
          </h2>
          <p>
            I'm Eli Soroño, a web developer working with React, TypeScript,
            JavaScript, and HTML/CSS. I enjoy bringing visual storytelling and
            thoughtful interface design together for digital brands.
          </p>
          <p>
            This VELORA LABS project is a fictional creative concept, brought to
            life through product imagery, lifestyle storytelling, a visual
            product guide, and an AI-assisted short film.
          </p>
          <div className="skills">
            <span>REACT</span>
            <span>TYPESCRIPT</span>
            <span>JAVASCRIPT</span>
            <span>HTML / CSS</span>
            <span>RESPONSIVE DESIGN</span>
          </div>
        </div>
      </ScrollSection>
      <dialog
        ref={drawerRef}
        id="prompt-drawer"
        className="prompt-drawer"
        aria-labelledby="prompt-drawer-title"
        onClose={() => setSelectedPrompt(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            ) {
              event.currentTarget.close();
            }
          }
        }}
      >
        <div className="prompt-drawer-header">
          <span>
            <FileText size={18} aria-hidden="true" /> Behind the creative
          </span>
          <button
            type="button"
            className="prompt-close"
            aria-label="Close prompt drawer"
            onClick={() => drawerRef.current.close()}
            autoFocus
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {selectedPrompt !== null && (
          <div className="prompt-drawer-content">
            <div className="eyebrow">
              {works[selectedPrompt].number} / {works[selectedPrompt].kind}
            </div>
            <h2 id="prompt-drawer-title">{works[selectedPrompt].name}</h2>
            <p className="prompt-intro">
              The prompt used to create this{" "}
              {selectedPrompt === 4 ? "film" : "image"}.
            </p>
            <div className="prompt-text">{prompts[selectedPrompt]}</div>
          </div>
        )}
      </dialog>
      <ScrollSection id="contact" className="contact-section"><footer>
        <span>LET'S CREATE SOMETHING MEANINGFUL</span>
        <h2>
          Have something
          <br />
          <em>in mind?</em>
        </h2>
        <a href="mailto:sronoile@gmail.com">
          sronoile@gmail.com <ArrowUpRight size={26} />
        </a>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} ELI SOROÑO</span>
          <span>VELORA LABS IS A FICTIONAL PORTFOLIO CONCEPT</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer></ScrollSection>
    </ScrollSections>
  );
}
