import { useState } from "react";
import { makeRequestCall } from "../api/api.js";
import logo from "../assets/Logo.png";
import qr_code from "../assets/qr-code.png";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import "./BuyoutForm.css";


const SCRIPT_ID = "form_script";
const ACTION    = "buyout_submit";

// ── helpers ───────────────────────────────────────────────────────────────────
function generateRef() {
  return "YG-" + Date.now().toString(36).toUpperCase().slice(-6);
}

function today() {
  const d = new Date();
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
    .map((n) => String(n).padStart(2, "0"))
    .join("/");
}

const esc = (s) => String(s ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\n/g, "<br>");

// ── HTML print document builder ───────────────────────────────────────────────
function buildPrintHTML(fields, checks, refNum) {
  const tick = (v) => v
    ? `<span style="color:#c41e3a;font-weight:700;">&#x2611;</span>`
    : `<span style="color:#aaa;">&#x2610;</span>`;

  const field = (label, value) => `
    <div class="pf-field">
      <div class="pf-label">${label}</div>
      <div class="pf-value">${esc(value) || "&nbsp;"}</div>
    </div>`;

  const checkRow = (checked, text) => `
    <div class="pf-check-row">${tick(checked)}<span>${esc(text)}</span></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Yuranka Games — Buyout Form ${refNum}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;700&family=Inter:wght@400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'Inter',sans-serif;background:#f0f0f0;color:#2c3e50;}

  .page{
    width:210mm;min-height:297mm;background:white;
    margin:12px auto;padding:18mm 20mm;
    box-shadow:0 2px 10px rgba(0,0,0,.12);
    display:flex;flex-direction:column;
    page-break-after:always;
  }

  /* header */
  .pf-header{padding-bottom:14px;border-bottom:3px solid #c41e3a;margin-bottom:20px;}
  .pf-logo-row{display:flex;align-items:center;gap:14px;}
  .pf-logo{width:70px;height:70px;object-fit:contain;}
  .pf-title{flex:1;}
  .pf-title h1{font-family:'Bitter',serif;font-size:24px;font-weight:700;color:#1a1a1a;line-height:1.2;}
  .pf-title p{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
  .pf-ref{text-align:right;white-space:nowrap;}
  .pf-ref span{display:block;font-size:9px;color:#aaa;text-transform:uppercase;letter-spacing:.5px;}
  .pf-ref strong{font-family:'Bitter',serif;font-size:13px;color:#c41e3a;letter-spacing:1px;}

  /* notices */
  .notice-warn{background:#fff3cd;border-left:4px solid #ff9800;padding:9px 12px;font-size:11px;font-weight:500;color:#654321;border-radius:2px;margin-bottom:16px;}
  .notice-red {background:#f7e8e8;border-left:4px solid #c41e3a;padding:9px 12px;font-size:11px;font-weight:500;color:#8b3a3a;border-radius:2px;margin-bottom:16px;}

  /* qr */
  .pf-qr-row{background:#f7e8e8;padding:12px;border-radius:4px;display:grid;grid-template-columns:90px 1fr;gap:12px;align-items:center;margin-bottom:16px;}
  .pf-qr-box{width:90px;height:90px;border:2px dashed #bbb;display:flex;align-items:center;justify-content:center;overflow:hidden;background:white;}
  .pf-qr-box img{width:100%;height:100%;object-fit:contain;}
  .pf-qr-text h3{font-size:12px;font-weight:600;color:#1a1a1a;margin-bottom:5px;}
  .pf-qr-text p{font-size:10px;color:#555;line-height:1.5;}

  /* section title */
  .pf-section{font-family:'Bitter',serif;font-size:13px;font-weight:700;color:#1a1a1a;padding-bottom:6px;border-bottom:2px solid #e8eef0;margin:16px 0 10px;}

  /* fields */
  .pf-grid{display:grid;gap:10px;margin-bottom:10px;}
  .pf-grid-2{grid-template-columns:1fr 1fr;}
  .pf-grid-1{grid-template-columns:1fr;}
  .pf-field{display:flex;flex-direction:column;}
  .pf-label{font-size:9px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:.3px;margin-bottom:3px;}
  .pf-value{border:1px solid #d0d8dd;padding:6px 8px;font-size:10px;border-radius:2px;min-height:24px;color:#1a1a1a;background:white;}

  /* note boxes */
  .note-red{background:#f7e8e8;padding:8px 10px;font-size:9.5px;color:#555;border-radius:3px;margin-bottom:12px;line-height:1.4;}
  .note-yellow{background:#fff3cd;border-left:4px solid #ff9800;padding:10px 12px;font-size:9.5px;color:#555;border-radius:2px;line-height:1.6;}

  /* check header */
  .pf-check-header{background:#e8eef0;padding:8px 10px;font-size:10px;font-weight:600;color:#1a1a1a;border-radius:3px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.3px;}

  /* check rows */
  .pf-checks{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
  .pf-check-row{display:flex;align-items:flex-start;gap:7px;font-size:9.5px;color:#333;line-height:1.4;}
  .pf-check-row span:first-child{font-size:13px;line-height:1;flex-shrink:0;margin-top:1px;}

  /* textarea / card list */
  .pf-card-box{border:1px solid #d0d8dd;padding:8px;font-size:9.5px;border-radius:3px;min-height:200px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;word-break:break-word;}

  /* disclaimer rows */
  .pf-disclaimer-row{display:flex;gap:8px;margin-bottom:3px;font-size:9.5px;}
  .pf-disclaimer-row strong{flex-shrink:0;color:#1a1a1a;min-width:120px;}
  .pf-disclaimer-row span{color:#555;}

  /* signature */
  .pf-sig-line{border-bottom:1.5px solid #333;min-height:36px;padding-bottom:4px;font-size:15px;font-style:italic;color:#1a1a1a;}

  /* submission footer */
  .pf-footer{margin-top:auto;padding-top:14px;border-top:1px solid #e8eef0;}
  .pf-footer-title{font-size:11px;font-weight:700;color:#1a1a1a;margin-bottom:8px;}
  .pf-options{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
  .pf-option{background:#f7e8e8;padding:9px 10px;border-radius:3px;font-size:9.5px;color:#555;line-height:1.4;}
  .pf-option strong{display:block;color:#1a1a1a;font-weight:600;margin-bottom:3px;}
  .pf-contact{background:#f7e8e8;padding:10px;border-radius:3px;font-size:9.5px;color:#555;line-height:1.7;}
  .pf-contact strong{display:block;color:#1a1a1a;font-weight:600;margin-bottom:4px;}
  .pf-questions{font-size:9.5px;color:#555;margin-top:8px;line-height:1.7;}

  /* print btn */
  .print-bar{width:210mm;margin:0 auto 12px;display:flex;align-items:center;gap:12px;}
  .print-btn{background:#c41e3a;color:white;border:none;padding:9px 20px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;border-radius:4px;cursor:pointer;}
  .print-hint{font-size:11px;color:#666;}

  @media print {
    body{background:white;}
    .print-bar{display:none;}
    .page{margin:0;box-shadow:none;padding:15mm 18mm;}
  }
</style>
</head>
<body>
<div class="print-bar">
  <button class="print-btn" onclick="window.print()">&#x1F5A8; Save as PDF / Print</button>
  <span class="print-hint">In the print dialog, choose <em>"Save as PDF"</em>, then attach to your email.</span>
</div>

<!-- PAGE 1 -->
<div class="page">
  <div class="pf-header">
    <div class="pf-logo-row">
      <img class="pf-logo" src="${logo}" alt="Yuranka Games">
      <div class="pf-title">
        <h1>Singles Evaluation</h1>
        <p>Trading Card Game &middot; Buyout Form</p>
      </div>
      <div class="pf-ref">
        <span>Reference #</span>
        <strong>${refNum}</strong>
      </div>
    </div>
  </div>

  <div class="notice-warn"><strong>Important:</strong> We purchase singles at <strong>50%</strong> of current Cardmarket prices. Store credit only.</div>

  <div class="pf-qr-row">
    <div class="pf-qr-box"><img src="${qr_code}" alt="QR Code"></div>
    <div class="pf-qr-text">
      <h3>Create Your Personal Yuranka Account</h3>
      <p>Scan this QR code to set up your account. Track store credit and submission status through your personal Yuranka Account.</p>
    </div>
  </div>

  <div class="pf-section">Customer Information</div>
  <div class="pf-grid pf-grid-2">
    ${field("Store Username", fields.username)}
    ${field("Email Address", fields.email)}
  </div>
  <div class="pf-grid pf-grid-2">
    ${field("Phone Number", fields.phone)}
    ${field("Submission Date (DD/MM/YYYY)", fields.date)}
  </div>
  <div class="pf-grid pf-grid-1">
    ${field("Home Address (For Card Delivery if Outside Riga)", fields.address)}
  </div>
  <div class="note-red"><strong>Note:</strong> If outside Riga, provide a delivery address. Leave blank to pick up in-store.</div>

  <div class="pf-check-header">IMPORTANT: We only process submissions that have ALL boxes checked below.</div>
  <div class="pf-checks">
    ${checkRow(checks.c1, "I understand that Yuranka Games provides store credit in exchange for the cards.")}
    ${checkRow(checks.c2, "I understand that the estimated value is 50% of the card value on Cardmarket.")}
    ${checkRow(checks.c3, "I understand that prices are ONLY locked after an agreed price has been finalized. Initial evaluation prices are not locked.")}
    ${checkRow(checks.c4, "I understand that re-evaluation may incur an additional \u20ac0.33/card per cycle if I decline the offer (waived if I accept).")}
    ${checkRow(checks.c5, "I understand that Yuranka Games may re-evaluate cards if there are drastic market changes. \u20ac0.33/card fee applies if I decline after 3 business days.")}
    ${checkRow(checks.c6, "Shipping is covered within Latvia only. Outside Latvia is not covered by Yuranka Games.")}
    ${checkRow(checks.c7, "I confirm that I am 18 years old or have the permission of a parent/guardian to trade these cards.")}
  </div>
</div>

<!-- PAGE 2 -->
<div class="page">
  <div class="pf-header">
    <div class="pf-logo-row">
      <div class="pf-title" style="flex:1"><h1 style="font-size:17px">Card Details</h1></div>
      <div class="pf-ref"><span>Reference #</span><strong>${refNum}</strong></div>
    </div>
  </div>
  <p style="font-size:10px;color:#aaa;text-align:right;margin-bottom:10px;">Page 2 of 3</p>

  <div class="notice-red"><strong>Remember:</strong> If you do not accept our offer, a fee of &euro;0.33 per card will be charged. If you accept, store credit will be credited and you&rsquo;ll be notified via email. You are always free to bargain! :)</div>

  <div class="pf-label" style="margin-bottom:5px;">LIST OF CARDS I WOULD LIKE AN OFFER ON</div>
  <div class="note-red"><strong>Disclaimer:</strong> Only listed cards are evaluated at Cardmarket lowest. Unlisted cards are treated as bulk.</div>
  <div class="pf-card-box">${esc(fields.cardList) || '<span style="color:#aaa">No cards listed.</span>'}</div>
  <div class="note-red" style="margin-top:8px;"><strong>Tip:</strong> If you have more cards, attach additional sheets to your submission.</div>

  <div class="pf-section" style="margin-top:18px;">Bulk Cards Information</div>
  <div class="pf-checks" style="margin-bottom:12px;">
    ${checkRow(checks.cBulk, "I understand that every unlisted card will be considered bulk: 1 cent/common, 3 cents/holographic or foil card.")}
  </div>
  <div class="pf-check-header">QUANTITY OF BULK CARDS TO BE SUBMITTED</div>
  <div class="pf-grid pf-grid-2" style="margin-bottom:0">
    ${field("Commons (Non-holographic)", fields.bulkCommons)}
    ${field("Holographic / Alt Arts", fields.bulkHolo)}
  </div>
</div>

<!-- PAGE 3 -->
<div class="page">
  <div class="pf-header">
    <div class="pf-logo-row">
      <div class="pf-title" style="flex:1"><h1 style="font-size:17px">Disclaimers &amp; Signature</h1></div>
      <div class="pf-ref"><span>Reference #</span><strong>${refNum}</strong></div>
    </div>
  </div>
  <p style="font-size:10px;color:#aaa;text-align:right;margin-bottom:10px;">Page 3 of 3</p>

  <div class="pf-section">Cards We Do Not Buy</div>
  <div class="note-yellow">
    <div class="pf-disclaimer-row"><strong>Pok&eacute;mon:</strong><span>Code cards, Common Energies, Ad/Explanation cards</span></div>
    <div class="pf-disclaimer-row"><strong>Star Wars Unlimited:</strong><span>Common Bases, Common Leaders</span></div>
    <div class="pf-disclaimer-row"><strong>MTG:</strong><span>Tokens/Clues, Ad/Explanation cards</span></div>
    <div class="pf-disclaimer-row"><strong>One Piece:</strong><span>Common Don cards, Ad/Explanation cards</span></div>
    <div class="pf-disclaimer-row"><strong>Flesh and Blood:</strong><span>Common Young Leaders, Ad/Explanation cards</span></div>
    <div class="pf-disclaimer-row"><strong>Riftbound: League of Legends:</strong><span>Ad/Explanation cards</span></div>
    <div class="pf-disclaimer-row"><strong>We Do Not Currently Buy:</strong><span>Gundam cards, Digimon cards</span></div>
  </div>

  <div class="pf-checks" style="margin-top:16px;margin-bottom:20px;">
    ${checkRow(checks.cDisclaimer, "I have read and agree to the above terms regarding cards we do not buy.")}
  </div>

  <div class="pf-section">Signature</div>
  <div class="pf-label" style="margin-bottom:4px;">FULL NAME (LEGAL SIGNATURE)</div>
  <div class="pf-sig-line">${esc(fields.fullName)}</div>

  <div class="pf-footer">
    <div class="pf-footer-title">Submit your completed form &amp; cards in one of two ways:</div>
    <div class="pf-options">
      <div class="pf-option">
        <strong>Online Form + Mail Cards</strong>
        Submit this form online and mail only your cards. Reference the unique code at the top of this form (${refNum}).
      </div>
      <div class="pf-option">
        <strong>Print &amp; Mail</strong>
        Print this form, include it with your cards, and mail to the address below.
      </div>
    </div>
    <div class="pf-contact">
      <strong>Yuranka Games</strong>
      Mat&#x12B;sa iela 25, B&#x113;rnu pasaule &nbsp;&middot;&nbsp; LV-1001 Riga, Latvia
      &nbsp;&nbsp;|&nbsp;&nbsp; Phone: +371 27 460 885 &nbsp;&nbsp;|&nbsp;&nbsp; Email: support@yuranka.com
    </div>
  </div>
</div>

</body>
</html>`;
}

