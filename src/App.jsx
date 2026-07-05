import React, { useState, useMemo } from "react";
import {
  Search, ShieldCheck, Star, CheckCircle2, Clock, MapPin, Phone, User,
  Calendar, ChevronRight, ChevronLeft, Wallet, TrendingUp, ClipboardList,
  Users, AlertTriangle, BadgeCheck, X, Check, Wind, Sparkles, Zap,
  Scissors, Truck, Wrench, Home, ListChecks, PieChart, Layers, Send, Play, Flag
} from "lucide-react";

/* ---------------------------------------------------------------------------
   LaoCare — Trusted Services. One Tap Away.
   Clickable partner-demo prototype. All data lives in React state (in-memory).
   Text strings are centralized in T so a Lao translation can be added later.
--------------------------------------------------------------------------- */

const T = {
  appName: "LaoCare",
  tagline: "Trusted Services. One Tap Away.",
  sub: "Verified local service providers across Vientiane",
};

const COLORS = {
  blue: "#1B6FE0",
  blueDark: "#0E3A7A",
  green: "#23A455",
  yellow: "#F5B921",
  bg: "#F4F7FB",
  ink: "#12263F",
};

const STATUSES = [
  "New Request",
  "Waiting for Provider",
  "Provider Accepted",
  "Quotation Sent",
  "Confirmed",
  "In Progress",
  "Completed",
];

const CATEGORIES = [
  { id: "ac", name: "AC Cleaning & Repair", icon: Wind, color: "#1B6FE0", tint: "#E7F0FD" },
  { id: "clean", name: "Home Cleaning", icon: Sparkles, color: "#23A455", tint: "#E6F6EC" },
  { id: "power", name: "Electrical & Plumbing", icon: Zap, color: "#F5B921", tint: "#FDF4DC" },
  { id: "beauty", name: "Salon & Beauty", icon: Scissors, color: "#D65DB1", tint: "#FBEAF5" },
  { id: "move", name: "Moving & Worker Help", icon: Truck, color: "#0E9AA7", tint: "#E3F5F6" },
  { id: "appliance", name: "Appliance Repair", icon: Wrench, color: "#7C5CDB", tint: "#EFEAFB" },
];

const SERVICE_TYPES = {
  ac: ["AC Cleaning", "AC Repair", "AC Installation", "Gas Refill"],
  clean: ["Regular Cleaning", "Deep Cleaning", "Move-out Cleaning", "Sofa & Carpet"],
  power: ["Electrical Repair", "Plumbing Repair", "Wiring Check", "Water Heater"],
  beauty: ["Hair at Home", "Nails at Home", "Makeup", "Massage"],
  move: ["House Moving", "Office Moving", "Daily Workers", "Furniture Lift"],
  appliance: ["Washing Machine", "Refrigerator", "TV Repair", "Microwave & Oven"],
};

const INITIAL_PROVIDERS = [
  { id: 1, name: "Vientiane AC Pro", cat: "ac", rating: 4.8, jobs: 128, area: "Chanthabouly · Sikhottabong", approved: true },
  { id: 2, name: "CleanHome Laos", cat: "clean", rating: 4.7, jobs: 96, area: "All Vientiane Capital", approved: true },
  { id: 3, name: "PowerFix VTE", cat: "power", rating: 4.9, jobs: 74, area: "Xaysetha · Saysettha", approved: true },
  { id: 4, name: "BeautyGo Laos", cat: "beauty", rating: 4.8, jobs: 110, area: "All Vientiane Capital", approved: true },
  { id: 5, name: "MoveMate VTE", cat: "move", rating: 4.6, jobs: 65, area: "Vientiane + Nearby", approved: true },
  { id: 6, name: "HomeTech Laos", cat: "appliance", rating: 4.7, jobs: 82, area: "Sisattanak · Hadxaifong", approved: true },
  { id: 7, name: "AirCool Mekong", cat: "ac", rating: null, jobs: 0, area: "Sikhottabong", approved: false },
  { id: 8, name: "Sabai Clean Team", cat: "clean", rating: null, jobs: 0, area: "Naxaithong", approved: false },
];

const POPULAR = [
  { label: "AC Cleaning", cat: "ac", price: "150,000–300,000 LAK" },
  { label: "Deep Cleaning", cat: "clean", price: "from 400,000 LAK" },
  { label: "Plumbing Repair", cat: "power", price: "from 120,000 LAK" },
  { label: "Hair at Home", cat: "beauty", price: "from 100,000 LAK" },
];

const INITIAL_BOOKINGS = [
  {
    id: "LC-1042",
    customer: "Mr. Somchai",
    phone: "020 5555 1234",
    cat: "ac",
    serviceType: "AC Cleaning",
    location: "Sikhottabong, Vientiane",
    date: "Tomorrow",
    time: "10:00 AM",
    urgent: false,
    description: "2 wall units, not cooling well. Please bring ladder.",
    budget: 250000,
    status: "New Request",
    providerId: 1,
    quote: null,
    rating: null,
    createdToday: true,
  },
  {
    id: "LC-1039",
    customer: "Ms. Chanthala",
    phone: "020 9876 5544",
    cat: "clean",
    serviceType: "Deep Cleaning",
    location: "Xaysetha, Vientiane",
    date: "Today",
    time: "2:00 PM",
    urgent: true,
    description: "3-bedroom house before family visit.",
    budget: 550000,
    status: "In Progress",
    providerId: 2,
    quote: 520000,
    rating: null,
    createdToday: true,
  },
  {
    id: "LC-1031",
    customer: "Mr. Khamla",
    phone: "020 5511 8899",
    cat: "power",
    serviceType: "Water Heater",
    location: "Sisattanak, Vientiane",
    date: "Last Friday",
    time: "9:00 AM",
    urgent: false,
    description: "Replace old water heater in bathroom.",
    budget: 800000,
    status: "Completed",
    providerId: 3,
    quote: 760000,
    rating: 5,
    createdToday: false,
  },
];

