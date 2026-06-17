/* ------------------------------------------------------------------ */
/*  XLR8 Continuity Manager — web prototype                            */
/*  Management layer only. No payments. Reorder = outbound link.       */
/*  For research-supply continuity — Research Use Only.                */
/* ------------------------------------------------------------------ */
const { useState, useMemo } = React;

const STORE_URL = "https://xlr8research.com/shop";

const PRODUCTS = [
  { id:"reta",   name:"Retatrutide",      spec:"30mg",      price:249.99, cat:"Peptides",   tag:"Top seller" },
  { id:"tesa",   name:"Tesamorelin",      spec:"20mg",      price:109.99, cat:"Peptides",   tag:"Featured"   },
  { id:"bpc",    name:"BPC-157",          spec:"10mg",      price: 59.99, cat:"Peptides"                     },
  { id:"cjc10",  name:"CJC-1295 no DAC", spec:"10mg",      price:109.99, cat:"Peptides"                     },
  { id:"cjcipa", name:"CJC-1295 / IPA",  spec:"5mg / 5mg", price: 99.99, cat:"Peptides"                     },
  { id:"cjcdac", name:"CJC-1295 w/ DAC", spec:"5mg",       price: 89.99, cat:"Peptides"                     },
  { id:"ghk",    name:"GHK-Cu",          spec:"100mg",     price: 59.99, cat:"Peptides"                     },
  { id:"epi",    name:"Epitalon",        spec:"50mg",      price: 59.99, cat:"Peptides"                     },
  { id:"dsip",   name:"DSIP",            spec:"10mg",      price: 49.99, cat:"Peptides"                     },
  { id:"ara",    name:"ARA-290",         spec:"10mg",      price: 49.99, cat:"Peptides"                     },
  { id:"aod",    name:"AOD-9604",        spec:"10mg",      price: 99.99, cat:"Peptides"                     },
  { id:"fox",    name:"FOX-04",          spec:"10mg",      price:149.99, cat:"Peptides"                     },
  { id:"amq",    name:"5-Amino-1MQ",     spec:"50mg",      price: 99.99, cat:"Nootropics"                   },
  { id:"bac",    name:"BAC Water",       spec:"3ml",       price:  9.99, cat:"Supplies",   tag:"Incl. free" },
];

const CAT_COLOR = { Peptides:"#36D1C4", Nootropics:"#FFC857", Supplies:"#8B96A0" };
const MEMBER_RATE = 0.15;
const money = n => `$${n.toFixed(2)}`;
const memberPrice = n => n * (1 - MEMBER_RATE);

function addDays(d) {
  const t = new Date(); t.setDate(t.getDate() + d);
  return t.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}
function monthAbbr(offset) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = new Date(); d.setMonth(d.getMonth() - offset);
  return MONTHS[d.getMonth()];
}