// ── mailto builder ────────────────────────────────────────────────────────────
function buildMailto(fields, refNum) {
  const body = `Hi Yuranka Games team,

Please find my completed TCG Singles Buyout Form attached to this email (PDF).

Reference #: ${refNum}
Name: ${fields.fullName || "(see PDF)"}
Username: ${fields.username || "(see PDF)"}

Next steps I have taken:
1. Completed PDF is attached to this email.
2. I will post my cards to: Matisa iela 25, Bernu pasaule, LV-1001 Riga, Latvia.
3. I have written my Reference # (${refNum}) on the envelope.

Please confirm receipt when you have a chance.

Thank you!`.trim();

  const subject = `TCG Buyout Submission — ${refNum}${fields.username ? ` (${fields.username})` : ""}`;
  return `mailto:support@yuranka.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ── validation ────────────────────────────────────────────────────────────────
function validate(fields, checks) {
  const errors = [];
  if (!fields.username.trim()) errors.push("Store username is required.");
  if (!fields.email.trim()) errors.push("Email address is required.");
  if (!fields.fullName.trim()) errors.push("Full name / signature is required.");
  if (!Object.values(checks).every(Boolean)) errors.push("All checkboxes must be ticked before submitting.");
  return errors;
}

// ── sub-components ────────────────────────────────────────────────────────────
function SectionTitle({ children, style }) {
  return <div className="bf-section-title" style={style}>{children}</div>;
}

function Notice({ type, children }) {
  return <div className={`bf-notice bf-notice--${type}`}>{children}</div>;
}

function Field({ id, label, children }) {
  return (
    <div className="bf-field">
      <label className="bf-label" htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function CheckItem({ id, checked, onChange, children }) {
  return (
    <label className="bf-check-item" htmlFor={id}>
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <span>{children}</span>
    </label>
  );
}

function PageHeader({ refNum }) {
  return (
    <div className="bf-header">
      <div className="bf-logo-row">
        <div className="bf-logo-box"><img src = {logo} alt="Yuranka Games Logo" /></div>
        <div className="bf-header-text">
          <h1>Singles Evaluation</h1>
          <p>Trading Card Game · Buyout Form</p>
        </div>
        <div className="bf-ref-badge">
          <span className="bf-ref-label">Reference #</span>
          <span className="bf-ref-value">{refNum}</span>
        </div>
      </div>
    </div>
  );
}

function MiniHeader({ title, refNum, page }) {
  return (
    <div className="bf-header bf-header--mini">
      <div className="bf-logo-row">
        <div className="bf-header-text" style={{ flexGrow: 1 }}><h1>{title}</h1></div>
        <div className="bf-ref-badge" style={{ textAlign: "right" }}>
          <span className="bf-ref-label">Reference #</span>
          <span className="bf-ref-value">{refNum}</span>
        </div>
      </div>
      <p className="bf-page-num">Page {page} of 3</p>
    </div>
  );
}


// ── success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ refNum }) {
  return (
    <div className="bf-success">
      <div className="bf-success-icon">✅</div>
      <h2 className="bf-success-title">Submission Received!</h2>
      <p className="bf-success-sub">
        Your buyout form has been sent to Yuranka Games. You'll receive a
        confirmation email at the address you provided.
      </p>
      <div className="bf-success-ref">
        <span className="bf-success-ref-label">Your Reference Number</span>
        <span className="bf-success-ref-value">{refNum}</span>
        <span className="bf-success-ref-hint">
          Write this on your envelope when you post your cards.
        </span>
      </div>
      <div className="bf-success-address">
        <strong>Post your cards to:</strong>
        <p>Yuranka Games</p>
        <p>Matīsa iela 25, Bērnu pasaule</p>
        <p>LV-1001 Riga, Latvia</p>
      </div>
      <p className="bf-success-questions">
        Questions? <strong>+371 27 460 885</strong> or <strong>support@yuranka.com</strong>
      </p>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
function BuyoutForm() {
  const [refNum] = useState(generateRef);
  const [fields, setFields] = useState({
    username: "", email: "", phone: "",
    date: today(), address: "",
    cardList: "", bulkCommons: "", bulkHolo: "", fullName: "",
  });
  const [checks, setChecks] = useState({
    c1: false, c2: false, c3: false, c4: false,
    c5: false, c6: false, c7: false,
    cBulk: false, cDisclaimer: false,
  });
  const [errors, setErrors]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const tog = (k) => (checked) =>
    setChecks((c) => ({ ...c, [k]: checked === true }));

  const handleSubmit = async () => {
    const errs = validate(fields, checks);
    setErrors(errs);
    if (errs.length > 0) return;

    setLoading(true);
    try {
      await makeRequestCall(SCRIPT_ID, ACTION, {
        reference_number: refNum,
        store_username:   fields.username,
        email_address:    fields.email,
        phone_number:     fields.phone,
        submission_date:  fields.date,
        home_address:     fields.address,
        card_list:        fields.cardList,
        bulk_commons:     fields.bulkCommons,
        bulk_holographic: fields.bulkHolo,
        full_name:        fields.fullName,
        // agreement flags
        agreed_store_credit:       checks.c1,
        agreed_50_percent:         checks.c2,
        agreed_price_lock:         checks.c3,
        agreed_reevaluation_fee:   checks.c4,
        agreed_market_changes:     checks.c5,
        agreed_shipping:           checks.c6,
        agreed_age:                checks.c7,
        agreed_bulk_pricing:       checks.cBulk,
        agreed_dont_buy_list:      checks.cDisclaimer,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors(["Something went wrong submitting your form. Please try again or contact support@yuranka.com."]);
    } finally {
      setLoading(false);
    }
  };

  // ── success state ──
  if (submitted) {
    return (
      <div className="bf-wrapper">
        <SuccessScreen refNum={refNum} />
      </div>
    );
  }

  // ── form ──
  return (
    <div className="bf-wrapper">

      {/* PAGE 1 */}
      <div className="bf-page">
        <PageHeader refNum={refNum} />

        <Notice type="warning">
          <strong>Important:</strong> We purchase singles at <strong>50%</strong> of current Cardmarket prices. Store credit only.
        </Notice>

        <div className="bf-qr-row">
          <div className="bf-qr-box"><img src = {qr_code} alt="QR Code" /></div>
          <div className="bf-qr-text">
            <h3>Create Your Personal Yuranka Account</h3>
            <p>Scan this QR code to set up your account and track store credit and submission status.</p>
          </div>
        </div>

        <SectionTitle>Customer Information</SectionTitle>
        <div className="bf-grid bf-grid--2">
          <Field id="username" label="Store Username *">
            <Input id="username" value={fields.username} onChange={set("username")} />
          </Field>
          <Field id="email" label="Email Address *">
            <Input id="email" type="email" value={fields.email} onChange={set("email")} />
          </Field>
        </div>
        <div className="bf-grid bf-grid--2">
          <Field id="phone" label="Phone Number">
            <Input id="phone" type="tel" value={fields.phone} onChange={set("phone")} />
          </Field>
          <Field id="submission-date" label="Submission Date (DD/MM/YYYY)">
            <Input id="submission-date" value={fields.date} onChange={set("date")} />
          </Field>
        </div>
        <div className="bf-grid bf-grid--1">
          <Field id="address" label="Home Address (For Card Delivery if Outside Riga)">
            <Input id="address" value={fields.address} onChange={set("address")} />
          </Field>
        </div>
        <div className="bf-address-note">
          <strong>Note:</strong> If outside Riga, provide a delivery address. Leave blank to pick up in-store.
        </div>

        <div className="bf-check-header">
          IMPORTANT: We only process submissions that have ALL boxes checked below.
        </div>
        <div className="bf-check-group">
          {[
            ["c1", "I understand that Yuranka Games provides store credit in exchange for the cards. *"],
            ["c2", "I understand that the estimated value is 50% of the card value on Cardmarket. *"],
            ["c3", "I understand that prices are ONLY locked after an agreed price has been finalized. Initial evaluation prices are not locked. *"],
            ["c4", "I understand that re-evaluation may incur an additional €0.33/card per cycle if I decline the offer (waived if I accept). *"],
            ["c5", "I understand that Yuranka Games may re-evaluate cards if there are drastic market changes. €0.33/card fee applies if I decline after 3 business days. *"],
            ["c6", "Shipping is covered within Latvia only. Outside Latvia is not covered by Yuranka Games. *"],
            ["c7", "I confirm that I am 18 years old or have the permission of a parent/guardian to trade these cards. *"],
          ].map(([key, text]) => (
            <CheckItem key={key} id={key} checked={checks[key]} onChange={tog(key)}>{text}</CheckItem>
          ))}
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="bf-page">
        <MiniHeader title="Card Details" refNum={refNum} page={2} />

        <Notice type="danger">
          <strong>Remember:</strong> If you do not accept our offer, a fee of €0.33 per card will be charged. Store credit credited on acceptance. You may always bargain! :)
        </Notice>

        <div className="bf-label" style={{ marginBottom: 6 }}>List of Cards I Would Like an Offer On</div>
        <div className="bf-card-note">
          <strong>Disclaimer:</strong> Only listed cards are evaluated at Cardmarket lowest. Unlisted cards are treated as bulk.
        </div>
        <Textarea
          id="card-list"
          className="min-h-72 resize-y"
          placeholder={"Example:\nCharizard ex / Scarlet & Violet / 1\nPikachu / Base Set / 2\n[Continue listing all cards...]"}
          value={fields.cardList}
          onChange={set("cardList")}
        />
        <div className="bf-card-note" style={{ marginTop: 8 }}>
          <strong>Tip:</strong> List as many cards as you like — they'll all be sent with your submission.
        </div>

        <SectionTitle style={{ marginTop: 20 }}>Bulk Cards Information</SectionTitle>
        <div className="bf-check-group" style={{ marginBottom: 14 }}>
          <CheckItem id="cBulk" checked={checks.cBulk} onChange={tog("cBulk")}>
            I understand that every unlisted card will be considered bulk: 1 cent/common, 3 cents/holographic or foil card. *
          </CheckItem>
        </div>
        <div className="bf-check-header">Quantity of Bulk Cards to be Submitted</div>
        <div className="bf-grid bf-grid--2" style={{ marginBottom: 20 }}>
          <Field id="bulk-commons" label="Commons (Non-holographic)">
            <Input id="bulk-commons" inputMode="numeric" value={fields.bulkCommons} onChange={set("bulkCommons")} />
          </Field>
          <Field id="bulk-holo" label="Holographic / Alt Arts">
            <Input id="bulk-holo" inputMode="numeric" value={fields.bulkHolo} onChange={set("bulkHolo")} />
          </Field>
        </div>
      </div>

      {/* PAGE 3 */}
      <div className="bf-page">
        <MiniHeader title="Disclaimers & Signature" refNum={refNum} page={3} />

        <SectionTitle>Cards We Do Not Buy</SectionTitle>
        <div className="bf-disclaimer-box">
          {[
            ["Pokémon", ["Code cards", "Common Energies", "Ad/Explanation cards"]],
            ["Star Wars Unlimited", ["Common Bases", "Common Leaders"]],
            ["MTG", ["Tokens/Clues", "Ad/Explanation cards"]],
            ["One Piece", ["Common Don cards", "Ad/Explanation cards"]],
            ["Flesh and Blood", ["Common Young Leaders", "Ad/Explanation cards"]],
            ["Riftbound: League of Legends", ["Ad/Explanation cards"]],
            ["We Do Not Currently Buy", ["Gundam cards", "Digimon cards"]],
          ].map(([game, items]) => (
            <div key={game} className="bf-disclaimer-row">
              <strong>{game}:</strong>
              <span>{items.join(", ")}</span>
            </div>
          ))}
        </div>

        <div className="bf-check-group" style={{ marginTop: 20, marginBottom: 24 }}>
          <CheckItem id="cDisclaimer" checked={checks.cDisclaimer} onChange={tog("cDisclaimer")}>
            I have read and agree to the above terms regarding cards we do not buy. *
          </CheckItem>
        </div>

        <SectionTitle>Signature</SectionTitle>
        <Field id="full-name" label="Full Name (Legal Signature) *">
          <Input
            id="full-name"
            placeholder="Type your full name here"
            value={fields.fullName}
            onChange={set("fullName")}
          />
        </Field>

        {errors.length > 0 && (
          <div className="bf-errors">
            <strong>Please fix the following before submitting:</strong>
            <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

        <div className="bf-submit-row">
          <Button
            size="lg"
            className="bf-submit-btn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting…" : "Submit Form →"}
          </Button>
          {!loading && (
            <span className="bf-submit-hint">
              We'll email you a confirmation with your reference number.
            </span>
          )}
        </div>
      </div>

    </div>
  );
}

export default BuyoutForm;
