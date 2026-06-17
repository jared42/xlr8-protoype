/* ------------------------------------------------------------------ */
/*  XLR8 CONTINUITY — MVP prototype                                    */
/*  Core job-to-be-done: your research never stalls on a restock.      */
/*  Recurring membership + auto-ship, framed for Research-Use-Only.     */
/* ------------------------------------------------------------------ */
const { useState, useMemo, useEffect, useRef, useCallback } = React;

const PRODUCTS = [{
  id: "reta",
  name: "Retatrutide",
  spec: "30mg",
  price: 249.99,
  cat: "Peptides",
  tag: "Top seller"
}, {
  id: "tesa",
  name: "Tesamorelin",
  spec: "20mg",
  price: 109.99,
  cat: "Peptides",
  tag: "Featured"
}, {
  id: "bpc",
  name: "BPC-157",
  spec: "10mg",
  price: 59.99,
  cat: "Peptides"
}, {
  id: "cjc10",
  name: "CJC-1295 no DAC",
  spec: "10mg",
  price: 109.99,
  cat: "Peptides"
}, {
  id: "cjcipa",
  name: "CJC-1295 / IPA",
  spec: "5mg / 5mg",
  price: 99.99,
  cat: "Peptides"
}, {
  id: "cjcdac",
  name: "CJC-1295 w/ DAC",
  spec: "5mg",
  price: 89.99,
  cat: "Peptides"
}, {
  id: "ghk",
  name: "GHK-Cu",
  spec: "100mg",
  price: 59.99,
  cat: "Peptides"
}, {
  id: "epi",
  name: "Epitalon",
  spec: "50mg",
  price: 59.99,
  cat: "Peptides"
}, {
  id: "dsip",
  name: "DSIP",
  spec: "10mg",
  price: 49.99,
  cat: "Peptides"
}, {
  id: "ara",
  name: "ARA-290",
  spec: "10mg",
  price: 49.99,
  cat: "Peptides"
}, {
  id: "aod",
  name: "AOD-9604",
  spec: "10mg",
  price: 99.99,
  cat: "Peptides"
}, {
  id: "fox",
  name: "FOX-04",
  spec: "10mg",
  price: 149.99,
  cat: "Peptides"
}, {
  id: "amq",
  name: "5-Amino-1MQ",
  spec: "50mg",
  price: 99.99,
  cat: "Nootropics"
}, {
  id: "bac",
  name: "BAC Water",
  spec: "3ml",
  price: 9.99,
  cat: "Supplies",
  tag: "Free for members"
}];
const CAT_COLOR = {
  Peptides: "#36D1C4",
  Nootropics: "#FFC857",
  SARMs: "#A78BFA",
  Supplies: "#8B96A0"
};
const MEMBER_RATE = 0.15; // 15% member pricing
const money = n => `$${n.toFixed(2)}`;
const memberPrice = n => n * (1 - MEMBER_RATE);
function addDays(d) {
  const t = new Date();
  t.setDate(t.getDate() + d);
  return t.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

/* ---- tiny inline icons ---- */
const Ico = {
  shield: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "20",
    height: "20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 12l2 2 4-4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  box: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7l9-4 9 4v10l-9 4-9-4V7z",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 7l9 4 9-4M12 11v10",
    strokeLinejoin: "round"
  })),
  grid: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "4",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "13",
    width: "7",
    height: "7",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13",
    y: "13",
    width: "7",
    height: "7",
    rx: "1.5"
  })),
  spark: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  })),
  user: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 21c0-4 4-6 8-6s8 2 8 6",
    strokeLinecap: "round"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L19 7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  doc: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h8l4 4v14H6z",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 3v4h4M9 13h6M9 17h6",
    strokeLinecap: "round"
  })),
  arrow: p => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "18",
    height: "18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    ...p
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))
};