const fmtLAK = (n) => (n == null ? "—" : n.toLocaleString("en-US") + " LAK");
const catById = (id) => CATEGORIES.find((c) => c.id === id);

/* ----------------------------- shared UI ------------------------------ */

function BrandMark({ size = 34 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.32, position: "relative",
      background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.green})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 10px rgba(27,111,224,0.25)",
    }}>
      <Check size={size * 0.58} color="#fff" strokeWidth={3.2} />
    </div>
  );
}

function Chip({ children, tone = "blue" }) {
  const map = {
    blue: { bg: "#E7F0FD", fg: COLORS.blue },
    green: { bg: "#E6F6EC", fg: COLORS.green },
    yellow: { bg: "#FDF4DC", fg: "#9A7208" },
    gray: { bg: "#EEF1F6", fg: "#5A6B84" },
    red: { bg: "#FDEAEA", fg: "#C43D3D" },
  };
  const c = map[tone] || map.blue;
  return (
    <span style={{
      background: c.bg, color: c.fg, fontSize: 11.5, fontWeight: 700,
      padding: "3px 9px", borderRadius: 999, whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>{children}</span>
  );
}

function statusTone(s) {
  if (s === "Completed") return "green";
  if (s === "In Progress" || s === "Confirmed") return "blue";
  if (s === "Quotation Sent") return "yellow";
  if (s === "Rejected") return "red";
  return "gray";
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 16, padding: 16,
      boxShadow: "0 1px 3px rgba(18,38,63,0.06), 0 6px 18px rgba(18,38,63,0.05)",
      cursor: onClick ? "pointer" : "default", ...style,
    }}>{children}</div>
  );
}

function Btn({ children, tone = "blue", onClick, full, small, disabled }) {
  const bg = { blue: COLORS.blue, green: COLORS.green, yellow: COLORS.yellow, ghost: "#fff", danger: "#fff" }[tone];
  const fg = { blue: "#fff", green: "#fff", yellow: "#3B2F05", ghost: COLORS.blue, danger: "#C43D3D" }[tone];
  const border = tone === "ghost" ? `1.5px solid ${COLORS.blue}` : tone === "danger" ? "1.5px solid #EFCACA" : "none";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#D8DFE9" : bg, color: disabled ? "#8A97A8" : fg, border,
      borderRadius: 12, padding: small ? "8px 14px" : "12px 18px",
      fontSize: small ? 13 : 15, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      width: full ? "100%" : undefined, display: "inline-flex", alignItems: "center",
      justifyContent: "center", gap: 6, fontFamily: "inherit",
    }}>{children}</button>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4A5B74", marginBottom: 6 }}>{label}</div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "11px 12px", fontSize: 15,
  border: "1.5px solid #DCE3EE", borderRadius: 12, background: "#fff",
  color: COLORS.ink, outline: "none", fontFamily: "inherit",
};

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "22px 2px 10px" }}>
      <h3 style={{ margin: 0, fontSize: 16.5, fontWeight: 800, color: COLORS.ink }}>{children}</h3>
      {action}
    </div>
  );
}

function Stars({ value, onChange, size = 22 }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} onClick={onChange ? () => onChange(n) : undefined}
          style={{ cursor: onChange ? "pointer" : "default" }}
          color={n <= (value || 0) ? COLORS.yellow : "#D8DFE9"}
          fill={n <= (value || 0) ? COLORS.yellow : "none"} />
      ))}
    </div>
  );
}

/* -------------------------- status timeline --------------------------- */

