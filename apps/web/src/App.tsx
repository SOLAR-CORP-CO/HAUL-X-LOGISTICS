
import { useState } from "react";

const cargoTypes = [
  "General cargo",
  "Fragile goods",
  "Electronics",
  "Perishable goods",
  "Machinery",
  "Hazardous goods",
  "Oversized cargo",
  "Other",
];

const transportModes = ["Road", "Rail", "Air", "Sea"];
const shipmentTypes = ["FTL", "LTL", "Parcel"];
const packagingTypes = ["Carton", "Pallet", "Crate", "Drum", "Loose cargo"];

export default function App() {
  const [cargo, setCargo] = useState("General cargo");
  const [transport, setTransport] = useState("Road");
  const [shipment, setShipment] = useState("FTL");
  const [packaging, setPackaging] = useState("Carton");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      `Additional notes: ${form.get("notes") || "None"}`,
    ].join("\n");

    const subject = encodeURIComponent("HAUL X Shipment Enquiry");
    const body = encodeURIComponent(details);

    window.location.href =
      `mailto:solar.corporation.co@gmail.com?subject=${subject}&body=${body}`;

    setSent(true);
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="mark">H</span>
          <span>HAUL <b>X</b></span>
        </a>
        <a className="nav-cta" href="#request">Get a quote ↗</a>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">LOGISTICS · CONNECTED · FORWARD</div>
          <h1>
            Move your world.
            <span>Move it smarter.</span>
          </h1>
          <p>
            Logistics built around clarity, coordination and dependable
            movement. Tell us what you need to move and our team can
            review your request.
          </p>
          <a className="primary-button" href="#request">
            Plan a shipment ↗
          </a>
          <div className="hero-footer">
            <span>01 / A smarter way to move</span>
            <span>BUILT TO MOVE FORWARD</span>
          </div>
        </section>

        <section className="services" id="services">
          <div className="eyebrow">WHAT WE DO</div>
          <h2>Logistics, with a clearer direction.</h2>
          <p>
            Explore shipment options designed to help coordinate your
            cargo movement with clear shipment details and a quote review
            process.
          </p>
          <div className="service-grid">
            <article className="service-card">
              <span>01</span>
              <h3>Road freight</h3>
              <p>Flexible cargo movement by road.</p>
            </article>
            <article className="service-card">
              <span>02</span>
              <h3>Air & sea</h3>
              <p>Options for different shipment needs.</p>
            </article>
            <article className="service-card">
              <span>03</span>
              <h3>Coordination</h3>
              <p>Shipment requests reviewed with clarity.</p>
            </article>
          </div>
        </section>

        <section className="process">
          <div className="eyebrow">SIMPLE START</div>
          <h2>From request to route.</h2>
          <div className="process-grid">
            <div><span>01</span><h3>Tell us</h3><p>Share your shipment requirements.</p></div>
            <div><span>02</span><h3>Get reviewed</h3><p>Your request can be reviewed by our team.</p></div>
            <div><span>03</span><h3>Plan forward</h3><p>Receive a quote for your consideration.</p></div>
          </div>
        </section>

        <section className="request-section" id="request">
          <div className="eyebrow">START A CONVERSATION</div>
          <h2>Plan your shipment.</h2>
          <p className="request-intro">
            Select your cargo requirements. Our team can review your
            enquiry and respond with the next steps.
          </p>

          <form className="request-form" onSubmit={handleSubmit}>
            <h3 className="form-heading">01 / Your details</h3>

            <div className="field-grid">
              <label>
                Your name
                <input name="name" placeholder="Full name" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
              <label>
                Pickup location
                <input name="pickup" placeholder="City / location" required />
              </label>
              <label>
                Delivery location
                <input name="delivery" placeholder="City / location" required />
              </label>
            </div>

            <div className="form-divider" />
            <h3 className="form-heading">02 / Select your cargo</h3>

            <label className="section-label">Cargo category</label>
            <div className="choice-grid">
              {cargoTypes.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`choice-card ${cargo === item ? "selected" : ""}`}
                  aria-pressed={cargo === item}
                  onClick={() => setCargo(item)}
                >
                  {cargo === item ? "✓ " : "+ "}{item}
                </button>
              ))}
            </div>

            <label className="section-label">Transport mode</label>
            <div className="choice-grid">
              {transportModes.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`choice-card ${transport === item ? "selected" : ""}`}
                  aria-pressed={transport === item}
                  onClick={() => setTransport(item)}
                >
                  {transport === item ? "✓ " : "+ "}{item}
                </button>
              ))}
            </div>

            <label className="section-label">Shipment type</label>
            <div className="choice-grid">
              {shipmentTypes.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`choice-card ${shipment === item ? "selected" : ""}`}
                  aria-pressed={shipment === item}
                  onClick={() => setShipment(item)}
                >
                  {shipment === item ? "✓ " : "+ "}{item}
                </button>
              ))}
            </div>

            <label className="section-label">Packaging type</label>
            <div className="choice-grid">
              {packagingTypes.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`choice-card ${packaging === item ? "selected" : ""}`}
                  aria-pressed={packaging === item}
                  onClick={() => setPackaging(item)}
                >
                  {packaging === item ? "✓ " : "+ "}{item}
                </button>
              ))}
            </div>

            <div className="form-divider" />
            <h3 className="form-heading">03 / Shipment measurements</h3>

            <div className="field-grid">
              <label>
                Number of packages
                <input name="quantity" type="number" min="1" placeholder="e.g. 10" required />
              </label>
              <label>
                Approximate weight (kg)
                <input name="weight" type="number" min="0.1" step="0.1" placeholder="e.g. 250" required />
              </label>
              <label>
                Length (cm)
                <input name="length" type="number" min="1" placeholder="Length" />
              </label>
              <label>
                Width (cm)
                <input name="width" type="number" min="1" placeholder="Width" />
              </label>
              <label>
                Height (cm)
                <input name="height" type="number" min="1" placeholder="Height" />
              </label>
            </div>

            <label className="notes-label">
              Additional notes (optional)
              <textarea name="notes" rows={3} placeholder="Anything else we should know?" />
            </label>

            <button className="submit-button" type="submit">
              Send shipment enquiry ↗
            </button>

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
