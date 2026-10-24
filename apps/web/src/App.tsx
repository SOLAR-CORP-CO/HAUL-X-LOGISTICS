
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


const cargoTypes = ["General cargo", "Fragile goods", "Electronics", "Perishable goods", "Machinery", "Hazardous goods", "Oversized cargo", "Other"];
const transportModes = ["Road", "Rail", "Air", "Sea"];
const shipmentTypes = ["FTL", "LTL", "Parcel"];
const packagingTypes = ["Carton", "Pallet", "Crate", "Drum", "Loose cargo"];


const visualScenes = [
  { title: "ROAD FREIGHT", subtitle: "THE JOURNEY STARTS ON THE GROUND", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1800&q=88", alt: "Freight truck travelling along an open highway" },
  { title: "CONTAINER NETWORK", subtitle: "CARGO MOVES BETWEEN EVERY MODE", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=88", alt: "Rows of shipping containers at a busy container terminal" },
  { title: "OCEAN FREIGHT", subtitle: "ACROSS DISTANCES, ACROSS OCEANS", image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1800&q=88", alt: "Cargo ship and stacked containers at an international port" },
  { title: "AIR CARGO", subtitle: "WHEN THE FASTEST ROUTE TAKES FLIGHT", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=88", alt: "Commercial aircraft flying above the clouds" },
  { title: "ONE CONNECTED JOURNEY", subtitle: "ROAD · SEA · AIR · WORKING TOGETHER", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=88", alt: "Logistics warehouse coordinating goods for onward transport" }
];

function CinematicSequence() {
  const [activeScene, setActiveScene] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActiveScene(current => (current + 1) % visualScenes.length), 6200);
    return () => window.clearInterval(timer);
  }, [paused]);
  return (
    <div className="cinematic-sequence" aria-label="HAUL X logistics scenes">
      <div className="cinematic-image-stage">
        {visualScenes.map((scene, index) => (
          <motion.img key={scene.image} className="cinematic-image" src={scene.image} alt={scene.alt}
            initial={false} animate={{ opacity: activeScene === index ? 1 : 0, scale: activeScene === index ? 1.08 : 1.17 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: "linear" } }}
            loading={index === 0 ? "eager" : "lazy"} draggable={false} />
        ))}
        <div className="cinematic-shade" />
        <div className="cinematic-topline"><span>HAUL X / FIELD NOTES</span><span>0{activeScene + 1} — 0{visualScenes.length}</span></div>
        <motion.div className="cinematic-caption" key={activeScene} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .15 }}>
          <span>{visualScenes[activeScene].subtitle}</span><strong>{visualScenes[activeScene].title}</strong>
        </motion.div>
        <div className="cinematic-controls" aria-label="Choose logistics scene">
          {visualScenes.map((scene, index) => (
            <button key={scene.title} type="button" className={activeScene === index ? "scene-dot active" : "scene-dot"}
              onClick={() => setActiveScene(index)} aria-label={`Show ${scene.title.toLowerCase()} scene`} aria-pressed={activeScene === index}>
              <span>0{index + 1}</span><i />
            </button>
          ))}
          <button type="button" className="scene-play" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play scene sequence" : "Pause scene sequence"}>{paused ? "PLAY" : "PAUSE"}</button>
        </div>
      </div>
    </div>
  );
}