/* ---- icons ---- */
const Ico = {
  shield: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"20", height:"20", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("path", { d:"M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z", strokeLinejoin:"round" }),
    React.createElement("path", { d:"M9 12l2 2 4-4", strokeLinecap:"round", strokeLinejoin:"round" })),
  box: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"22", height:"22", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("path", { d:"M3 7l9-4 9 4v10l-9 4-9-4V7z", strokeLinejoin:"round" }),
    React.createElement("path", { d:"M3 7l9 4 9-4M12 11v10", strokeLinejoin:"round" })),
  grid: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"22", height:"22", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("rect", { x:"4", y:"4", width:"7", height:"7", rx:"1.5" }),
    React.createElement("rect", { x:"13", y:"4", width:"7", height:"7", rx:"1.5" }),
    React.createElement("rect", { x:"4", y:"13", width:"7", height:"7", rx:"1.5" }),
    React.createElement("rect", { x:"13", y:"13", width:"7", height:"7", rx:"1.5" })),
  user: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"22", height:"22", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("circle", { cx:"12", cy:"8", r:"4" }),
    React.createElement("path", { d:"M4 21c0-4 4-6 8-6s8 2 8 6", strokeLinecap:"round" })),
  check: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"16", height:"16", fill:"none", stroke:"currentColor", strokeWidth:"2.4", ...p },
    React.createElement("path", { d:"M5 12l5 5L19 7", strokeLinecap:"round", strokeLinejoin:"round" })),
  doc: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"16", height:"16", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("path", { d:"M6 3h8l4 4v14H6z", strokeLinejoin:"round" }),
    React.createElement("path", { d:"M14 3v4h4M9 13h6M9 17h6", strokeLinecap:"round" })),
  arrow: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"18", height:"18", fill:"none", stroke:"currentColor", strokeWidth:"2", ...p },
    React.createElement("path", { d:"M5 12h14M13 6l6 6-6 6", strokeLinecap:"round", strokeLinejoin:"round" })),
  ext: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"14", height:"14", fill:"none", stroke:"currentColor", strokeWidth:"2", ...p },
    React.createElement("path", { d:"M18 13v6H6V7h6M15 3h6v6M10 14L21 3", strokeLinecap:"round", strokeLinejoin:"round" })),
  chart: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"22", height:"22", fill:"none", stroke:"currentColor", strokeWidth:"1.8", ...p },
    React.createElement("rect", { x:"3",  y:"14", width:"4", height:"7", rx:"1" }),
    React.createElement("rect", { x:"10", y:"9",  width:"4", height:"12", rx:"1" }),
    React.createElement("rect", { x:"17", y:"4",  width:"4", height:"17", rx:"1" })),
  cal: p => React.createElement("svg", { viewBox:"0 0 24 24", width:"14", height:"14", fill:"none", stroke:"currentColor", strokeWidth:"2", ...p },
    React.createElement("rect", { x:"3", y:"4", width:"18", height:"18", rx:"3" }),
    React.createElement("path", { d:"M16 2v4M8 2v4M3 10h18", strokeLinecap:"round" })),
};

function Vial({ color }) {
  return React.createElement("div", { className:"xlr-vial" },
    React.createElement("span", { className:"xlr-vial-cap", style:{ background:color } }),
    React.createElement("span", { className:"xlr-vial-body" },
      React.createElement("span", { className:"xlr-vial-liquid", style:{ background:`${color}26`, borderTop:`2px solid ${color}` } })));
}
function Wordmark({ small }) {
  return React.createElement("span", { className:`xlr-mark ${small?"xlr-mark-sm":""}` },
    "XLR", React.createElement("span", { className:"xlr-mark-8" }, "8"));
}