/* ---- vial illustration ---- */
function Vial({
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "xlr-vial"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-vial-cap",
    style: {
      background: color
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "xlr-vial-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-vial-liquid",
    style: {
      background: `${color}26`,
      borderTop: `2px solid ${color}`
    }
  })));
}
function Wordmark({
  small
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `xlr-mark ${small ? "xlr-mark-sm" : ""}`
  }, "XLR", /*#__PURE__*/React.createElement("span", {
    className: "xlr-mark-8"
  }, "8"));
}
function App() {
  const [view, setView] = useState("gate"); // gate | promise | plans | app
  const [tab, setTab] = useState("supply");
  const [plan, setPlan] = useState("annual"); // monthly | annual
  const [cadence, setCadence] = useState(30);
  const [filter, setFilter] = useState("All");
  const [protocol, setProtocol] = useState(["bpc", "tesa", "bac"]);
  const [toast, setToast] = useState(null);
  const flash = m => {
    setToast(m);
    setTimeout(() => setToast(null), 1600);
  };
  const items = useMemo(() => protocol.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean), [protocol]);
  const shipmentTotal = useMemo(() => items.reduce((s, p) => s + (p.id === "bac" ? 0 : memberPrice(p.price)), 0), [items]);
  const toggle = id => {
    setProtocol(prev => {
      if (prev.includes(id)) {
        flash("Removed from protocol");
        return prev.filter(x => x !== id);
      }
      flash("Added to your protocol");
      return [...prev, id];
    });
  };
  const cats = ["All", "Peptides", "Nootropics", "Supplies"];
  const visible = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  // --- cost summary: normalize membership + product to a true monthly figure ---
  const membershipMonthly = plan === "annual" ? 149 / 12 : 19;
  const productMonthly = shipmentTotal * (30 / cadence); // shipment cost spread across the cadence
  const totalMonthly = membershipMonthly + productMonthly;

  // --- supply runway: derived from shipment cadence, NOT usage. counts down to next box ---
  const daysLeft = Math.round(cadence * 0.7); // notional mid-cycle for the demo
  const runwayPct = Math.max(6, Math.round(daysLeft / cadence * 100));
  return /*#__PURE__*/React.createElement("div", {
    className: "xlr-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-caption"
  }, /*#__PURE__*/React.createElement(Wordmark, {
    small: true
  }), " ", /*#__PURE__*/React.createElement("span", null, "Continuity — MVP prototype")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-island"
  }), /*#__PURE__*/React.createElement("div", {
    className: "xlr-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-statusbar"
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-status-icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "xlr-sig"
  }), /*#__PURE__*/React.createElement("i", {
    className: "xlr-wifi"
  }), /*#__PURE__*/React.createElement("i", {
    className: "xlr-batt"
  }))), view === "gate" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-gate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-gate-top"
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("p", {
    className: "xlr-eyebrow"
  }, "Continuity Program")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-gate-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-gate-ico"
  }, /*#__PURE__*/React.createElement(Ico.shield, null)), /*#__PURE__*/React.createElement("h2", null, "Research use only"), /*#__PURE__*/React.createElement("p", null, "By entering you confirm you are a qualified laboratory researcher and all compounds are for ", /*#__PURE__*/React.createElement("b", null, "in vitro laboratory research only"), " — not for human or veterinary use, and not approved by the FDA.")), /*#__PURE__*/React.createElement("button", {
    className: "xlr-cta",
    onClick: () => setView("promise")
  }, "Enter ", /*#__PURE__*/React.createElement(Ico.arrow, null))), view === "promise" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-promise"
  }, /*#__PURE__*/React.createElement("p", {
    className: "xlr-eyebrow accent"
  }, "The promise"), /*#__PURE__*/React.createElement("h1", {
    className: "xlr-hero-h"
  }, "Your research", /*#__PURE__*/React.createElement("br", null), "never has to", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "wait.")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-hero-sub"
  }, "One membership keeps your compounds stocked, documented, and on the way — automatically. No reorder scramble. No backorder gaps."), /*#__PURE__*/React.createElement("div", {
    className: "xlr-promise-list"
  }, [["Reserved stock", "Members get priority inventory held before it sells out."], ["Auto-ships on your cadence", "Every 30, 60, or 90 days. Pause or skip anytime."], ["COA on every batch", "Documentation lands in your vault with each shipment."]].map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "xlr-promise-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-promise-dot"
  }, /*#__PURE__*/React.createElement(Ico.check, null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, t), /*#__PURE__*/React.createElement("span", null, d))))), /*#__PURE__*/React.createElement("button", {
    className: "xlr-cta",
    onClick: () => setView("plans")
  }, "See membership ", /*#__PURE__*/React.createElement(Ico.arrow, null))), view === "plans" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-scroll"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "xlr-screen-h"
  }, "Choose your plan"), /*#__PURE__*/React.createElement("p", {
    className: "xlr-screen-sub"
  }, "Cancel anytime. Member pricing applies to every compound."), /*#__PURE__*/React.createElement("button", {
    className: `xlr-plan ${plan === "annual" ? "sel" : ""}`,
    onClick: () => setPlan("annual")
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-plan-badge"
  }, "Save 35%"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-plan-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-radio"
  }, plan === "annual" && /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Annual"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-plan-price"
  }, /*#__PURE__*/React.createElement("em", null, "$149"), "/yr"))), /*#__PURE__*/React.createElement("p", {
    className: "xlr-plan-note"
  }, "Works out to $12.42/mo · best value")), /*#__PURE__*/React.createElement("button", {
    className: `xlr-plan ${plan === "monthly" ? "sel" : ""}`,
    onClick: () => setPlan("monthly")
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-plan-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-radio"
  }, plan === "monthly" && /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Monthly"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-plan-price"
  }, /*#__PURE__*/React.createElement("em", null, "$19"), "/mo"))), /*#__PURE__*/React.createElement("p", {
    className: "xlr-plan-note"
  }, "Flexible · cancel whenever")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-perks"
  }, /*#__PURE__*/React.createElement("p", {
    className: "xlr-perks-h"
  }, "Every membership includes"), ["15% member pricing on all compounds", "Reserved in-stock guarantee", "Free BAC water + supplies each shipment", "Priority 24h handling", "COA auto-delivered to your vault"].map(p => /*#__PURE__*/React.createElement("div", {
    key: p,
    className: "xlr-perk"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Ico.check, null)), p))), /*#__PURE__*/React.createElement("button", {
    className: "xlr-cta",
    onClick: () => {
      setView("app");
      setTab("supply");
      flash("Membership active");
    }
  }, "Start ", plan, " membership ", /*#__PURE__*/React.createElement(Ico.arrow, null)), /*#__PURE__*/React.createElement("p", {
    className: "xlr-fine"
  }, "For laboratory research use only. Not for human or veterinary use.")), view === "app" && tab === "supply" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-app-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "xlr-eyebrow"
  }, "Your supply"), /*#__PURE__*/React.createElement("h2", {
    className: "xlr-screen-h tight"
  }, "You're covered.")), /*#__PURE__*/React.createElement("span", {
    className: "xlr-member-pill"
  }, plan === "annual" ? "Annual" : "Monthly", " member")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cover-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-cover-ring"
  }, /*#__PURE__*/React.createElement("span", {
    className: "xlr-cover-days"
  }, daysLeft), /*#__PURE__*/React.createElement("span", {
    className: "xlr-cover-unit"
  }, "days")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cover-meta"
  }, /*#__PURE__*/React.createElement("p", {
    className: "xlr-cover-label"
  }, "Next delivery"), /*#__PURE__*/React.createElement("p", {
    className: "xlr-cover-date"
  }, addDays(daysLeft)), /*#__PURE__*/React.createElement("p", {
    className: "xlr-cover-sub"
  }, items.length, " compounds · every ", cadence, " days"))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-quick"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => flash("Next shipment skipped")
  }, "Skip next"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("catalog")
  }, "Add compound"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("account")
  }, "Manage")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-section-h"
  }, "Your protocol"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-list"
  }, items.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "xlr-line"
  }, /*#__PURE__*/React.createElement(Vial, {
    color: CAT_COLOR[p.cat]
  }), /*#__PURE__*/React.createElement("div", {
    className: "xlr-line-meta"
  }, /*#__PURE__*/React.createElement("b", null, p.name), /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono"
  }, p.spec)), /*#__PURE__*/React.createElement("div", {
    className: "xlr-line-price"
  }, p.id === "bac" ? /*#__PURE__*/React.createElement("span", {
    className: "xlr-free"
  }, "Free") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono"
  }, money(memberPrice(p.price))), /*#__PURE__*/React.createElement("s", {
    className: "xlr-mono"
  }, money(p.price))))))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-ship-total"
  }, /*#__PURE__*/React.createElement("span", null, "Next shipment"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono big"
  }, money(shipmentTotal))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-trust"
  }, /*#__PURE__*/React.createElement(Ico.doc, null), " COAs attached automatically · ", /*#__PURE__*/React.createElement(Ico.shield, null), " Research use only")), view === "app" && tab === "catalog" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-scroll"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "xlr-screen-h"
  }, "Catalog"), /*#__PURE__*/React.createElement("p", {
    className: "xlr-screen-sub"
  }, "Add any compound to your recurring protocol."), /*#__PURE__*/React.createElement("div", {
    className: "xlr-chips"
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    className: `xlr-chip ${filter === c ? "on" : ""}`,
    onClick: () => setFilter(c)
  }, c))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-grid"
  }, visible.map(p => {
    const inP = protocol.includes(p.id);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "xlr-card"
    }, p.tag && /*#__PURE__*/React.createElement("span", {
      className: "xlr-card-tag"
    }, p.tag), /*#__PURE__*/React.createElement(Vial, {
      color: CAT_COLOR[p.cat]
    }), /*#__PURE__*/React.createElement("b", {
      className: "xlr-card-name"
    }, p.name), /*#__PURE__*/React.createElement("span", {
      className: "xlr-mono xlr-card-spec"
    }, p.spec), /*#__PURE__*/React.createElement("div", {
      className: "xlr-card-price"
    }, /*#__PURE__*/React.createElement("span", {
      className: "xlr-mono"
    }, money(memberPrice(p.price))), /*#__PURE__*/React.createElement("s", {
      className: "xlr-mono"
    }, money(p.price))), /*#__PURE__*/React.createElement("button", {
      className: `xlr-add ${inP ? "added" : ""}`,
      onClick: () => toggle(p.id)
    }, inP ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Ico.check, null), " Added") : "+ Add"));
  }))), view === "app" && tab === "account" && /*#__PURE__*/React.createElement("div", {
    className: "xlr-pad xlr-scroll"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "xlr-screen-h"
  }, "Manage"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-acc-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-acc-row"
  }, /*#__PURE__*/React.createElement("span", null, "Membership"), /*#__PURE__*/React.createElement("b", null, plan === "annual" ? "Annual · $149/yr" : "Monthly · $19/mo")), /*#__PURE__*/React.createElement("button", {
    className: "xlr-switch",
    onClick: () => setPlan(plan === "annual" ? "monthly" : "annual")
  }, "Switch to ", plan === "annual" ? "monthly" : "annual")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-section-h"
  }, "Supply runway"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-runway"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-runway-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "xlr-runway-days"
  }, /*#__PURE__*/React.createElement("span", null, daysLeft), " days of cover left"), /*#__PURE__*/React.createElement("p", {
    className: "xlr-runway-sub"
  }, "Next box ships ", addDays(daysLeft), " · every ", cadence, " days")), /*#__PURE__*/React.createElement("span", {
    className: "xlr-runway-pill"
  }, "On track")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-runway-bar"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${runwayPct}%`
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "xlr-runway-note"
  }, "Counts down from your last shipment — auto-replenished on your cadence.")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-section-h"
  }, "Your monthly cost"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cost"
  }, /*#__PURE__*/React.createElement("div", {
    className: "xlr-cost-row"
  }, /*#__PURE__*/React.createElement("span", null, "Membership"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono"
  }, money(membershipMonthly))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cost-row"
  }, /*#__PURE__*/React.createElement("span", null, "Compounds ", /*#__PURE__*/React.createElement("em", null, "(", items.filter(p => p.id !== "bac").length, " items, every ", cadence, "d)")), /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono"
  }, money(productMonthly))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cost-row sub"
  }, /*#__PURE__*/React.createElement("span", null, "BAC water + supplies"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-free"
  }, "Included")), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cost-total"
  }, /*#__PURE__*/React.createElement("span", null, "Total per month"), /*#__PURE__*/React.createElement("span", {
    className: "xlr-mono"
  }, money(totalMonthly))), /*#__PURE__*/React.createElement("p", {
    className: "xlr-cost-note"
  }, "≈ ", money(totalMonthly * 12), "/yr all-in · ", money(shipmentTotal), " billed per shipment")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-section-h"
  }, "Delivery cadence"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-cadence"
  }, [30, 60, 90].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    className: `xlr-cad ${cadence === d ? "on" : ""}`,
    onClick: () => {
      setCadence(d);
      flash(`Cadence set to ${d} days`);
    }
  }, d, /*#__PURE__*/React.createElement("span", null, "days")))), /*#__PURE__*/React.createElement("p", {
    className: "xlr-section-h"
  }, "Documentation"), /*#__PURE__*/React.createElement("div", {
    className: "xlr-vault"
  }, items.filter(p => p.id !== "bac").map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "xlr-vault-row"
  }, /*#__PURE__*/React.createElement(Ico.doc, null), " ", /*#__PURE__*/React.createElement("span", null, p.name, " ", p.spec), /*#__PURE__*/React.createElement("span", {
    className: "xlr-vault-link"
  }, "COA")))), /*#__PURE__*/React.createElement("div", {
    className: "xlr-acc-actions"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => flash("Subscription paused")
  }, "Pause subscription"), /*#__PURE__*/React.createElement("button", {
    className: "ghost",
    onClick: () => flash("Take this to the founder 🚀")
  }, "Cancel")), /*#__PURE__*/React.createElement("p", {
    className: "xlr-fine"
  }, "Research use only. Not for human or veterinary use. Not FDA approved.")), view === "app" && /*#__PURE__*/React.createElement("nav", {
    className: "xlr-tabs"
  }, [["supply", "Supply", Ico.box], ["catalog", "Catalog", Ico.grid], ["account", "Manage", Ico.user]].map(([k, label, I]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: tab === k ? "on" : "",
    onClick: () => setTab(k)
  }, /*#__PURE__*/React.createElement(I, null), /*#__PURE__*/React.createElement("span", null, label)))), toast && /*#__PURE__*/React.createElement("div", {
    className: "xlr-toast"
  }, toast))), /*#__PURE__*/React.createElement("p", {
    className: "xlr-hint"
  }, "Tap through it: confirm the gate → read the promise → pick a plan → explore Supply, Catalog & Manage."));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