function LogisticsStory() {
  const storyRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const imageOpacities = [
    useTransform(scrollYProgress, [0, .035, .16, .22], [1, 1, 0, 0]),
    useTransform(scrollYProgress, [.15, .22, .34, .4], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.33, .4, .53, .6], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.53, .6, .73, .8], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.73, .81, 1], [0, 1, 1])
  ];
  const beats = [
    { title: "From the first\nmile.", body: "A truck collects the shipment and starts the journey, connecting local roads to a much bigger network.", side: "left" },
    { title: "Across the\ncontainer network.", body: "At the terminal, cargo is sorted, secured and transferred for the next leg of its route.", side: "right" },
    { title: "Over open\nwater.", body: "Ships carry containers across oceans, linking ports, markets and destinations around the world.", side: "left" },
    { title: "Up into the\nopen sky.", body: "For time-sensitive journeys, air cargo adds another connection to the same global supply chain.", side: "right" },
    { title: "One journey.\nEvery connection.", body: "Road, sea and air work together. HAUL X brings the moving parts into one clearer picture.", side: "center" }
  ];
  const opacities = [
    useTransform(scrollYProgress, [0, .035, .16, .22], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.16, .23, .34, .41], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.35, .42, .54, .61], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.55, .62, .74, .81], [0, 1, 1, 0]),
    useTransform(scrollYProgress, [.75, .83, .96, 1], [0, 1, 1, 1])
  ];
  const shifts = [
    useTransform(scrollYProgress, [0, .08, .2], [32, 0, -24]),
    useTransform(scrollYProgress, [.16, .25, .39], [32, 0, -24]),
    useTransform(scrollYProgress, [.35, .44, .58], [32, 0, -24]),
    useTransform(scrollYProgress, [.55, .64, .78], [32, 0, -24]),
    useTransform(scrollYProgress, [.75, .85, 1], [24, 0, 0])
  ];
  return (
    <section className="logistics-story" id="technology" ref={storyRef}>
      <div className="story-sticky">
        <div className="story-visual" aria-label="A continuous freight journey by truck, container, ship and aircraft">
          {visualScenes.map((scene, index) => (
            <motion.img key={scene.title} className={index === 4 ? "story-image story-network-image" : "story-image"}
              src={scene.image} alt={scene.alt} style={{ opacity: imageOpacities[index] }} />
          ))}
          <div className="story-image-shade" />
          <div className="story-index"><span>HAUL X / THE JOURNEY</span><span>SCROLL TO EXPLORE</span></div>
          <div className="story-progress"><motion.i style={{ scaleX: scrollYProgress }} /></div>
        </div>
        <div className="story-copy-layer">
          {beats.map((beat, index) => (
            <motion.article key={beat.title} className={`story-beat story-beat-${beat.side}`} style={{ opacity: opacities[index], x: shifts[index] }}>
              <span className="eyebrow">0{index + 1} / THE HAUL X JOURNEY</span>
              <h2>{beat.title.split("\\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{beat.body}</p>
              {index === 4 && <a className="story-link" href="#request">Plan a shipment <span>↗</span></a>}
            </motion.article>
          ))}
        </div>
        <div className="story-bottom-note">ROAD FREIGHT <i /> CONTAINERS <i /> OCEAN FREIGHT <i /> AIR CARGO</div>
      </div>
    </section>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 45 },
  visible: { opacity: 1, y: 0 }
};

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [cargo, setCargo] = useState("General cargo");
  const [transport, setTransport] = useState("Road");
  const [shipment, setShipment] = useState("FTL");
  const [packaging, setPackaging] = useState("Carton");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const details = [
      `Customer: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Pickup: ${form.get("pickup")}`,
      `Delivery: ${form.get("delivery")}`,
      `Cargo category: ${cargo}`,
      `Transport mode: ${transport}`,
      `Shipment type: ${shipment}`,
      `Packaging: ${packaging}`,
      `Packages: ${form.get("quantity")}`,
      `Weight: ${form.get("weight")} kg`,
      `Dimensions: ${form.get("length")} × ${form.get("width")} × ${form.get("height")} cm`,
      `Additional notes: ${form.get("notes") || "None"}`
    ].join("\n");

    window.location.href =
      `mailto:solar.corporation.co@gmail.com?subject=${encodeURIComponent("HAUL X Shipment Enquiry")}&body=${encodeURIComponent(details)}`;

    setSent(true);
  }

  function choices(items: string[], value: string, setter: (v: string) => void, label: string) {
    return (
      <div className="select-wrap">
        <select
          className="choice-select"
          aria-label={label}
          value={value}
          onChange={(event) => setter(event.target.value)}
        >
          {items.map(item => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <span className="select-chevron" aria-hidden="true">⌄</span>
      </div>
    );
  }

  return (
    <div className="app">
      <motion.header
        className="navbar"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <a className="brand" href="#">
          <span className="mark">H</span>
          <span>HAUL <b>X</b></span>
        </a>
        <a className="nav-cta" href="#request">Get a quote ↗</a>
      </motion.header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              LOGISTICS · CONNECTED · FORWARD
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 55 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Move your world.
              <span>Move it smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              Logistics built around clarity, coordination and dependable
              movement. Tell us what you need to move and our team can
              review your request.
            </motion.p>

            <motion.a
              className="primary-button"
              href="#request"
              whileHover={{ scale: 1.06, boxShadow: "0 0 35px #38bdf899" }}
              whileTap={{ scale: 0.96 }}
            >
              Plan a shipment ↗
            </motion.a>
          </div>

          <div className="hero-visual">
            <CinematicSequence />
            <div className="scene-label">HAUL X / FREIGHT IN MOTION</div>
            <div className="scene-coordinate">GLOBAL LOGISTICS NETWORK</div>
          </div>

          <div className="hero-footer">
            <span>01 / A smarter way to move</span>
            <span>BUILT TO MOVE FORWARD</span>
          </div>
        </section>

        <LogisticsStory />\n\n        <section className="stats-strip">
          {[
            ["01", "ROAD FREIGHT"],
            ["02", "AIR CARGO"],
            ["03", "SEA FREIGHT"],
            ["04", "SUPPLY CHAIN"]
          ].map(([number, label], i) => (
            <Reveal key={number} delay={i * 0.1}>
              <div className="stat-item">
                <span>{number}</span>
                <strong>{label}</strong>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="services" id="services">
          <Reveal>
            <div className="eyebrow">WHAT WE DO / 01</div>
            <h2>Logistics, with a clearer direction.</h2>
            <p>
              Explore shipment options designed to help coordinate your
              cargo movement with clear shipment details and a quote review process.
            </p>
          </Reveal>

          <div className="service-grid">
            {[
              ["01", "Road freight", "Flexible cargo movement by road.", "↗"],
              ["02", "Air & sea", "Options for different shipment needs.", "✈"],
              ["03", "Coordination", "Shipment requests reviewed with clarity.", "◎"]
            ].map(([n, title, description, symbol], i) => (
              <Reveal key={n} delay={i * 0.12}>
                <motion.article
                  className="service-card"
                  whileHover={{ y: -12, rotateX: 3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 220 }}
                >
                  <div className="card-top">
                    <span>{n}</span>
                    <span className="card-symbol">{symbol}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="card-line" />
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="network-section">
          <Reveal>
            <div className="eyebrow">CONNECTED MOVEMENT / 02</div>
            <h2>Every route has a purpose.</h2>
            <p>One connected approach to moving cargo forward.</p>
          </Reveal>
          <div className="network-visual">
            <div className="network-grid" />
            <svg viewBox="0 0 800 300" role="img" aria-label="Illustrative logistics route network">
              <path className="route-path" d="M70 210 Q210 20 360 150 T730 75" />
              <path className="route-path route-two" d="M70 210 Q300 290 470 130 T730 75" />
              {[["70","210"],["360","150"],["470","130"],["730","75"]].map(([x,y]) => (
                <g key={x}>
                  <circle cx={x} cy={y} r="13" className="route-node" />
                  <circle cx={x} cy={y} r="27" className="route-pulse" />
                </g>
              ))}
            </svg>
            <span className="network-tag tag-one">ORIGIN</span>
            <span className="network-tag tag-two">DESTINATION</span>
            <span className="network-caption">ROUTE VISUALIZATION · ILLUSTRATIVE</span>
          </div>
        </section>

        <section className="process">
          <Reveal>
            <div className="eyebrow">SIMPLE START / 03</div>
            <h2>From request to route.</h2>
          </Reveal>
          <div className="process-grid">
            {[
              ["01", "Tell us", "Share your shipment requirements."],
              ["02", "Get reviewed", "Your request can be reviewed by our team."],
              ["03", "Plan forward", "Receive a quote for your consideration."]
            ].map(([n, title, description], i) => (
              <Reveal key={n} delay={i * 0.15}>
                <motion.div className="process-card" whileHover={{ y: -8 }}>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="request-section" id="request">
          <Reveal>
            <div className="eyebrow">START A CONVERSATION / 04</div>
            <h2>Plan your shipment.</h2>
            <p className="request-intro">
              Select your cargo requirements. Our team can review your
              enquiry and respond with the next steps.
            </p>
          </Reveal>

          <Reveal>
            <form className="request-form" onSubmit={handleSubmit}>
              <h3 className="form-heading">01 / Your details</h3>
              <div className="field-grid">
                <label>Your name<input name="name" placeholder="Full name" required /></label>
                <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
                <label>Pickup location<input name="pickup" placeholder="City / location" required /></label>
                <label>Delivery location<input name="delivery" placeholder="City / location" required /></label>
              </div>

              <div className="form-divider" />
              <h3 className="form-heading">02 / Select your cargo</h3>
              <label className="section-label">Cargo category</label>
              {choices(cargoTypes, cargo, setCargo, "Cargo category")}
              <label className="section-label">Transport mode</label>
              {choices(transportModes, transport, setTransport, "Transport mode")}
              <label className="section-label">Shipment type</label>
              {choices(shipmentTypes, shipment, setShipment, "Shipment type")}
              <label className="section-label">Packaging type</label>
              {choices(packagingTypes, packaging, setPackaging, "Packaging type")}

              <div className="form-divider" />
              <h3 className="form-heading">03 / Shipment measurements</h3>
              <div className="field-grid">
                <label>Number of packages<input name="quantity" type="number" min="1" placeholder="e.g. 10" required /></label>
                <label>Approximate weight (kg)<input name="weight" type="number" min="0.1" step="0.1" placeholder="e.g. 250" required /></label>
                <label>Length (cm)<input name="length" type="number" min="1" placeholder="Length" /></label>
                <label>Width (cm)<input name="width" type="number" min="1" placeholder="Width" /></label>
                <label>Height (cm)<input name="height" type="number" min="1" placeholder="Height" /></label>
              </div>

              <label className="notes-label">
                Additional notes (optional)
                <textarea name="notes" rows={3} placeholder="Anything else we should know?" />
              </label>

              <motion.button className="submit-button" type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                Send shipment enquiry ↗
              </motion.button>

              {sent && (
                <p className="form-message">
                  Your email app should open with your shipment enquiry.
                  Please send the email to complete your request.
                </p>
              )}

              <p className="form-note">
                Submitting this form does not create a confirmed booking.
                Your enquiry is subject to review and confirmation.
              </p>
            </form>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#">
          <span className="mark">H</span>
          <span>HAUL <b>X</b></span>
        </a>
        <span>AN INITIATIVE BY SOLAR CORP.CO</span>
        <p>© {new Date().getFullYear()} HAUL X</p>
      </footer>
    </div>
  );
      }
      