function App() {
  const [view,     setView]     = useState("gate");
  const [tab,      setTab]      = useState("supply");
  const [cadence,  setCadence]  = useState(30);
  const [filter,   setFilter]   = useState("All");
  const [protocol, setProtocol] = useState(["bpc", "tesa", "bac"]);
  const [toast,    setToast]    = useState(null);

  const flash = m => { setToast(m); setTimeout(() => setToast(null), 1800); };

  const items = useMemo(() =>
    protocol.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean), [protocol]);

  const shipmentTotal = useMemo(() =>
    items.reduce((s, p) => s + (p.id === "bac" ? 0 : memberPrice(p.price)), 0), [items]);

  const toggle = id => setProtocol(prev =>
    prev.includes(id)
      ? (flash("Removed from protocol"), prev.filter(x => x !== id))
      : (flash("Added to protocol"),     [...prev, id]));

  const cats    = ["All", "Peptides", "Nootropics", "Supplies"];
  const visible = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  const daysLeft  = Math.round(cadence * 0.7);
  const runwayPct = Math.max(6, Math.round(daysLeft / cadence * 100));

  /* next 3 scheduled shipments derived from cadence — not usage */
  const refillDates = useMemo(() =>
    [0, 1, 2].map(n => ({
      isNext: n === 0,
      label:  n === 0 ? "Next refill" : `Refill ${n + 1}`,
      date:   addDays(daysLeft + n * cadence),
      days:   daysLeft + n * cadence,
    })), [daysLeft, cadence]);

  /* simulated 6-month spend history from cadence pattern */
  const spendHistory = useMemo(() => {
    const pattern = cadence <= 30 ? [1,1,1,1,1,1]
                  : cadence <= 60 ? [1,0,1,0,1,0]
                  :                 [1,0,0,1,0,0];
    return Array.from({length:6}, (_, i) => ({
      month: monthAbbr(5 - i),
      spend: pattern[i] * shipmentTotal,
    }));
  }, [cadence, shipmentTotal]);

  const maxSpend        = Math.max(...spendHistory.map(m => m.spend), 1);
  const monthlySpend    = shipmentTotal * 30 / cadence;
  const reordersPerYear = Math.round(365 / cadence);
  const activeCount     = items.filter(p => p.id !== "bac").length;

  const topCompound = useMemo(() => {
    const active = items.filter(p => p.id !== "bac");
    return active.length ? active.reduce((a, b) => b.price > a.price ? b : a) : null;
  }, [items]);

  /* ---- GATE ---- */
  if (view === "gate") return React.createElement("div", { className:"xlr-stage" },
    React.createElement("div", { className:"xlr-caption" },
      React.createElement(Wordmark, { small:true }), " Continuity Manager — prototype"),
    React.createElement("div", { className:"xlr-phone" },
      React.createElement("div", { className:"xlr-island" }),
      React.createElement("div", { className:"xlr-screen" },
        React.createElement("div", { className:"xlr-statusbar" },
          React.createElement("span", null, "9:41"),
          React.createElement("span", { className:"xlr-status-icons" },
            React.createElement("i", { className:"xlr-sig" }),
            React.createElement("i", { className:"xlr-wifi" }),
            React.createElement("i", { className:"xlr-batt" }))),
        React.createElement("div", { className:"xlr-pad xlr-gate" },
          React.createElement("div", { className:"xlr-gate-top" },
            React.createElement(Wordmark, null),
            React.createElement("p", { className:"xlr-eyebrow" }, "Continuity Manager")),
          React.createElement("div", { className:"xlr-gate-card" },
            React.createElement("div", { className:"xlr-gate-ico" }, React.createElement(Ico.shield, null)),
            React.createElement("h2", null, "Research use only"),
            React.createElement("p", null,
              "By entering you confirm you are a qualified laboratory researcher and all compounds are for ",
              React.createElement("b", null, "in vitro laboratory research only"),
              " — not for human or veterinary use, and not approved by the FDA.")),
          React.createElement("button", { className:"xlr-cta", onClick:() => setView("app") },
            "Enter ", React.createElement(Ico.arrow, null)),
          React.createElement("p", { className:"xlr-fine" }, "RUO · Not for personal use · Not FDA approved")))),
    React.createElement("p", { className:"xlr-hint" },
      "Management-only prototype · no in-app payments · reorder hands off to the XLR8 store"));

  /* ---- APP SHELL ---- */
  return React.createElement("div", { className:"xlr-stage" },
    React.createElement("div", { className:"xlr-caption" },
      React.createElement(Wordmark, { small:true }), " Continuity Manager — prototype"),
    React.createElement("div", { className:"xlr-phone" },
      React.createElement("div", { className:"xlr-island" }),
      React.createElement("div", { className:"xlr-screen" },
        React.createElement("div", { className:"xlr-statusbar" },
          React.createElement("span", null, "9:41"),
          React.createElement("span", { className:"xlr-status-icons" },
            React.createElement("i", { className:"xlr-sig" }),
            React.createElement("i", { className:"xlr-wifi" }),
            React.createElement("i", { className:"xlr-batt" }))),

        /* ---- SUPPLY TAB ---- */
        tab === "supply" && React.createElement("div", { className:"xlr-pad xlr-scroll" },
          React.createElement("div", { className:"xlr-app-head" },
            React.createElement("div", null,
              React.createElement("p", { className:"xlr-eyebrow" }, "Your supply"),
              React.createElement("h2", { className:"xlr-screen-h tight" }, "You're covered.")),
            React.createElement("span", { className:"xlr-member-pill" }, "Active member")),

          React.createElement("div", { className:"xlr-cover-card" },
            React.createElement("div", { className:"xlr-cover-ring" },
              React.createElement("span", { className:"xlr-cover-days" }, daysLeft),
              React.createElement("span", { className:"xlr-cover-unit" }, "days")),
            React.createElement("div", { className:"xlr-cover-meta" },
              React.createElement("p", { className:"xlr-cover-label" }, "Next reorder"),
              React.createElement("p", { className:"xlr-cover-date" }, addDays(daysLeft)),
              React.createElement("p", { className:"xlr-cover-sub" },
                items.length, " compounds · every ", cadence, " days"))),

          /* upcoming refills timeline — cadence-based, not usage */
          React.createElement("p", { className:"xlr-section-h" }, "Upcoming refills"),
          React.createElement("div", { className:"xlr-timeline" },
            refillDates.map((r, i) => React.createElement(React.Fragment, { key:i },
              i > 0 && React.createElement("div", { className:"xlr-tl-connector" }),
              React.createElement("div", { className:`xlr-tl-row${r.isNext?" next":""}` },
                React.createElement("div", { className:`xlr-tl-dot${r.isNext?" next":""}` },
                  React.createElement(Ico.cal, null)),
                React.createElement("div", { className:"xlr-tl-meta" },
                  React.createElement("div", { className:`xlr-tl-label${r.isNext?" next":""}` }, r.label),
                  React.createElement("div", { className:"xlr-tl-date" }, r.date),
                  React.createElement("div", { className:"xlr-tl-days" }, "in ", r.days, " days")),
                r.isNext && React.createElement("a", {
                  className:"xlr-tl-cta",
                  href:STORE_URL,
                  target:"_blank",
                  rel:"noopener noreferrer",
                }, "Reorder ", React.createElement(Ico.ext, null)))))),

          React.createElement("p", { className:"xlr-section-h" }, "Your protocol"),
          React.createElement("div", { className:"xlr-list" },
            items.length === 0 && React.createElement("p", { style:{ color:"#8B96A0", fontSize:"13px", textAlign:"center", padding:"20px 0" } },
              "Add compounds from the Catalog tab."),
            items.map(p => React.createElement("div", { key:p.id, className:"xlr-line" },
              React.createElement(Vial, { color:CAT_COLOR[p.cat] }),
              React.createElement("div", { className:"xlr-line-meta" },
                React.createElement("b", null, p.name),
                React.createElement("span", { className:"xlr-mono" }, p.spec)),
              React.createElement("div", { className:"xlr-line-price" },
                p.id === "bac"
                  ? React.createElement("span", { className:"xlr-free" }, "Free")
                  : React.createElement(React.Fragment, null,
                      React.createElement("span", { className:"xlr-mono" }, money(memberPrice(p.price))),
                      React.createElement("s",    { className:"xlr-mono" }, money(p.price))))))),
          items.length > 0 && React.createElement("div", { className:"xlr-ship-total" },
            React.createElement("span", null, "Est. this refill"),
            React.createElement("span", { className:"xlr-mono big" }, money(shipmentTotal))),
          React.createElement("a", {
            className:"xlr-reorder-btn",
            href:STORE_URL,
            target:"_blank",
            rel:"noopener noreferrer"
          }, "Reorder at XLR8 Store ", React.createElement(Ico.ext, null)),
          React.createElement("div", { className:"xlr-trust" },
            React.createElement(Ico.doc, null), " COAs attached automatically · ",
            React.createElement(Ico.shield, null), " Research use only")),

        /* ---- CATALOG TAB ---- */
        tab === "catalog" && React.createElement("div", { className:"xlr-pad xlr-scroll" },
          React.createElement("h2", { className:"xlr-screen-h" }, "Research Catalog"),
          React.createElement("p", { className:"xlr-screen-sub" },
            "Track compounds in your protocol. Reorder at the store."),
          React.createElement("div", { className:"xlr-chips" },
            cats.map(c => React.createElement("button", {
              key:c, className:`xlr-chip ${filter===c?"on":""}`,
              onClick:() => setFilter(c)
            }, c))),
          React.createElement("div", { className:"xlr-grid" },
            visible.map(p => {
              const inP = protocol.includes(p.id);
              return React.createElement("div", { key:p.id, className:"xlr-card" },
                p.tag && React.createElement("span", { className:"xlr-card-tag" }, p.tag),
                React.createElement(Vial, { color:CAT_COLOR[p.cat] }),
                React.createElement("b", { className:"xlr-card-name" }, p.name),
                React.createElement("span", { className:"xlr-mono xlr-card-spec" }, p.spec),
                React.createElement("div", { className:"xlr-card-price" },
                  React.createElement("span", { className:"xlr-mono" }, money(memberPrice(p.price))),
                  React.createElement("s",    { className:"xlr-mono" }, money(p.price))),
                React.createElement("button", {
                  className:`xlr-add ${inP?"added":""}`,
                  onClick:() => toggle(p.id)
                }, inP
                  ? React.createElement(React.Fragment, null, React.createElement(Ico.check, null), " In protocol")
                  : "+ Protocol"));
            }))),

        /* ---- MANAGE TAB ---- */
        tab === "account" && React.createElement("div", { className:"xlr-pad xlr-scroll" },
          React.createElement("h2", { className:"xlr-screen-h" }, "Manage"),

          React.createElement("div", { className:"xlr-acc-card" },
            React.createElement("p", { className:"xlr-section-h", style:{marginTop:0} }, "Membership"),
            React.createElement("div", { className:"xlr-acc-row" },
              React.createElement("span", null, "Status"),
              React.createElement("span", { className:"xlr-member-pill" }, "Active · Annual")),
            React.createElement("div", { className:"xlr-acc-row" },
              React.createElement("span", null, "Member pricing"),
              React.createElement("b", { style:{color:"#36D1C4"} }, "15% off all compounds")),
            React.createElement("a", {
              className:"xlr-switch",
              href:STORE_URL,
              target:"_blank",
              rel:"noopener noreferrer"
            }, "Manage billing at the store ", React.createElement(Ico.ext, null))),

          React.createElement("p", { className:"xlr-section-h" }, "Supply runway"),
          React.createElement("div", { className:"xlr-runway" },
            React.createElement("div", { className:"xlr-runway-top" },
              React.createElement("div", null,
                React.createElement("p", { className:"xlr-runway-days" },
                  React.createElement("span", null, daysLeft), " days until reorder"),
                React.createElement("p", { className:"xlr-runway-sub" },
                  "Next box: ", addDays(daysLeft), " · every ", cadence, " days")),
              React.createElement("span", { className:"xlr-runway-pill" }, "On track")),
            React.createElement("div", { className:"xlr-runway-bar" },
              React.createElement("i", { style:{ width:`${runwayPct}%` } })),
            React.createElement("p", { className:"xlr-runway-note" },
              "Based on your refill cadence — not usage. Auto-replenished on your schedule.")),

          React.createElement("p", { className:"xlr-section-h" }, "What you're spending"),
          React.createElement("div", { className:"xlr-cost" },
            React.createElement("div", { className:"xlr-cost-row" },
              React.createElement("span", null, "Compounds (", items.filter(p=>p.id!=="bac").length, " items, member pricing)"),
              React.createElement("span", { className:"xlr-mono" }, money(shipmentTotal))),
            React.createElement("div", { className:"xlr-cost-row sub" },
              React.createElement("span", null, "BAC water + supplies"),
              React.createElement("span", { className:"xlr-free" }, "Included")),
            React.createElement("div", { className:"xlr-cost-total" },
              React.createElement("span", null, "Est. per shipment"),
              React.createElement("span", { className:"xlr-mono" }, money(shipmentTotal))),
            React.createElement("p", { className:"xlr-cost-note" },
              "Spend tracking only — no charges occur in this app.")),

          React.createElement("p", { className:"xlr-section-h" }, "Refill cadence"),
          React.createElement("div", { className:"xlr-cadence" },
            [30, 60, 90].map(d => React.createElement("button", {
              key:d,
              className:`xlr-cad ${cadence===d?"on":""}`,
              onClick:() => { setCadence(d); flash(`Cadence set to ${d} days`); }
            }, d, React.createElement("span", null, "days")))),

          React.createElement("p", { className:"xlr-section-h" }, "Documentation"),
          React.createElement("div", { className:"xlr-vault" },
            items.filter(p=>p.id!=="bac").map(p => React.createElement("div", { key:p.id, className:"xlr-vault-row" },
              React.createElement(Ico.doc, null), " ",
              React.createElement("span", null, p.name, " ", p.spec),
              React.createElement("span", { className:"xlr-vault-link" }, "COA")))),

          React.createElement("a", {
            className:"xlr-reorder-btn",
            href:STORE_URL,
            target:"_blank",
            rel:"noopener noreferrer"
          }, "Reorder at XLR8 Store ", React.createElement(Ico.ext, null)),
          React.createElement("p", { className:"xlr-fine" },
            "Research use only · Not for human or veterinary use · Not FDA approved")),

        /* ---- INSIGHTS TAB ---- */
        tab === "insights" && React.createElement("div", { className:"xlr-pad xlr-scroll" },
          React.createElement("div", { className:"xlr-app-head" },
            React.createElement("div", null,
              React.createElement("p", { className:"xlr-eyebrow" }, "Supply & spend"),
              React.createElement("h2", { className:"xlr-screen-h tight" }, "Insights")),
            React.createElement("span", { className:"xlr-no-usage-pill" }, "No usage tracked")),

          React.createElement("div", { className:"xlr-kpi-grid" },
            React.createElement("div", { className:"xlr-kpi" },
              React.createElement("div", { className:"xlr-kpi-val" }, `~$${Math.round(monthlySpend)}`),
              React.createElement("div", { className:"xlr-kpi-label" }, "est. spend / month")),
            React.createElement("div", { className:"xlr-kpi" },
              React.createElement("div", { className:"xlr-kpi-val" }, reordersPerYear),
              React.createElement("div", { className:"xlr-kpi-label" }, "reorders / year")),
            React.createElement("div", { className:"xlr-kpi" },
              React.createElement("div", { className:"xlr-kpi-val" }, daysLeft),
              React.createElement("div", { className:"xlr-kpi-label" }, "days covered")),
            React.createElement("div", { className:"xlr-kpi" },
              React.createElement("div", { className:"xlr-kpi-val" }, activeCount),
              React.createElement("div", { className:"xlr-kpi-label" }, "active compounds"))),

          React.createElement("p", { className:"xlr-section-h" }, "Spend — last 6 months"),
          React.createElement("div", { className:"xlr-chart-card" },
            React.createElement("div", { className:"xlr-chart" },
              spendHistory.map((m, i) => React.createElement("div", {
                key:i,
                className:`xlr-bar${m.spend > 0 ? " active" : ""}`,
                style:{ height: m.spend > 0 ? `${Math.max(18, Math.round(m.spend / maxSpend * 80))}px` : "8px" }
              }))),
            React.createElement("div", { className:"xlr-chart-labels" },
              spendHistory.map((m, i) => React.createElement("span", { key:i }, m.month))),
            React.createElement("p", { className:"xlr-chart-note" },
              "Derived from shipment cadence & member pricing — no usage data.")),

          topCompound && React.createElement(React.Fragment, null,
            React.createElement("p", { className:"xlr-section-h" }, "Most-reordered compound"),
            React.createElement("div", { className:"xlr-top-compound" },
              React.createElement(Vial, { color:CAT_COLOR[topCompound.cat] }),
              React.createElement("div", { className:"xlr-top-meta" },
                React.createElement("b", null, topCompound.name),
                React.createElement("span", null, topCompound.spec, " · ", money(memberPrice(topCompound.price)), " member")),
              React.createElement("a", {
                className:"xlr-tl-cta",
                href:STORE_URL,
                target:"_blank",
                rel:"noopener noreferrer",
              }, "Reorder ", React.createElement(Ico.ext, null)))),

          React.createElement("p", { className:"xlr-insights-footer" },
            "All figures derived from your refill schedule and catalog pricing. No dosing, consumption, or usage data is collected or displayed.")),

        /* ---- NAV ---- */
        React.createElement("nav", { className:"xlr-tabs" },
          [
            ["supply",   "Supply",   Ico.box],
            ["catalog",  "Catalog",  Ico.grid],
            ["account",  "Manage",   Ico.user],
            ["insights", "Insights", Ico.chart],
          ].map(([k,label,I]) => React.createElement("button", {
            key:k,
            className:tab===k?"on":"",
            onClick:() => setTab(k)
          }, React.createElement(I, null), React.createElement("span", null, label)))),

        toast && React.createElement("div", { className:"xlr-toast" }, toast))),
    React.createElement("p", { className:"xlr-hint" },
      "Supply (refill timeline) · Catalog · Manage · Insights (spend & supply) · Reorder hands off to the store."));
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