function StatusTimeline({ status }) {
  const idx = STATUSES.indexOf(status);
  return (
    <div style={{ marginTop: 6 }}>
      {STATUSES.map((s, i) => {
        const done = i < idx, current = i === idx;
        return (
          <div key={s} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: done || current ? (current ? COLORS.blue : COLORS.green) : "#E7ECF4",
                boxShadow: current ? "0 0 0 5px #E7F0FD" : "none",
              }}>
                {done ? <Check size={14} color="#fff" strokeWidth={3} />
                  : current ? <Clock size={13} color="#fff" />
                  : <div style={{ width: 7, height: 7, borderRadius: 99, background: "#B9C4D4" }} />}
              </div>
              {i < STATUSES.length - 1 && (
                <div style={{ width: 2.5, flex: 1, minHeight: 18, background: done ? COLORS.green : "#E7ECF4" }} />
              )}
            </div>
            <div style={{ paddingBottom: 14, paddingTop: 3 }}>
              <div style={{ fontSize: 14, fontWeight: current ? 800 : 600, color: current ? COLORS.blue : done ? COLORS.ink : "#93A1B5" }}>
                {s}
              </div>
              {current && <div style={{ fontSize: 12, color: "#7A8AA0" }}>Current step</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================ CUSTOMER ================================ */

function CustomerHome({ providers, onBook, onMyBookings, bookings }) {
  const [q, setQ] = useState("");
  const verified = providers.filter((p) => p.approved);
  const active = bookings.filter((b) => b.status !== "Completed" && b.status !== "Rejected").length;

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(140deg, ${COLORS.blueDark} 0%, ${COLORS.blue} 55%, ${COLORS.green} 130%)`,
        borderRadius: 20, padding: "22px 18px", color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: 99, background: "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark size={38} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 0.2 }}>
              Lao<span style={{ color: "#9FE6B8" }}>Care</span>
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.9 }}>{T.tagline}</div>
          </div>
        </div>
        <div style={{ fontSize: 13, marginTop: 12, opacity: 0.92 }}>{T.sub}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <Chip tone="green"><ShieldCheck size={12} /> Verified providers</Chip>
          <Chip tone="yellow"><Zap size={12} /> Fast response</Chip>
          <Chip tone="blue"><CheckCircle2 size={12} /> Safe booking</Chip>
        </div>
        {/* Search */}
        <div style={{
          marginTop: 14, background: "#fff", borderRadius: 14, display: "flex",
          alignItems: "center", padding: "11px 12px", gap: 8,
        }}>
          <Search size={18} color="#7A8AA0" />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="What do you need? e.g. AC cleaning"
            style={{ border: "none", outline: "none", fontSize: 15, flex: 1, color: COLORS.ink, fontFamily: "inherit", background: "transparent" }} />
        </div>
      </div>

      {active > 0 && (
        <Card onClick={onMyBookings} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#E7F0FD", borderRadius: 12, padding: 10 }}>
            <ClipboardList size={20} color={COLORS.blue} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>You have {active} active booking{active > 1 ? "s" : ""}</div>
            <div style={{ fontSize: 12.5, color: "#7A8AA0" }}>Tap to view status</div>
          </div>
          <ChevronRight size={18} color="#93A1B5" />
        </Card>
      )}

      {/* Categories */}
      <SectionTitle>Service categories</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
        {CATEGORIES.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())).map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.id} onClick={() => onBook(c.id)} style={{ padding: 14 }}>
              <div style={{ background: c.tint, width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={21} color={c.color} />
              </div>
              <div style={{ fontWeight: 750, fontSize: 13.5, marginTop: 10, color: COLORS.ink, lineHeight: 1.3 }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: COLORS.blue, fontWeight: 700, marginTop: 5, display: "flex", alignItems: "center", gap: 2 }}>
                Book now <ChevronRight size={13} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Popular */}
      <SectionTitle>Popular this week</SectionTitle>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
        {POPULAR.map((p) => {
          const c = catById(p.cat), Icon = c.icon;
          return (
            <Card key={p.label} onClick={() => onBook(p.cat, p.label)} style={{ minWidth: 168, padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ background: c.tint, borderRadius: 10, padding: 7 }}><Icon size={16} color={c.color} /></div>
                <Chip tone="yellow"><TrendingUp size={11} /> Popular</Chip>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 10, color: COLORS.ink }}>{p.label}</div>
              <div style={{ fontSize: 12, color: "#7A8AA0", marginTop: 3 }}>{p.price}</div>
            </Card>
          );
        })}
      </div>

      {/* Verified providers */}
      <SectionTitle>Verified providers</SectionTitle>
      {verified.map((p) => {
        const c = catById(p.cat);
        return (
          <Card key={p.id} onClick={() => onBook(p.cat)} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, background: c.tint, color: c.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17,
            }}>{p.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{p.name}</span>
                <Chip tone="green"><BadgeCheck size={11} /> Verified</Chip>
              </div>
              <div style={{ fontSize: 12.5, color: "#7A8AA0", marginTop: 3 }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: "#4A5B74", marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span><Star size={12} color={COLORS.yellow} fill={COLORS.yellow} style={{ verticalAlign: -1 }} /> {p.rating}</span>
                <span>{p.jobs} jobs done</span>
              </div>
            </div>
            <ChevronRight size={18} color="#93A1B5" />
          </Card>
        );
      })}
    </div>
  );
}

function BookingForm({ presetCat, presetType, onSubmit, onBack }) {
  const [form, setForm] = useState({
    cat: presetCat || "ac",
    serviceType: presetType || "",
    customer: "", phone: "", location: "",
    date: "", time: "", urgent: false, description: "", budget: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const types = SERVICE_TYPES[form.cat] || [];
  const ready = form.serviceType && form.customer && form.phone && form.location && form.date && form.time;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.blue, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 3, cursor: "pointer", padding: 0, marginBottom: 10, fontFamily: "inherit" }}>
        <ChevronLeft size={17} /> Back to home
      </button>
      <h2 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 800, color: COLORS.ink }}>Book a service</h2>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#7A8AA0" }}>
        A verified provider will respond quickly with a quotation.
      </p>
      <Card>
        <Field label="Service category">
          <select style={inputStyle} value={form.cat} onChange={(e) => { set("cat", e.target.value); set("serviceType", ""); }}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Service type">
          <select style={inputStyle} value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)}>
            <option value="">Select a service…</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Your name">
          <input style={inputStyle} placeholder="e.g. Mr. Somchai" value={form.customer} onChange={(e) => set("customer", e.target.value)} />
        </Field>
        <Field label="Phone number">
          <input style={inputStyle} placeholder="020 xxxx xxxx" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Location (village / district, Vientiane)">
          <input style={inputStyle} placeholder="e.g. Sikhottabong, Vientiane" value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Preferred date">
            <input style={inputStyle} type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
          <Field label="Preferred time">
            <input style={inputStyle} type="time" value={form.time} onChange={(e) => set("time", e.target.value)} />
          </Field>
        </div>
        <Field label="Service speed">
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: false, l: "Normal" }, { v: true, l: "Urgent (today)" }].map((o) => (
              <button key={o.l} onClick={() => set("urgent", o.v)} style={{
                flex: 1, padding: "11px 8px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                border: form.urgent === o.v ? `2px solid ${o.v ? COLORS.yellow : COLORS.blue}` : "1.5px solid #DCE3EE",
                background: form.urgent === o.v ? (o.v ? "#FDF4DC" : "#E7F0FD") : "#fff",
                color: form.urgent === o.v ? (o.v ? "#9A7208" : COLORS.blue) : "#5A6B84",
              }}>{o.l}</button>
            ))}
          </div>
        </Field>
        <Field label="Problem description">
          <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            placeholder="Describe the problem or the work you need…"
            value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Estimated budget (LAK)">
          <input style={inputStyle} type="number" placeholder="e.g. 250000" value={form.budget} onChange={(e) => set("budget", e.target.value)} />
        </Field>
        <Btn full tone="green" disabled={!ready} onClick={() => onSubmit(form)}>
          <ShieldCheck size={17} /> Confirm safe booking
        </Btn>
        {!ready && <div style={{ fontSize: 12, color: "#93A1B5", textAlign: "center", marginTop: 8 }}>
          Fill in service, name, phone, location, date and time to continue.
        </div>}
      </Card>
    </div>
  );
}

function BookingConfirmed({ booking, onViewStatus, onHome }) {
  return (
    <Card style={{ textAlign: "center", padding: 28 }}>
      <div style={{
        width: 66, height: 66, borderRadius: 99, margin: "0 auto 14px",
        background: "#E6F6EC", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CheckCircle2 size={34} color={COLORS.green} />
      </div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORS.ink }}>Booking confirmed</h2>
      <p style={{ fontSize: 14, color: "#5A6B84", margin: "8px 0 4px" }}>
        Booking <b>{booking.id}</b> was created. A verified provider will contact you shortly.
      </p>
      <p style={{ fontSize: 13, color: "#7A8AA0", margin: "0 0 18px" }}>
        {booking.serviceType} · {booking.date} at {booking.time}
      </p>
      <Btn full onClick={onViewStatus}><ListChecks size={16} /> Track booking status</Btn>
      <div style={{ height: 8 }} />
      <Btn full tone="ghost" onClick={onHome}><Home size={16} /> Back to home</Btn>
    </Card>
  );
}

function MyBookings({ bookings, providers, onBack, onConfirmQuote, onRate }) {
  const [open, setOpen] = useState(bookings.length ? bookings[0].id : null);
  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: COLORS.blue, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 3, cursor: "pointer", padding: 0, marginBottom: 10, fontFamily: "inherit" }}>
        <ChevronLeft size={17} /> Back to home
      </button>
      <h2 style={{ margin: "0 0 14px", fontSize: 21, fontWeight: 800, color: COLORS.ink }}>My bookings</h2>
      {bookings.length === 0 && (
        <Card style={{ textAlign: "center", color: "#7A8AA0", fontSize: 14 }}>
          No bookings yet. Choose a service category on the home page to create your first booking.
        </Card>
      )}
      {bookings.map((b) => {
        const c = catById(b.cat);
        const prov = providers.find((p) => p.id === b.providerId);
        const isOpen = open === b.id;
        return (
          <Card key={b.id} style={{ marginBottom: 12 }}>
            <div onClick={() => setOpen(isOpen ? null : b.id)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ background: c.tint, borderRadius: 12, padding: 9 }}>
                {React.createElement(c.icon, { size: 19, color: c.color })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{b.serviceType} <span style={{ color: "#93A1B5", fontWeight: 600, fontSize: 12.5 }}>· {b.id}</span></div>
                <div style={{ fontSize: 12.5, color: "#7A8AA0" }}>{b.date} at {b.time} · {b.location}</div>
              </div>
              <Chip tone={statusTone(b.status)}>{b.status}</Chip>
            </div>
            {isOpen && (
              <div style={{ marginTop: 14, borderTop: "1px solid #EEF1F6", paddingTop: 14 }}>
                {prov && (
                  <div style={{ fontSize: 13.5, color: "#4A5B74", marginBottom: 10, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <BadgeCheck size={15} color={COLORS.green} /> Provider: <b>{prov.name}</b>
                    {prov.rating && <span>· <Star size={12} color={COLORS.yellow} fill={COLORS.yellow} style={{ verticalAlign: -1 }} /> {prov.rating}</span>}
                  </div>
                )}
                {b.quote != null && (
                  <div style={{ background: "#FDF4DC", borderRadius: 12, padding: "10px 12px", fontSize: 14, color: "#6B5407", fontWeight: 700, marginBottom: 12 }}>
                    Quotation: {fmtLAK(b.quote)}
                    {b.status === "Quotation Sent" && (
                      <div style={{ marginTop: 10 }}>
                        <Btn small tone="green" onClick={() => onConfirmQuote(b.id)}><Check size={14} /> Accept quotation & confirm</Btn>
                      </div>
                    )}
                  </div>
                )}
                <StatusTimeline status={b.status} />
                {b.status === "Completed" && (
                  <div style={{ marginTop: 6, background: "#F7F9FC", borderRadius: 12, padding: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.ink, marginBottom: 8 }}>
                      {b.rating ? "Thanks for your rating!" : "How was the service?"}
                    </div>
                    <Stars value={b.rating} onChange={b.rating ? null : (n) => onRate(b.id, n)} />
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function CustomerApp({ bookings, providers, addBooking, updateBooking }) {
  const [view, setView] = useState("home");
  const [preset, setPreset] = useState({});
  const [lastId, setLastId] = useState(null);

  const submit = (form) => {
    const id = addBooking(form);
    setLastId(id);
    setView("confirmed");
  };

  if (view === "book") return <BookingForm presetCat={preset.cat} presetType={preset.type} onBack={() => setView("home")} onSubmit={submit} />;
  if (view === "confirmed") {
    const b = bookings.find((x) => x.id === lastId);
    return <BookingConfirmed booking={b} onViewStatus={() => setView("bookings")} onHome={() => setView("home")} />;
  }
  if (view === "bookings") return (
    <MyBookings bookings={bookings} providers={providers} onBack={() => setView("home")}
      onConfirmQuote={(id) => updateBooking(id, { status: "Confirmed" })}
      onRate={(id, n) => updateBooking(id, { rating: n })} />
  );
  return (
    <CustomerHome providers={providers} bookings={bookings}
      onBook={(cat, type) => { setPreset({ cat, type }); setView("book"); }}
      onMyBookings={() => setView("bookings")} />
  );
}

/* ============================ PROVIDER ================================ */

const COMMISSION = 0.15;

function ProviderApp({ bookings, providers, updateBooking }) {
  const me = providers[0]; // demo: logged in as Vientiane AC Pro
  const c = catById(me.cat);
  const myJobs = bookings.filter((b) => b.providerId === me.id && b.status !== "Rejected");
  const incoming = myJobs.filter((b) => ["New Request", "Waiting for Provider"].includes(b.status));
  const activeJobs = myJobs.filter((b) => ["Provider Accepted", "Quotation Sent", "Confirmed", "In Progress"].includes(b.status));
  const completed = myJobs.filter((b) => b.status === "Completed");
  const [quoting, setQuoting] = useState(null);
  const [quoteVal, setQuoteVal] = useState("");

  const gross = completed.reduce((s, b) => s + (b.quote || b.budget || 0), 0) + 18450000; // + prior month demo history
  const commission = Math.round(gross * COMMISSION);
  const net = gross - commission;

  const JobCard = ({ b, actions }) => (
    <Card style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{b.serviceType} <span style={{ color: "#93A1B5", fontWeight: 600, fontSize: 12.5 }}>· {b.id}</span></div>
        <div style={{ display: "flex", gap: 6 }}>
          {b.urgent && <Chip tone="yellow"><Zap size={11} /> Urgent</Chip>}
          <Chip tone={statusTone(b.status)}>{b.status}</Chip>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#4A5B74", marginTop: 8, display: "grid", gap: 4 }}>
        <span><User size={13} style={{ verticalAlign: -2 }} /> {b.customer} · <Phone size={13} style={{ verticalAlign: -2 }} /> {b.phone}</span>
        <span><MapPin size={13} style={{ verticalAlign: -2 }} /> {b.location}</span>
        <span><Calendar size={13} style={{ verticalAlign: -2 }} /> {b.date} at {b.time} · Budget {fmtLAK(b.budget)}</span>
      </div>
      {b.description && <div style={{ fontSize: 13, color: "#7A8AA0", marginTop: 8, background: "#F7F9FC", borderRadius: 10, padding: "8px 10px" }}>"{b.description}"</div>}
      {b.quote != null && <div style={{ fontSize: 13.5, fontWeight: 800, color: "#9A7208", marginTop: 8 }}>Your quotation: {fmtLAK(b.quote)}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>{actions}</div>
      {quoting === b.id && (
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <input style={{ ...inputStyle, flex: 1 }} type="number" placeholder="Quotation amount (LAK)" value={quoteVal} onChange={(e) => setQuoteVal(e.target.value)} />
          <Btn small tone="green" disabled={!quoteVal} onClick={() => {
            updateBooking(b.id, { quote: Number(quoteVal), status: "Quotation Sent" });
            setQuoting(null); setQuoteVal("");
          }}><Send size={14} /> Send</Btn>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      {/* Profile */}
      <Card style={{ background: `linear-gradient(140deg, ${COLORS.blueDark}, ${COLORS.blue})`, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20 }}>
            {me.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 17 }}>{me.name}</span>
              <Chip tone="green"><BadgeCheck size={11} /> Verified Provider</Chip>
            </div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 3 }}>{c.name}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
          {[
            { l: "Rating", v: <span><Star size={13} color={COLORS.yellow} fill={COLORS.yellow} style={{ verticalAlign: -1.5 }} /> {me.rating}</span> },
            { l: "Jobs done", v: me.jobs + completed.length - 1 },
            { l: "Service area", v: me.area.split("·")[0].trim() },
          ].map((s) => (
            <div key={s.l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "9px 10px" }}>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{s.l}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Income */}
      <SectionTitle>Income summary — this month</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        {[
          { l: "Completed jobs", v: completed.length + 21, icon: CheckCircle2, color: COLORS.green, tint: "#E6F6EC" },
          { l: "Gross income", v: fmtLAK(gross), icon: TrendingUp, color: COLORS.blue, tint: "#E7F0FD" },
          { l: "LaoCare commission (15%)", v: "− " + fmtLAK(commission), icon: PieChart, color: "#9A7208", tint: "#FDF4DC" },
          { l: "Net payout", v: fmtLAK(net), icon: Wallet, color: COLORS.green, tint: "#E6F6EC" },
        ].map((s) => (
          <Card key={s.l} style={{ padding: 14 }}>
            <div style={{ background: s.tint, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {React.createElement(s.icon, { size: 17, color: s.color })}
            </div>
            <div style={{ fontSize: 11.5, color: "#7A8AA0", marginTop: 8, fontWeight: 600 }}>{s.l}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.ink, marginTop: 2 }}>{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Incoming */}
      <SectionTitle>Incoming job requests {incoming.length > 0 && <Chip tone="yellow">{incoming.length} new</Chip>}</SectionTitle>
      {incoming.length === 0 && <Card style={{ color: "#7A8AA0", fontSize: 13.5, textAlign: "center" }}>No new requests right now. New customer bookings will appear here.</Card>}
      {incoming.map((b) => (
        <JobCard key={b.id} b={b} actions={<>
          <Btn small tone="green" onClick={() => updateBooking(b.id, { status: "Provider Accepted", providerId: me.id })}><Check size={14} /> Accept job</Btn>
          <Btn small tone="danger" onClick={() => updateBooking(b.id, { status: "Rejected" })}><X size={14} /> Reject</Btn>
        </>} />
      ))}

      {/* Active */}
      <SectionTitle>Active jobs</SectionTitle>
      {activeJobs.length === 0 && <Card style={{ color: "#7A8AA0", fontSize: 13.5, textAlign: "center" }}>No active jobs.</Card>}
      {activeJobs.map((b) => (
        <JobCard key={b.id} b={b} actions={<>
          {b.status === "Provider Accepted" && <Btn small tone="yellow" onClick={() => { setQuoting(b.id); setQuoteVal(String(b.budget || "")); }}><Send size={14} /> Send quotation</Btn>}
          {b.status === "Quotation Sent" && <Chip tone="gray"><Clock size={11} /> Waiting for customer to confirm</Chip>}
          {b.status === "Confirmed" && <Btn small onClick={() => updateBooking(b.id, { status: "In Progress" })}><Play size={14} /> Start job</Btn>}
          {b.status === "In Progress" && <Btn small tone="green" onClick={() => updateBooking(b.id, { status: "Completed" })}><Flag size={14} /> Mark completed</Btn>}
        </>} />
      ))}

      {/* Completed */}
      <SectionTitle>Recently completed</SectionTitle>
      {completed.map((b) => (
        <Card key={b.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle2 size={20} color={COLORS.green} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: COLORS.ink }}>{b.serviceType} · {b.customer}</div>
            <div style={{ fontSize: 12.5, color: "#7A8AA0" }}>{fmtLAK(b.quote || b.budget)} · {b.rating ? "Rated" : "Awaiting rating"}</div>
          </div>
          {b.rating && <Stars value={b.rating} size={14} />}
        </Card>
      ))}
    </div>
  );
}

/* ============================== ADMIN ================================= */

function AdminApp({ bookings, providers, updateBooking, setProviders }) {
  const [tab, setTab] = useState("overview");
  const [cats, setCats] = useState(CATEGORIES.map((c) => ({ ...c, active: true })));

  const todays = bookings.filter((b) => b.createdToday).length;
  const pending = bookings.filter((b) => ["New Request", "Waiting for Provider"].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "Completed");
  const totalValue = bookings.reduce((s, b) => s + (b.quote || b.budget || 0), 0);
  const commission = Math.round(completed.reduce((s, b) => s + (b.quote || b.budget || 0), 0) * COMMISSION);
  const pendingProviders = providers.filter((p) => !p.approved);

  const tabs = [
    { id: "overview", l: "Overview", icon: Layers },
    { id: "bookings", l: "Bookings", icon: ClipboardList },
    { id: "providers", l: "Providers", icon: Users },
    { id: "categories", l: "Categories", icon: ListChecks },
    { id: "finance", l: "Finance", icon: PieChart },
  ];

  const StatCard = ({ label, value, icon: Icon, color, tint, sub }) => (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ background: tint, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color={color} />
        </div>
      </div>
      <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.ink, marginTop: 10 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#7A8AA0", fontWeight: 600, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#93A1B5", marginTop: 2 }}>{sub}</div>}
    </Card>
  );

  return (
    <div>
      <h2 style={{ margin: "2px 0 2px", fontSize: 21, fontWeight: 800, color: COLORS.ink }}>Admin dashboard</h2>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "#7A8AA0" }}>LaoCare operations · Vientiane Capital</p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 6 }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 13px", borderRadius: 999,
            border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", fontFamily: "inherit",
            background: tab === t.id ? COLORS.blueDark : "#fff", color: tab === t.id ? "#fff" : "#5A6B84",
            boxShadow: tab === t.id ? "none" : "0 1px 3px rgba(18,38,63,0.08)",
          }}>
            <t.icon size={14} /> {t.l}
            {t.id === "providers" && pendingProviders.length > 0 && (
              <span style={{ background: COLORS.yellow, color: "#3B2F05", borderRadius: 99, fontSize: 11, padding: "1px 6px" }}>{pendingProviders.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          <StatCard label="Today's bookings" value={todays} icon={Calendar} color={COLORS.blue} tint="#E7F0FD" />
          <StatCard label="Pending requests" value={pending} icon={Clock} color="#9A7208" tint="#FDF4DC" />
          <StatCard label="Completed jobs" value={completed.length} icon={CheckCircle2} color={COLORS.green} tint="#E6F6EC" />
          <StatCard label="Total service value" value={fmtLAK(totalValue)} icon={TrendingUp} color={COLORS.blue} tint="#E7F0FD" />
          <StatCard label="LaoCare commission" value={fmtLAK(commission)} icon={PieChart} color={COLORS.green} tint="#E6F6EC" sub="15% of completed jobs" />
          <StatCard label="Pending provider approvals" value={pendingProviders.length} icon={Users} color="#9A7208" tint="#FDF4DC" />
          <StatCard label="Complaints" value={1} icon={AlertTriangle} color="#C43D3D" tint="#FDEAEA" sub="1 open · response due today" />
        </div>
      )}

      {tab === "bookings" && (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", fontWeight: 800, fontSize: 15, color: COLORS.ink, borderBottom: "1px solid #EEF1F6" }}>
            Booking management
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 620 }}>
              <thead>
                <tr style={{ background: "#F7F9FC", color: "#5A6B84", textAlign: "left" }}>
                  {["ID", "Customer", "Service", "Location", "Value", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", fontWeight: 700, fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderTop: "1px solid #EEF1F6" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: COLORS.blue }}>{b.id}</td>
                    <td style={{ padding: "10px 12px" }}>{b.customer}</td>
                    <td style={{ padding: "10px 12px" }}>{b.serviceType}</td>
                    <td style={{ padding: "10px 12px", color: "#7A8AA0" }}>{b.location}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>{fmtLAK(b.quote || b.budget)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <select value={b.status} onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                        style={{ ...inputStyle, padding: "7px 8px", fontSize: 12.5, width: 175 }}>
                        {[...STATUSES, "Rejected"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "providers" && (
        <div>
          <SectionTitle>Pending approval</SectionTitle>
          {pendingProviders.length === 0 && <Card style={{ color: "#7A8AA0", fontSize: 13.5, textAlign: "center" }}>No providers waiting for approval.</Card>}
          {pendingProviders.map((p) => (
            <Card key={p.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "#FDF4DC", color: "#9A7208", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{p.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: "#7A8AA0" }}>{catById(p.cat).name} · {p.area}</div>
                </div>
                <Chip tone="yellow">Pending</Chip>
              </div>
              <div style={{ fontSize: 12.5, color: "#4A5B74", marginTop: 10, background: "#F7F9FC", borderRadius: 10, padding: "8px 10px" }}>
                Documents submitted: business ID ✓ · phone verified ✓ · service photos ✓
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn small tone="green" onClick={() => setProviders((ps) => ps.map((x) => x.id === p.id ? { ...x, approved: true, rating: 4.5 } : x))}>
                  <BadgeCheck size={14} /> Approve & verify
                </Btn>
                <Btn small tone="danger" onClick={() => setProviders((ps) => ps.filter((x) => x.id !== p.id))}>
                  <X size={14} /> Reject
                </Btn>
              </div>
            </Card>
          ))}
          <SectionTitle>Verified providers</SectionTitle>
          {providers.filter((p) => p.approved).map((p) => (
            <Card key={p.id} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
              <BadgeCheck size={18} color={COLORS.green} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 750, fontSize: 14, color: COLORS.ink }}>{p.name}</span>
                <span style={{ fontSize: 12.5, color: "#7A8AA0" }}> · {catById(p.cat).name}</span>
              </div>
              <span style={{ fontSize: 12.5, color: "#4A5B74", fontWeight: 700 }}>
                <Star size={12} color={COLORS.yellow} fill={COLORS.yellow} style={{ verticalAlign: -1 }} /> {p.rating ?? "New"}
              </span>
            </Card>
          ))}
        </div>
      )}

      {tab === "categories" && (
        <div>
          <SectionTitle>Category management</SectionTitle>
          {cats.map((c) => (
            <Card key={c.id} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
              <div style={{ background: c.tint, borderRadius: 10, padding: 8 }}>{React.createElement(c.icon, { size: 17, color: c.color })}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 750, fontSize: 14, color: COLORS.ink }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#93A1B5" }}>{c.active ? "Visible to customers" : "Hidden"}</div>
              </div>
              <button onClick={() => setCats((cs) => cs.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))} style={{
                width: 46, height: 26, borderRadius: 99, border: "none", cursor: "pointer", position: "relative",
                background: c.active ? COLORS.green : "#D8DFE9", transition: "background .15s",
              }}>
                <span style={{
                  position: "absolute", top: 3, left: c.active ? 23 : 3, width: 20, height: 20,
                  borderRadius: 99, background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </Card>
          ))}
        </div>
      )}

      {tab === "finance" && (
        <div>
          <SectionTitle>Financial report — this month</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
            <StatCard label="Completed job value" value={fmtLAK(completed.reduce((s, b) => s + (b.quote || b.budget || 0), 0))} icon={CheckCircle2} color={COLORS.green} tint="#E6F6EC" />
            <StatCard label="LaoCare commission (15%)" value={fmtLAK(commission)} icon={PieChart} color={COLORS.blue} tint="#E7F0FD" />
            <StatCard label="Membership revenue" value={fmtLAK(1200000)} icon={Users} color="#7C5CDB" tint="#EFEAFB" sub="8 providers × 150,000 LAK" />
            <StatCard label="Featured listings" value={fmtLAK(600000)} icon={Star} color="#9A7208" tint="#FDF4DC" sub="3 featured slots" />
          </div>
          <SectionTitle>Revenue model</SectionTitle>
          {[
            { t: "15% commission per completed job", d: "Core revenue. Deducted automatically from each completed booking before provider payout.", icon: PieChart, color: COLORS.blue, tint: "#E7F0FD" },
            { t: "Provider monthly membership", d: "150,000 LAK/month for verified badge, priority support and dashboard tools.", icon: BadgeCheck, color: COLORS.green, tint: "#E6F6EC" },
            { t: "Featured provider listing", d: "Providers pay to appear at the top of their category on the customer home page.", icon: Star, color: "#9A7208", tint: "#FDF4DC" },
            { t: "Emergency booking fee", d: "Customers pay a small extra fee for urgent same-day service; shared with the provider.", icon: Zap, color: "#C43D3D", tint: "#FDEAEA" },
          ].map((r) => (
            <Card key={r.t} style={{ marginBottom: 10, display: "flex", gap: 12 }}>
              <div style={{ background: r.tint, borderRadius: 12, padding: 10, height: "fit-content" }}>
                {React.createElement(r.icon, { size: 18, color: r.color })}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: COLORS.ink }}>{r.t}</div>
                <div style={{ fontSize: 13, color: "#5A6B84", marginTop: 3, lineHeight: 1.45 }}>{r.d}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== ROOT ================================== */

export default function App() {
  const [role, setRole] = useState("customer");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [nextNum, setNextNum] = useState(1043);

  const addBooking = (form) => {
    const id = `LC-${nextNum}`;
    setNextNum((n) => n + 1);
    const provider = providers.find((p) => p.approved && p.cat === form.cat);
    setBookings((bs) => [{
      id, customer: form.customer, phone: form.phone, cat: form.cat,
      serviceType: form.serviceType, location: form.location, date: form.date,
      time: form.time, urgent: form.urgent, description: form.description,
      budget: form.budget ? Number(form.budget) : null,
      status: "New Request", providerId: provider ? provider.id : null,
      quote: null, rating: null, createdToday: true,
    }, ...bs]);
    return id;
  };

  const updateBooking = (id, patch) => setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const roles = [
    { id: "customer", l: "Customer", icon: User },
    { id: "provider", l: "Provider", icon: Wrench },
    { id: "admin", l: "Admin", icon: Layers },
  ];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Nunito Sans', 'Segoe UI', system-ui, sans-serif", color: COLORS.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid ${COLORS.blue}; outline-offset: 2px; }
        input:focus, select:focus, textarea:focus { border-color: ${COLORS.blue} !important; }
      `}</style>

      {/* Top bar with role switcher */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)", borderBottom: "1px solid #E7ECF4",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrandMark size={30} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1 }}>
                <span style={{ color: COLORS.blue }}>Lao</span><span style={{ color: COLORS.green }}>Care</span>
              </div>
              <div style={{ fontSize: 10, color: "#93A1B5", fontWeight: 700, letterSpacing: 0.4 }}>PARTNER DEMO</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", background: "#EEF1F6", borderRadius: 999, padding: 3 }}>
            {roles.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer",
                padding: "7px 13px", borderRadius: 999, fontWeight: 750, fontSize: 12.5, fontFamily: "inherit",
                background: role === r.id ? "#fff" : "transparent",
                color: role === r.id ? COLORS.blue : "#5A6B84",
                boxShadow: role === r.id ? "0 1px 4px rgba(18,38,63,0.12)" : "none",
              }}>
                <r.icon size={13} /> {r.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 60px" }}>
        {role === "customer" && <CustomerApp bookings={bookings} providers={providers} addBooking={addBooking} updateBooking={updateBooking} />}
        {role === "provider" && <ProviderApp bookings={bookings} providers={providers} updateBooking={updateBooking} />}
        {role === "admin" && <AdminApp bookings={bookings} providers={providers} updateBooking={updateBooking} setProviders={setProviders} />}
        <div style={{ textAlign: "center", fontSize: 11.5, color: "#93A1B5", marginTop: 30 }}>
          LaoCare demo prototype · Vientiane, Lao PDR · Data is sample data for presentation only
        </div>
      </div>
    </div>
  );
}
