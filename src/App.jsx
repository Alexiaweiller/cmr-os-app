import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap, FunnelChart, Funnel, LabelList } from "recharts";

const STORAGE_KEY = "cmr-ai-os-v4";

const T = {
  bg: "#06070b", surface: "#0d0f14", card: "#13161e", cardHover: "#1a1d28",
  border: "#1e2230", borderLight: "#2a2f40", accent: "#4f8ff7", accentDim: "#2a4a8a",
  gold: "#c9a84c", goldDim: "#8a7234", green: "#34d399", red: "#f87171",
  amber: "#fbbf24", text: "#e8ecf4", textDim: "#8892a8", textMuted: "#545d73", white: "#ffffff",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const Icons = {
  command: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  product: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  investor: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  crm: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  financial: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  legal: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
  website: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  tasks: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  hr: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  market: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  comment: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  arrowRight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  chart: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
};

// ─── Default Data ───
const defaultData = {
  milestones: [
    { id: 1, title: "MVP Architecture Finalized", date: "2026-02-09", status: "done", module: "product" },
    { id: 2, title: "F&F Round Close ($400-500K)", date: "2026-03-15", status: "in_progress", module: "investor" },
    { id: 3, title: "SocGen Pilot Kickoff", date: "2026-04-01", status: "upcoming", module: "crm" },
    { id: 4, title: "Portfolio Agent Live Demo", date: "2026-03-01", status: "in_progress", module: "product" },
    { id: 5, title: "Seed Round ($4M)", date: "2026-09-01", status: "upcoming", module: "investor" },
  ],
  specs: [
    { id: 1, title: "MVP Architecture & Agent Design", version: "1.0", lastUpdated: "2026-02-09", author: "Team", status: "active", content: "Seven-layer architecture with five core AI agent families.", driveLink: "" },
    { id: 2, title: "Unified Data Model (22 Entities)", version: "0.9", lastUpdated: "2026-02-07", author: "Antony", status: "draft", content: "PostgreSQL schema covering counterparties, exposures, limits, alerts, and news.", driveLink: "" },
    { id: 3, title: "Integration Layer Specification", version: "0.8", lastUpdated: "2026-02-05", author: "Miles", status: "draft", content: "Three-tier adapter architecture: pre-built, generic protocol, and AI universal.", driveLink: "" },
  ],
  techDecisions: [
    { id: 1, date: "2026-02-09", decision: "LangChain + LangGraph for agent orchestration", rationale: "Best support for multi-agent workflows with state machines", decidedBy: "Miles", status: "approved" },
    { id: 2, date: "2026-02-08", decision: "PostgreSQL with JSONB over pure NoSQL", rationale: "Relational for core entities + flexibility for evolving schemas", decidedBy: "Team", status: "approved" },
    { id: 3, date: "2026-02-07", decision: "Anthropic Claude as primary LLM", rationale: "Superior reasoning for complex CCR analysis tasks", decidedBy: "Miles", status: "approved" },
  ],
  deckSlides: [
    { id: 1, order: 1, title: "Cover", content: "CMR.AI — AI-Native Counterparty Credit Risk Intelligence", notes: "" },
    { id: 2, order: 2, title: "The Problem", content: "$65B market plagued by manual workflows. Analysts spend 70% of time on data gathering.", notes: "" },
    { id: 3, order: 3, title: "Our Solution", content: "AI intelligence layer on top of existing bank systems. Weeks not months to deploy.", notes: "" },
    { id: 4, order: 4, title: "Market Opportunity", content: "$65B credit risk management TAM. Basel III/IV regulatory urgency.", notes: "" },
    { id: 5, order: 5, title: "Product Demo", content: "Five AI agent families: Portfolio, Exposure, Limits, Alerts, News Intelligence", notes: "" },
    { id: 6, order: 6, title: "Business Model", content: "SaaS + implementation. $500K-2M per client. Land CCR, expand market risk.", notes: "" },
    { id: 7, order: 7, title: "Traction", content: "SocGen committed as dev partner. Pipeline of 5 Tier-1 banks.", notes: "" },
    { id: 8, order: 8, title: "Team", content: "Dani (CEO), Antony (CRO), Miles (CTO), Alexia (Advisor)", notes: "" },
    { id: 9, order: 9, title: "Financials", content: "Path to $22M ARR by Year 5. Break-even Years 3-4.", notes: "" },
    { id: 10, order: 10, title: "The Ask", content: "F&F: $400-500K. Seed: $4M.", notes: "" },
  ],
  pitchPipeline: [
    { id: 1, name: "Angel Group A", contact: "Via Drew Stein", stage: "intro", amount: 50000, notes: "Legal connection", lastContact: "2026-02-05" },
    { id: 2, name: "Dani Personal", contact: "Dani", stage: "committed", amount: 50000, notes: "CEO minimum contribution", lastContact: "2026-02-01" },
  ],
  // Addressable Market — TAM potential clients
  addressableMarket: [
    { id: 1, name: "Société Générale", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "High", estimated_deal: 1500000, regulatory_pressure: "High", existing_systems: "Murex, Internal", notes: "Development partner already committed", status: "in_pipeline" },
    { id: 2, name: "JP Morgan", tier: "Tier 1", region: "North America", segment: "Investment Bank", ccr_complexity: "Very High", estimated_deal: 2000000, regulatory_pressure: "High", existing_systems: "Athena, Internal", notes: "Alexia's former employer — warm connections", status: "target" },
    { id: 3, name: "Goldman Sachs", tier: "Tier 1", region: "North America", segment: "Investment Bank", ccr_complexity: "Very High", estimated_deal: 2000000, regulatory_pressure: "High", existing_systems: "SecDB, Internal", notes: "", status: "target" },
    { id: 4, name: "BNP Paribas", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "High", estimated_deal: 1500000, regulatory_pressure: "High", existing_systems: "Calypso, Murex", notes: "Strong Paris presence", status: "target" },
    { id: 5, name: "Barclays", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "High", estimated_deal: 1200000, regulatory_pressure: "High", existing_systems: "Internal, Summit", notes: "", status: "target" },
    { id: 6, name: "Deutsche Bank", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "Very High", estimated_deal: 1500000, regulatory_pressure: "Very High", existing_systems: "Internal", notes: "Heavy regulatory pressure — ideal ICP", status: "target" },
    { id: 7, name: "Credit Agricole", tier: "Tier 1", region: "Europe", segment: "Universal Bank", ccr_complexity: "Medium", estimated_deal: 1000000, regulatory_pressure: "High", existing_systems: "Murex", notes: "", status: "target" },
    { id: 8, name: "Marex", tier: "Tier 2", region: "Europe", segment: "Broker-Dealer", ccr_complexity: "Medium", estimated_deal: 500000, regulatory_pressure: "Medium", existing_systems: "Mixed", notes: "Alexia's network — warm intro available", status: "in_pipeline" },
    { id: 9, name: "TP ICAP", tier: "Tier 2", region: "Europe", segment: "Broker-Dealer", ccr_complexity: "Medium", estimated_deal: 500000, regulatory_pressure: "Medium", existing_systems: "Mixed", notes: "Alexia's network", status: "in_pipeline" },
    { id: 10, name: "Scotia Bank", tier: "Tier 1", region: "North America", segment: "Universal Bank", ccr_complexity: "High", estimated_deal: 1200000, regulatory_pressure: "High", existing_systems: "Calypso, Internal", notes: "Antony's former employer", status: "target" },
    { id: 11, name: "HSBC", tier: "Tier 1", region: "Global", segment: "Universal Bank", ccr_complexity: "Very High", estimated_deal: 2000000, regulatory_pressure: "Very High", existing_systems: "Murex, Internal", notes: "", status: "target" },
    { id: 12, name: "Standard Chartered", tier: "Tier 1", region: "Global", segment: "Universal Bank", ccr_complexity: "High", estimated_deal: 1200000, regulatory_pressure: "High", existing_systems: "Murex", notes: "EM-focused — unique CCR challenges", status: "target" },
    { id: 13, name: "UBS", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "Very High", estimated_deal: 1800000, regulatory_pressure: "High", existing_systems: "Internal", notes: "Post-CS integration — systems in flux", status: "target" },
    { id: 14, name: "Nomura", tier: "Tier 1", region: "Asia", segment: "Investment Bank", ccr_complexity: "High", estimated_deal: 1200000, regulatory_pressure: "High", existing_systems: "Internal", notes: "", status: "target" },
    { id: 15, name: "Natixis", tier: "Tier 2", region: "Europe", segment: "Investment Bank", ccr_complexity: "Medium", estimated_deal: 800000, regulatory_pressure: "High", existing_systems: "Murex", notes: "Paris-based — Alexia's network", status: "target" },
    { id: 16, name: "Citi", tier: "Tier 1", region: "North America", segment: "Universal Bank", ccr_complexity: "Very High", estimated_deal: 2000000, regulatory_pressure: "High", existing_systems: "Internal", notes: "", status: "target" },
    { id: 17, name: "Morgan Stanley", tier: "Tier 1", region: "North America", segment: "Investment Bank", ccr_complexity: "Very High", estimated_deal: 1800000, regulatory_pressure: "High", existing_systems: "Internal", notes: "", status: "target" },
    { id: 18, name: "Bank of America", tier: "Tier 1", region: "North America", segment: "Universal Bank", ccr_complexity: "High", estimated_deal: 1500000, regulatory_pressure: "High", existing_systems: "Quartz, Internal", notes: "", status: "target" },
    { id: 19, name: "Macquarie", tier: "Tier 2", region: "Asia", segment: "Investment Bank", ccr_complexity: "Medium", estimated_deal: 600000, regulatory_pressure: "Medium", existing_systems: "Mixed", notes: "", status: "target" },
    { id: 20, name: "Jefferies", tier: "Tier 2", region: "North America", segment: "Investment Bank", ccr_complexity: "Medium", estimated_deal: 500000, regulatory_pressure: "Medium", existing_systems: "Mixed", notes: "Mid-market entry point", status: "target" },
  ],
  // CRM — Client Pipeline
  prospects: [
    { id: 1, company: "Société Générale", contact: "Christophe", role: "CCR Head", stage: "pilot_committed", owner: "Dani", lastContact: "2026-02-07", notes: "Development partner. Full support confirmed.", dealValue: 1500000, probability: 85, marketId: 1, comments: [{ id: 1, author: "Dani", date: "2026-02-07", text: "Christophe confirmed full team support for pilot." }, { id: 2, author: "Alexia", date: "2026-02-05", text: "Recommend positioning as innovation partner, not vendor." }] },
    { id: 2, company: "Marex", contact: "TBD", role: "Risk", stage: "warm_intro", owner: "Alexia", lastContact: "2026-01-20", notes: "European expansion target.", dealValue: 500000, probability: 20, marketId: 8, comments: [{ id: 1, author: "Alexia", date: "2026-01-20", text: "Will make intro after SocGen pilot shows results." }] },
    { id: 3, company: "TP ICAP", contact: "TBD", role: "Risk", stage: "warm_intro", owner: "Alexia", lastContact: "2026-01-15", notes: "Alexia's network.", dealValue: 500000, probability: 15, marketId: 9, comments: [] },
  ],
  financials: {
    runway: 0, monthlyBurn: 0, cashOnHand: 0,
    ffTarget: 450000, ffCommitted: 50000, seedTarget: 4000000,
  },
  financialDocs: [
    { id: 1, title: "Financial Model", driveLink: "https://docs.google.com/spreadsheets/d/1DnV6ExU8zyHENN0FgxDDjkVrJO7nzEqj/edit?usp=drive_link&ouid=109350579601617179499&rtpof=true&sd=true", description: "Full financial model — ARR, burn, headcount, scenario analysis" },
  ],
  legalDocs: [
    { id: 1, title: "Certificate of Incorporation", type: "corporate", status: "complete", driveLink: "", dueDate: "" },
    { id: 2, title: "Founder Agreement", type: "corporate", status: "in_progress", driveLink: "", dueDate: "2026-02-28" },
    { id: 3, title: "SAFE Note Template", type: "fundraising", status: "in_progress", driveLink: "", dueDate: "2026-03-01" },
    { id: 4, title: "IP Assignment Agreement", type: "ip", status: "pending", driveLink: "", dueDate: "2026-03-15" },
    { id: 5, title: "SocGen NDA", type: "client", status: "complete", driveLink: "", dueDate: "" },
    { id: 6, title: "Advisor Agreement — Alexia", type: "corporate", status: "in_progress", driveLink: "", dueDate: "2026-02-28" },
    { id: 7, title: "Anti-Harassment Policy", type: "compliance", status: "draft", driveLink: "", dueDate: "2026-03-15" },
    { id: 8, title: "Gender Balance Code", type: "compliance", status: "draft", driveLink: "", dueDate: "2026-03-15" },
  ],

  tasks: [
    { id: 1, title: "Finalize PostgreSQL schema", assignee: "Miles", priority: "high", status: "in_progress", module: "product", dueDate: "2026-02-14" },
    { id: 2, title: "Seed demo data (500 counterparties)", assignee: "Antony", priority: "high", status: "todo", module: "product", dueDate: "2026-02-16" },
    { id: 3, title: "Draft SAFE note with Drew", assignee: "Dani", priority: "high", status: "in_progress", module: "legal", dueDate: "2026-02-20" },
    { id: 4, title: "Investor intro via legal network", assignee: "Dani", priority: "medium", status: "todo", module: "investor", dueDate: "2026-02-25" },
    { id: 5, title: "Marex warm intro", assignee: "Alexia", priority: "medium", status: "todo", module: "crm", dueDate: "2026-02-28" },
    { id: 6, title: "Anti-harassment policy draft", assignee: "Dani", priority: "medium", status: "todo", module: "hr", dueDate: "2026-03-01" },
    { id: 7, title: "Gender balance code draft", assignee: "Alexia", priority: "medium", status: "todo", module: "hr", dueDate: "2026-03-01" },
    { id: 8, title: "FastAPI backend scaffolding", assignee: "Miles", priority: "high", status: "todo", module: "product", dueDate: "2026-02-21" },
    { id: 9, title: "LangChain agent framework", assignee: "Miles", priority: "high", status: "todo", module: "product", dueDate: "2026-02-28" },
    { id: 10, title: "Portfolio agent prototype", assignee: "Miles", priority: "critical", status: "todo", module: "product", dueDate: "2026-03-07" },
  ],
  team: [
    { id: 1, name: "Dani", role: "CEO", type: "Founder", equity: 30, location: "NYC", allocation: 100, gender: "F", email: "", startDate: "2025-10-01" },
    { id: 2, name: "Antony", role: "CRO", type: "Founder", equity: 25, location: "NYC", allocation: 100, gender: "M", email: "", startDate: "2025-10-01" },
    { id: 3, name: "Miles", role: "CTO", type: "Founder (Pending)", equity: 20, location: "Remote", allocation: 80, gender: "M", email: "", startDate: "2025-11-01" },
    { id: 4, name: "Alexia", role: "Strategic Advisor", type: "Advisor", equity: 5, location: "Paris", allocation: 18, gender: "F", email: "", startDate: "2025-10-01" },
  ],
  policies: [
    { id: 1, title: "Anti-Harassment Policy", status: "draft", version: "0.1", lastUpdated: "2026-02-09", content: "CMR.AI is committed to providing a workplace free from harassment of any kind. This policy applies to all founders, employees, contractors, and advisors.\n\n1. SCOPE: All work-related settings including offices, business trips, and digital communications.\n\n2. PROHIBITED CONDUCT: Sexual harassment, bullying, discrimination based on race, gender, age, religion, disability, sexual orientation, or any protected characteristic.\n\n3. REPORTING: Any team member who experiences or witnesses harassment should report to the designated compliance officer.\n\n4. INVESTIGATION: All complaints will be investigated promptly, thoroughly, and impartially.\n\n5. CONSEQUENCES: Violations may result in disciplinary action up to and including termination.\n\n6. NO RETALIATION: Retaliation against anyone who reports harassment is strictly prohibited.", acknowledgments: [] },
    { id: 2, title: "Gender Balance Code", status: "draft", version: "0.1", lastUpdated: "2026-02-09", content: "CMR.AI commits to gender balance as a core operating principle.\n\n1. TARGETS: Minimum 40% representation of each gender at every level by 2028.\n\n2. HIRING: All shortlists must include qualified candidates of each gender. Structured interviews with standardized scoring.\n\n3. PAY EQUITY: Annual pay equity audit. Zero tolerance for gender-based pay gaps.\n\n4. LEADERSHIP: Board targets 40/40/20.\n\n5. REPORTING: Quarterly gender metrics published to team.\n\n6. CULTURE: Active mentorship. Flexible working. Zero tolerance for bias.", acknowledgments: [] },
  ],
};

// ─── Shared Components ───
const Badge = ({ children, color = T.accent, bg }) => (
  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em", textTransform: "uppercase", color, background: bg || `${color}18`, whiteSpace: "nowrap" }}>{children}</span>
);

const statusMap = {
  done: { l: "Done", c: T.green }, complete: { l: "Complete", c: T.green }, active: { l: "Active", c: T.green },
  approved: { l: "Approved", c: T.green }, committed: { l: "Committed", c: T.green },
  pilot_committed: { l: "Pilot Committed", c: T.green }, live_client: { l: "Live Client", c: T.green },
  in_progress: { l: "In Progress", c: T.amber }, draft: { l: "Draft", c: T.textDim },
  pending: { l: "Pending", c: T.textMuted }, todo: { l: "To Do", c: T.textDim },
  upcoming: { l: "Upcoming", c: T.accent }, warm_intro: { l: "Warm Intro", c: T.accent },
  intro: { l: "Intro", c: T.textDim }, first_meeting: { l: "1st Meeting", c: T.accent },
  pilot_discussion: { l: "Pilot Discussion", c: T.amber }, negotiation: { l: "Negotiation", c: T.amber },
  critical: { l: "Critical", c: T.red }, high: { l: "High", c: T.amber },
  medium: { l: "Medium", c: T.accent }, low: { l: "Low", c: T.textDim },
  target: { l: "Target", c: T.textDim }, in_pipeline: { l: "In Pipeline", c: T.green },
  cold: { l: "Cold", c: T.textMuted },
};
const StatusBadge = ({ status }) => { const m = statusMap[status] || { l: status, c: T.textDim }; return <Badge color={m.c}>{m.l}</Badge>; };

const KPI = ({ label, value, sub, accent }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 22px", flex: 1, minWidth: 150 }}>
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: accent || T.text, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textDim, marginTop: 5 }}>{sub}</div>}
  </div>
);

const Btn = ({ children, onClick, primary, small, danger, style: s }) => (
  <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "5px 12px" : "8px 18px", background: danger ? `${T.red}20` : primary ? T.accent : "transparent", color: danger ? T.red : primary ? T.white : T.textDim, border: `1px solid ${danger ? `${T.red}40` : primary ? T.accent : T.border}`, borderRadius: 6, fontSize: small ? 12 : 13, fontFamily: "'Outfit', sans-serif", fontWeight: 500, cursor: "pointer", transition: "all 0.15s", ...s }}>{children}</button>
);

const Input = ({ value, onChange, placeholder, style: s, textarea, type = "text" }) => {
  const sh = { width: "100%", padding: "9px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", ...s };
  if (textarea) return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...sh, minHeight: 80, resize: "vertical" }} />;
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={sh} />;
};

const Select = ({ value, onChange, options, style: s }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "9px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer", ...s }}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
);

const Card = ({ children, style: s, onClick }) => (
  <div onClick={onClick} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: 20, transition: "all 0.15s", cursor: onClick ? "pointer" : "default", ...s }}>{children}</div>
);

const SectionTitle = ({ children, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: T.text }}>{children}</h3>
    {action}
  </div>
);

const Table = ({ columns, data, onRowClick }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>{columns.map((c, i) => (
        <th key={i} style={{ textAlign: "left", padding: "10px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap" }}>{c.label}</th>
      ))}</tr></thead>
      <tbody>{data.map((row, ri) => (
        <tr key={ri} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? "pointer" : "default" }} onMouseOver={e => e.currentTarget.style.background = T.cardHover} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
          {columns.map((c, ci) => (
            <td key={ci} style={{ padding: "10px 12px", fontSize: 13, color: T.text, borderBottom: `1px solid ${T.border}08`, whiteSpace: c.nowrap ? "nowrap" : "normal" }}>{c.render ? c.render(row) : row[c.key]}</td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, width: "100%", maxWidth: wide ? 860 : 540, maxHeight: "88vh", overflow: "auto", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.x}</button>
      </div>
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</label>
    {children}
  </div>
);

const DriveLink = ({ link, onChange }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    {Icons.link}
    <Input value={link} onChange={onChange} placeholder="Google Drive link..." style={{ flex: 1 }} />
    {link && <a href={link} target="_blank" rel="noopener" style={{ color: T.accent, fontSize: 12 }}>Open</a>}
  </div>
);

// Comments Component
const Comments = ({ comments = [], onAdd }) => {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Alexia");
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>{Icons.comment} Comments ({comments.length})</div>
      <div style={{ maxHeight: 200, overflow: "auto", marginBottom: 10 }}>
        {comments.map(c => (
          <div key={c.id} style={{ padding: "8px 12px", background: T.surface, borderRadius: 6, marginBottom: 6, borderLeft: `3px solid ${T.accent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.accent }}>{c.author}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted }}>{c.date}</span>
            </div>
            <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{c.text}</div>
          </div>
        ))}
        {comments.length === 0 && <div style={{ fontSize: 12, color: T.textMuted, padding: "8px 0" }}>No comments yet.</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Select value={author} onChange={setAuthor} options={["Dani", "Antony", "Miles", "Alexia"].map(n => ({ value: n, label: n }))} style={{ width: 100 }} />
        <Input value={text} onChange={setText} placeholder="Add a comment..." style={{ flex: 1 }} />
        <Btn small primary onClick={() => { if (text.trim()) { onAdd({ id: Date.now(), author, date: new Date().toISOString().slice(0, 10), text: text.trim() }); setText(""); } }}>Post</Btn>
      </div>
    </div>
  );
};

// Probability bar
const ProbBar = ({ value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 60, height: 6, background: T.border, borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: value >= 70 ? T.green : value >= 40 ? T.amber : T.red, borderRadius: 3, transition: "width 0.3s" }} />
    </div>
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: value >= 70 ? T.green : value >= 40 ? T.amber : T.red }}>{value}%</span>
  </div>
);

// ────────────────────────────────────────────
// COMMAND CENTER
// ────────────────────────────────────────────
const CommandCenter = ({ data, setData }) => {
  const { milestones, tasks, financials, prospects, team } = data;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const runway = financials.monthlyBurn > 0 ? Math.round((financials.cashOnHand + financials.ffCommitted) / financials.monthlyBurn) : null;
  const ffPct = financials.ffTarget > 0 ? Math.round((financials.ffCommitted / financials.ffTarget) * 100) : 0;
  const pipelineValue = prospects.reduce((a, p) => a + (p.dealValue || 0), 0);
  const weightedPipeline = prospects.reduce((a, p) => a + (p.dealValue || 0) * ((p.probability || 0) / 100), 0);

  // Live pipeline by stage for chart
  const stageOrder = ["cold", "warm_intro", "first_meeting", "pilot_discussion", "pilot_committed", "live_client"];
  const pipelineByStage = stageOrder.map(s => ({
    name: statusMap[s]?.l || s,
    value: prospects.filter(p => p.stage === s).reduce((a, p) => a + (p.dealValue || 0), 0),
    count: prospects.filter(p => p.stage === s).length,
  })).filter(s => s.count > 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Command Center</h2>
        <p style={{ color: T.textDim, fontSize: 14 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {runway !== null && <KPI label="Runway" value={`${runway}mo`} sub={`$${(financials.cashOnHand / 1000).toFixed(0)}K cash`} accent={runway < 6 ? T.red : T.green} />}
        <KPI label="F&F Raise" value={`${ffPct}%`} sub={`$${(financials.ffCommitted / 1000).toFixed(0)}K / $${(financials.ffTarget / 1000).toFixed(0)}K`} accent={T.gold} />
        <KPI label="Pipeline" value={`$${(pipelineValue / 1e6).toFixed(1)}M`} sub={`Weighted: $${(weightedPipeline / 1e6).toFixed(1)}M`} accent={T.accent} />
        <KPI label="Tasks" value={`${doneTasks}/${tasks.length}`} sub={`${tasks.filter(t => t.priority === "critical" || t.priority === "high").length} high priority`} />
        <KPI label="Team" value={team.length} sub={`${team.filter(t => t.gender === "F").length}F / ${team.filter(t => t.gender === "M").length}M`} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <SectionTitle>Milestones</SectionTitle>
          {milestones.sort((a, b) => new Date(a.date) - new Date(b.date)).map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", borderBottom: `1px solid ${T.border}08` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.status === "done" ? T.green : m.status === "in_progress" ? T.amber : T.textMuted, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13 }}>{m.title}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textDim }}>{m.date}</div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Client Pipeline by Stage</SectionTitle>
          {pipelineByStage.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={pipelineByStage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis type="number" stroke={T.textMuted} fontSize={10} fontFamily="'IBM Plex Mono', monospace" tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" stroke={T.textMuted} fontSize={11} width={100} fontFamily="'IBM Plex Mono', monospace" />
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={v => [`$${(v / 1e6).toFixed(1)}M`]} />
                <Bar dataKey="value" fill={T.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, fontSize: 13 }}>No prospects in pipeline yet</div>
          )}
        </Card>
      </div>
      <Card>
        <SectionTitle>Priority Tasks</SectionTitle>
        <Table columns={[
          { label: "Task", key: "title" }, { label: "Owner", key: "assignee", nowrap: true },
          { label: "Priority", render: r => <StatusBadge status={r.priority} />, nowrap: true },
          { label: "Status", render: r => <StatusBadge status={r.status} />, nowrap: true },
          { label: "Due", key: "dueDate", nowrap: true },
        ]} data={tasks.filter(t => t.status !== "done").sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.priority] ?? 9) - ({ critical: 0, high: 1, medium: 2, low: 3 }[b.priority] ?? 9)).slice(0, 8)} />
      </Card>
    </div>
  );
};

// ────────────────────────────────────────────
// PRODUCT HUB
// ────────────────────────────────────────────
const ProductHub = ({ data, setData }) => {
  const [modal, setModal] = useState(null);
  const [editSpec, setEditSpec] = useState(null);
  const [editDec, setEditDec] = useState(null);
  const saveSpec = s => { setData(d => ({ ...d, specs: s.id ? d.specs.map(x => x.id === s.id ? s : x) : [...d.specs, { ...s, id: Date.now() }] })); setEditSpec(null); };
  const saveDec = dec => { setData(d => ({ ...d, techDecisions: dec.id ? d.techDecisions.map(x => x.id === dec.id ? dec : x) : [...d.techDecisions, { ...dec, id: Date.now() }] })); setEditDec(null); };

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Product Hub</h2><p style={{ color: T.textDim, fontSize: 14 }}>Architecture, specifications & technical decisions</p></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Specs" value={data.specs.length} sub={`${data.specs.filter(s => s.status === "active").length} active`} />
        <KPI label="Decisions" value={data.techDecisions.length} sub={`${data.techDecisions.filter(d => d.status === "approved").length} approved`} />
        <KPI label="Agent Families" value="5" sub="25+ sub-agents" accent={T.accent} />
        <KPI label="Sprint Week" value="1/8" sub="MVP build sprint" />
      </div>
      <div style={{ marginBottom: 24 }}>
        <SectionTitle action={<Btn small onClick={() => setEditSpec({ title: "", version: "0.1", lastUpdated: new Date().toISOString().slice(0, 10), author: "", status: "draft", content: "", driveLink: "" })}>{Icons.plus} New Spec</Btn>}>Specifications</SectionTitle>
        <Table columns={[
          { label: "Document", key: "title" }, { label: "Version", key: "version", nowrap: true },
          { label: "Author", key: "author", nowrap: true }, { label: "Status", render: r => <StatusBadge status={r.status} />, nowrap: true },
          { label: "Updated", key: "lastUpdated", nowrap: true },
          { label: "", render: r => <button onClick={e => { e.stopPropagation(); setEditSpec(r); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button> },
        ]} data={data.specs} onRowClick={r => setModal(r)} />
      </div>
      <SectionTitle action={<Btn small onClick={() => setEditDec({ date: new Date().toISOString().slice(0, 10), decision: "", rationale: "", decidedBy: "", status: "pending" })}>{Icons.plus} Log Decision</Btn>}>Technical Decisions</SectionTitle>
      <Table columns={[
        { label: "Date", key: "date", nowrap: true }, { label: "Decision", key: "decision" },
        { label: "Rationale", key: "rationale" }, { label: "By", key: "decidedBy", nowrap: true },
        { label: "Status", render: r => <StatusBadge status={r.status} />, nowrap: true },
      ]} data={data.techDecisions} onRowClick={r => setEditDec(r)} />
      {modal && <Modal title={modal.title} onClose={() => setModal(null)} wide><div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7 }}>{modal.content}</div></Modal>}
      {editSpec && <Modal title={editSpec.id ? "Edit Spec" : "New Spec"} onClose={() => setEditSpec(null)}>
        <FormField label="Title"><Input value={editSpec.title} onChange={v => setEditSpec({ ...editSpec, title: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Version"><Input value={editSpec.version} onChange={v => setEditSpec({ ...editSpec, version: v })} /></FormField>
          <FormField label="Author"><Input value={editSpec.author} onChange={v => setEditSpec({ ...editSpec, author: v })} /></FormField>
          <FormField label="Status"><Select value={editSpec.status} onChange={v => setEditSpec({ ...editSpec, status: v })} options={[{ value: "draft", label: "Draft" }, { value: "active", label: "Active" }, { value: "archived", label: "Archived" }]} /></FormField>
        </div>
        <FormField label="Content"><Input textarea value={editSpec.content} onChange={v => setEditSpec({ ...editSpec, content: v })} /></FormField>
        <FormField label="Google Drive Link"><DriveLink link={editSpec.driveLink} onChange={v => setEditSpec({ ...editSpec, driveLink: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editSpec.id && <Btn danger onClick={() => { setData(d => ({ ...d, specs: d.specs.filter(x => x.id !== editSpec.id) })); setEditSpec(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditSpec(null)}>Cancel</Btn><Btn primary onClick={() => saveSpec(editSpec)}>Save</Btn></div>
      </Modal>}
      {editDec && <Modal title={editDec.id ? "Edit Decision" : "Log Decision"} onClose={() => setEditDec(null)}>
        <FormField label="Decision"><Input value={editDec.decision} onChange={v => setEditDec({ ...editDec, decision: v })} /></FormField>
        <FormField label="Rationale"><Input textarea value={editDec.rationale} onChange={v => setEditDec({ ...editDec, rationale: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Decided By"><Input value={editDec.decidedBy} onChange={v => setEditDec({ ...editDec, decidedBy: v })} /></FormField>
          <FormField label="Status"><Select value={editDec.status} onChange={v => setEditDec({ ...editDec, status: v })} options={[{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "revisit", label: "Revisit" }]} /></FormField>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editDec.id && <Btn danger onClick={() => { setData(d => ({ ...d, techDecisions: d.techDecisions.filter(x => x.id !== editDec.id) })); setEditDec(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditDec(null)}>Cancel</Btn><Btn primary onClick={() => saveDec(editDec)}>Save</Btn></div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// INVESTOR MODULE
// ────────────────────────────────────────────
const InvestorModule = ({ data, setData }) => {
  const [editSlide, setEditSlide] = useState(null);
  const [editInv, setEditInv] = useState(null);
  const totalCommitted = data.pitchPipeline.filter(p => p.stage === "committed").reduce((a, p) => a + p.amount, 0);
  const saveSlide = s => { setData(d => ({ ...d, deckSlides: s.id ? d.deckSlides.map(x => x.id === s.id ? s : x) : [...d.deckSlides, { ...s, id: Date.now(), order: d.deckSlides.length + 1 }] })); setEditSlide(null); };
  const saveInv = inv => { setData(d => ({ ...d, pitchPipeline: inv.id ? d.pitchPipeline.map(x => x.id === inv.id ? inv : x) : [...d.pitchPipeline, { ...inv, id: Date.now() }] })); setEditInv(null); };

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Investor & Capital Raise</h2></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="F&F Target" value={`$${(data.financials.ffTarget / 1000).toFixed(0)}K`} accent={T.gold} />
        <KPI label="Committed" value={`$${(totalCommitted / 1000).toFixed(0)}K`} sub={`${Math.round(totalCommitted / data.financials.ffTarget * 100)}%`} accent={totalCommitted >= data.financials.ffTarget ? T.green : T.amber} />
        <KPI label="Pipeline" value={data.pitchPipeline.length} sub={`${data.pitchPipeline.filter(p => p.stage === "committed").length} committed`} />
        <KPI label="Deck" value={`${data.deckSlides.length} slides`} accent={T.accent} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <SectionTitle action={<Btn small onClick={() => setEditSlide({ title: "", content: "", notes: "" })}>{Icons.plus} Add Slide</Btn>}>Investor Deck</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {data.deckSlides.sort((a, b) => a.order - b.order).map(s => (
            <Card key={s.id} onClick={() => setEditSlide(s)} style={{ cursor: "pointer", padding: 16 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.accent, marginBottom: 4 }}>SLIDE {s.order}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.content}</div>
            </Card>
          ))}
        </div>
      </div>
      <SectionTitle action={<Btn small onClick={() => setEditInv({ name: "", contact: "", stage: "intro", amount: 0, notes: "", lastContact: new Date().toISOString().slice(0, 10) })}>{Icons.plus} Add Investor</Btn>}>Pitch Pipeline</SectionTitle>
      <Table columns={[
        { label: "Investor", key: "name" }, { label: "Contact", key: "contact" },
        { label: "Stage", render: r => <StatusBadge status={r.stage} />, nowrap: true },
        { label: "Amount", render: r => `$${(r.amount / 1000).toFixed(0)}K`, nowrap: true },
        { label: "Last Contact", key: "lastContact", nowrap: true },
        { label: "", render: r => <button onClick={e => { e.stopPropagation(); setEditInv(r); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button> },
      ]} data={data.pitchPipeline} onRowClick={r => setEditInv(r)} />
      {editSlide && <Modal title={editSlide.id ? `Edit Slide ${editSlide.order}` : "New Slide"} onClose={() => setEditSlide(null)}>
        <FormField label="Title"><Input value={editSlide.title} onChange={v => setEditSlide({ ...editSlide, title: v })} /></FormField>
        <FormField label="Content"><Input textarea value={editSlide.content} onChange={v => setEditSlide({ ...editSlide, content: v })} /></FormField>
        <FormField label="Speaker Notes"><Input textarea value={editSlide.notes} onChange={v => setEditSlide({ ...editSlide, notes: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editSlide.id && <Btn danger onClick={() => { setData(d => ({ ...d, deckSlides: d.deckSlides.filter(x => x.id !== editSlide.id) })); setEditSlide(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditSlide(null)}>Cancel</Btn><Btn primary onClick={() => saveSlide(editSlide)}>Save</Btn>
        </div>
      </Modal>}
      {editInv && <Modal title={editInv.id ? "Edit Investor" : "Add Investor"} onClose={() => setEditInv(null)}>
        <FormField label="Name"><Input value={editInv.name} onChange={v => setEditInv({ ...editInv, name: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Contact"><Input value={editInv.contact} onChange={v => setEditInv({ ...editInv, contact: v })} /></FormField>
          <FormField label="Stage"><Select value={editInv.stage} onChange={v => setEditInv({ ...editInv, stage: v })} options={["intro", "meeting", "dd", "termsheet", "committed"].map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Amount ($)"><Input type="number" value={editInv.amount} onChange={v => setEditInv({ ...editInv, amount: parseInt(v) || 0 })} /></FormField>
          <FormField label="Last Contact"><Input type="date" value={editInv.lastContact} onChange={v => setEditInv({ ...editInv, lastContact: v })} /></FormField>
        </div>
        <FormField label="Notes"><Input textarea value={editInv.notes} onChange={v => setEditInv({ ...editInv, notes: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}><Btn onClick={() => setEditInv(null)}>Cancel</Btn><Btn primary onClick={() => saveInv(editInv)}>Save</Btn></div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// ADDRESSABLE MARKET (NEW MODULE)
// ────────────────────────────────────────────
const AddressableMarket = ({ data, setData }) => {
  const [editTarget, setEditTarget] = useState(null);
  const [filterTier, setFilterTier] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const market = data.addressableMarket || [];
  const filtered = market.filter(m => (filterTier === "all" || m.tier === filterTier) && (filterRegion === "all" || m.region === filterRegion));
  const totalTAM = market.reduce((a, m) => a + (m.estimated_deal || 0), 0);
  const inPipeline = market.filter(m => m.status === "in_pipeline");
  const pipelineIds = new Set((data.prospects || []).map(p => p.marketId));

  const addToPipeline = (target) => {
    if (pipelineIds.has(target.id)) return;
    const newProspect = {
      id: Date.now(), company: target.name, contact: "TBD", role: "TBD",
      stage: "cold", owner: "Dani", lastContact: new Date().toISOString().slice(0, 10),
      notes: `Added from addressable market. Systems: ${target.existing_systems}`, dealValue: target.estimated_deal,
      probability: 5, marketId: target.id, comments: [],
    };
    setData(d => ({
      ...d,
      prospects: [...d.prospects, newProspect],
      addressableMarket: d.addressableMarket.map(m => m.id === target.id ? { ...m, status: "in_pipeline" } : m),
    }));
  };

  const saveTarget = t => {
    setData(d => ({ ...d, addressableMarket: t.id ? d.addressableMarket.map(x => x.id === t.id ? t : x) : [...d.addressableMarket, { ...t, id: Date.now() }] }));
    setEditTarget(null);
  };

  const byRegion = market.reduce((acc, m) => { acc[m.region] = (acc[m.region] || 0) + m.estimated_deal; return acc; }, {});
  const regionData = Object.entries(byRegion).map(([name, value]) => ({ name, value }));
  const byTier = market.reduce((acc, m) => { acc[m.tier] = (acc[m.tier] || 0) + 1; return acc; }, {});
  const tierData = Object.entries(byTier).map(([name, value]) => ({ name, value }));
  const regionColors = [T.accent, T.gold, T.green, T.amber, T.red];

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Addressable Market</h2><p style={{ color: T.textDim, fontSize: 14 }}>Total addressable market — potential clients & conversion pipeline</p></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="TAM (Identified)" value={`$${(totalTAM / 1e6).toFixed(0)}M`} sub={`${market.length} potential clients`} accent={T.gold} />
        <KPI label="In Pipeline" value={inPipeline.length} sub={`$${(inPipeline.reduce((a, m) => a + m.estimated_deal, 0) / 1e6).toFixed(1)}M`} accent={T.green} />
        <KPI label="Targets" value={market.filter(m => m.status === "target").length} sub="not yet in pipeline" />
        <KPI label="Avg Deal Size" value={`$${(totalTAM / market.length / 1e6).toFixed(1)}M`} accent={T.accent} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>TAM by Region</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={regionData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} strokeWidth={0}>
                {regionData.map((d, i) => <Cell key={i} fill={regionColors[i % regionColors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={v => [`$${(v / 1e6).toFixed(1)}M`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            {regionData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textDim }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: regionColors[i % regionColors.length] }} />{d.name}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Client Distribution by Tier</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={tierData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="name" stroke={T.textMuted} fontSize={11} fontFamily="'IBM Plex Mono', monospace" />
              <YAxis stroke={T.textMuted} fontSize={10} />
              <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} />
              <Bar dataKey="value" fill={T.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Select value={filterTier} onChange={setFilterTier} options={[{ value: "all", label: "All Tiers" }, { value: "Tier 1", label: "Tier 1" }, { value: "Tier 2", label: "Tier 2" }]} />
        <Select value={filterRegion} onChange={setFilterRegion} options={[{ value: "all", label: "All Regions" }, ...Object.keys(byRegion).map(r => ({ value: r, label: r }))]} />
        <div style={{ flex: 1 }} />
        <Btn small primary onClick={() => setEditTarget({ name: "", tier: "Tier 1", region: "Europe", segment: "Investment Bank", ccr_complexity: "High", estimated_deal: 1000000, regulatory_pressure: "High", existing_systems: "", notes: "", status: "target" })}>{Icons.plus} Add Target</Btn>
      </div>

      <Table columns={[
        { label: "Institution", render: r => <span style={{ fontWeight: 500 }}>{r.name}</span> },
        { label: "Tier", render: r => <Badge color={r.tier === "Tier 1" ? T.gold : T.accent}>{r.tier}</Badge>, nowrap: true },
        { label: "Region", key: "region", nowrap: true },
        { label: "Segment", key: "segment", nowrap: true },
        { label: "CCR Complexity", key: "ccr_complexity", nowrap: true },
        { label: "Est. Deal", render: r => `$${(r.estimated_deal / 1e6).toFixed(1)}M`, nowrap: true },
        { label: "Reg. Pressure", key: "regulatory_pressure", nowrap: true },
        { label: "Status", render: r => <StatusBadge status={r.status} />, nowrap: true },
        { label: "", render: r => (
          <div style={{ display: "flex", gap: 6 }}>
            {r.status === "target" && <Btn small onClick={e => { e.stopPropagation(); addToPipeline(r); }} style={{ fontSize: 10, padding: "3px 8px" }}>{Icons.arrowRight} Pipeline</Btn>}
            <button onClick={e => { e.stopPropagation(); setEditTarget(r); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button>
          </div>
        )},
      ]} data={filtered} onRowClick={r => setEditTarget(r)} />

      {editTarget && <Modal title={editTarget.id ? "Edit Market Target" : "Add Target"} onClose={() => setEditTarget(null)}>
        <FormField label="Institution Name"><Input value={editTarget.name} onChange={v => setEditTarget({ ...editTarget, name: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Tier"><Select value={editTarget.tier} onChange={v => setEditTarget({ ...editTarget, tier: v })} options={[{ value: "Tier 1", label: "Tier 1" }, { value: "Tier 2", label: "Tier 2" }, { value: "Tier 3", label: "Tier 3" }]} /></FormField>
          <FormField label="Region"><Select value={editTarget.region} onChange={v => setEditTarget({ ...editTarget, region: v })} options={["Europe", "North America", "Asia", "Global", "Middle East", "Latin America"].map(r => ({ value: r, label: r }))} /></FormField>
          <FormField label="Segment"><Select value={editTarget.segment} onChange={v => setEditTarget({ ...editTarget, segment: v })} options={["Investment Bank", "Universal Bank", "Broker-Dealer", "Asset Manager", "Hedge Fund", "Insurance"].map(s => ({ value: s, label: s }))} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="CCR Complexity"><Select value={editTarget.ccr_complexity} onChange={v => setEditTarget({ ...editTarget, ccr_complexity: v })} options={["Low", "Medium", "High", "Very High"].map(s => ({ value: s, label: s }))} /></FormField>
          <FormField label="Est. Deal ($)"><Input type="number" value={editTarget.estimated_deal} onChange={v => setEditTarget({ ...editTarget, estimated_deal: parseInt(v) || 0 })} /></FormField>
          <FormField label="Reg. Pressure"><Select value={editTarget.regulatory_pressure} onChange={v => setEditTarget({ ...editTarget, regulatory_pressure: v })} options={["Low", "Medium", "High", "Very High"].map(s => ({ value: s, label: s }))} /></FormField>
        </div>
        <FormField label="Existing Systems"><Input value={editTarget.existing_systems} onChange={v => setEditTarget({ ...editTarget, existing_systems: v })} placeholder="Murex, Calypso, Internal..." /></FormField>
        <FormField label="Notes"><Input textarea value={editTarget.notes} onChange={v => setEditTarget({ ...editTarget, notes: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editTarget.id && <Btn danger onClick={() => { setData(d => ({ ...d, addressableMarket: d.addressableMarket.filter(x => x.id !== editTarget.id) })); setEditTarget(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditTarget(null)}>Cancel</Btn><Btn primary onClick={() => saveTarget(editTarget)}>Save</Btn>
        </div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// CRM & CLIENT PIPELINE (with analytics, comments, probability)
// ────────────────────────────────────────────
const CRMModule = ({ data, setData }) => {
  const [editProspect, setEditProspect] = useState(null);
  const [view, setView] = useState("pipeline"); // pipeline | analytics
  const stageOrder = ["cold", "warm_intro", "first_meeting", "pilot_discussion", "pilot_committed", "live_client"];
  const stages = stageOrder.map(s => ({ value: s, label: statusMap[s]?.l || s }));
  const prospects = data.prospects || [];

  const saveProspect = p => {
    setData(d => ({ ...d, prospects: p.id ? d.prospects.map(x => x.id === p.id ? p : x) : [...d.prospects, { ...p, id: Date.now() }] }));
    setEditProspect(null);
  };

  const addComment = (prospectId, comment) => {
    setData(d => ({ ...d, prospects: d.prospects.map(p => p.id === prospectId ? { ...p, comments: [...(p.comments || []), comment] } : p) }));
  };

  const pipelineValue = prospects.reduce((a, p) => a + (p.dealValue || 0), 0);
  const weightedPipeline = prospects.reduce((a, p) => a + (p.dealValue || 0) * ((p.probability || 0) / 100), 0);
  const avgProb = prospects.length ? Math.round(prospects.reduce((a, p) => a + (p.probability || 0), 0) / prospects.length) : 0;

  // Analytics data
  const byStage = stageOrder.map(s => ({ name: statusMap[s]?.l || s, count: prospects.filter(p => p.stage === s).length, value: prospects.filter(p => p.stage === s).reduce((a, p) => a + (p.dealValue || 0), 0) }));
  const byOwner = ["Dani", "Antony", "Miles", "Alexia"].map(o => ({ name: o, count: prospects.filter(p => p.owner === o).length, value: prospects.filter(p => p.owner === o).reduce((a, p) => a + (p.dealValue || 0), 0), weighted: prospects.filter(p => p.owner === o).reduce((a, p) => a + (p.dealValue || 0) * ((p.probability || 0) / 100), 0) }));
  const stageColors = [T.textMuted, T.accent, "#6366f1", T.amber, T.green, T.gold];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>CRM & Client Pipeline</h2>
        <p style={{ color: T.textDim, fontSize: 14 }}>Prospect management with conversion tracking & analytics</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Total Pipeline" value={`$${(pipelineValue / 1e6).toFixed(1)}M`} accent={T.gold} />
        <KPI label="Weighted Pipeline" value={`$${(weightedPipeline / 1e6).toFixed(1)}M`} sub="probability-adjusted" accent={T.accent} />
        <KPI label="Prospects" value={prospects.length} sub={`${prospects.filter(p => p.stage === "pilot_committed" || p.stage === "live_client").length} committed`} />
        <KPI label="Avg Conversion" value={`${avgProb}%`} accent={avgProb >= 40 ? T.green : T.amber} />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <Btn small={view !== "pipeline"} primary={view === "pipeline"} onClick={() => setView("pipeline")}>Pipeline</Btn>
        <Btn small={view !== "analytics"} primary={view === "analytics"} onClick={() => setView("analytics")}>{Icons.chart} Analytics</Btn>
        <div style={{ flex: 1 }} />
        <Btn small primary onClick={() => setEditProspect({ company: "", contact: "", role: "", stage: "cold", owner: "Dani", lastContact: new Date().toISOString().slice(0, 10), notes: "", dealValue: 0, probability: 10, marketId: null, comments: [] })}>{Icons.plus} Add Prospect</Btn>
      </div>

      {view === "pipeline" && (
        <Table columns={[
          { label: "Company", render: r => <span style={{ fontWeight: 500 }}>{r.company}</span> },
          { label: "Contact", key: "contact", nowrap: true },
          { label: "Stage", render: r => <StatusBadge status={r.stage} />, nowrap: true },
          { label: "Probability", render: r => <ProbBar value={r.probability || 0} />, nowrap: true },
          { label: "Deal Value", render: r => `$${(r.dealValue / 1e6).toFixed(1)}M`, nowrap: true },
          { label: "Weighted", render: r => `$${((r.dealValue || 0) * ((r.probability || 0) / 100) / 1000).toFixed(0)}K`, nowrap: true },
          { label: "Owner", key: "owner", nowrap: true },
          { label: "Comments", render: r => <span style={{ color: T.textDim, display: "flex", alignItems: "center", gap: 4 }}>{Icons.comment} {(r.comments || []).length}</span>, nowrap: true },
          { label: "Last Contact", key: "lastContact", nowrap: true },
          { label: "", render: r => <button onClick={e => { e.stopPropagation(); setEditProspect(r); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button> },
        ]} data={prospects.sort((a, b) => stageOrder.indexOf(b.stage) - stageOrder.indexOf(a.stage))} onRowClick={r => setEditProspect(r)} />
      )}

      {view === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Pipeline by Stage (Value)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byStage.filter(s => s.count > 0)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis type="number" stroke={T.textMuted} fontSize={10} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
                <YAxis type="category" dataKey="name" stroke={T.textMuted} fontSize={11} width={100} fontFamily="'IBM Plex Mono', monospace" />
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={v => [`$${(v / 1e6).toFixed(1)}M`]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {byStage.filter(s => s.count > 0).map((s, i) => <Cell key={i} fill={stageColors[stageOrder.indexOf(stageOrder.find(st => (statusMap[st]?.l || st) === s.name)) % stageColors.length] || T.accent} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Pipeline by Owner</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byOwner.filter(o => o.count > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="name" stroke={T.textMuted} fontSize={11} fontFamily="'IBM Plex Mono', monospace" />
                <YAxis stroke={T.textMuted} fontSize={10} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={v => [`$${(v / 1e6).toFixed(1)}M`]} />
                <Bar dataKey="value" fill={T.accent} radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="weighted" fill={T.gold} radius={[4, 4, 0, 0]} name="Weighted" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Conversion Funnel</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 140, padding: "0 20px" }}>
              {stageOrder.map((stage, i) => {
                const count = prospects.filter(p => p.stage === stage).length;
                const maxCount = Math.max(...stageOrder.map(s => prospects.filter(p => p.stage === s).length), 1);
                const height = Math.max((count / maxCount) * 120, count > 0 ? 20 : 4);
                return (
                  <div key={stage} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, color: count > 0 ? T.text : T.textMuted }}>{count}</div>
                    <div style={{ width: "100%", height, background: stageColors[i], borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textMuted, textAlign: "center", lineHeight: 1.2 }}>{statusMap[stage]?.l}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {editProspect && <Modal title={editProspect.id ? `${editProspect.company}` : "Add Prospect"} onClose={() => setEditProspect(null)} wide>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Company"><Input value={editProspect.company} onChange={v => setEditProspect({ ...editProspect, company: v })} /></FormField>
          <FormField label="Contact"><Input value={editProspect.contact} onChange={v => setEditProspect({ ...editProspect, contact: v })} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Role"><Input value={editProspect.role} onChange={v => setEditProspect({ ...editProspect, role: v })} /></FormField>
          <FormField label="Stage"><Select value={editProspect.stage} onChange={v => setEditProspect({ ...editProspect, stage: v })} options={stages} /></FormField>
          <FormField label="Owner"><Select value={editProspect.owner} onChange={v => setEditProspect({ ...editProspect, owner: v })} options={["Dani", "Antony", "Miles", "Alexia"].map(n => ({ value: n, label: n }))} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Deal Value ($)"><Input type="number" value={editProspect.dealValue} onChange={v => setEditProspect({ ...editProspect, dealValue: parseInt(v) || 0 })} /></FormField>
          <FormField label="Conversion Probability (%)"><Input type="number" value={editProspect.probability} onChange={v => setEditProspect({ ...editProspect, probability: Math.min(100, Math.max(0, parseInt(v) || 0)) })} /></FormField>
          <FormField label="Last Contact"><Input type="date" value={editProspect.lastContact} onChange={v => setEditProspect({ ...editProspect, lastContact: v })} /></FormField>
        </div>
        <FormField label="Notes"><Input textarea value={editProspect.notes} onChange={v => setEditProspect({ ...editProspect, notes: v })} /></FormField>

        {editProspect.id && <Comments comments={editProspect.comments || []} onAdd={comment => {
          const updated = { ...editProspect, comments: [...(editProspect.comments || []), comment] };
          setEditProspect(updated);
          addComment(editProspect.id, comment);
        }} />}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editProspect.id && <Btn danger onClick={() => { setData(d => ({ ...d, prospects: d.prospects.filter(x => x.id !== editProspect.id) })); setEditProspect(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditProspect(null)}>Cancel</Btn><Btn primary onClick={() => saveProspect(editProspect)}>Save</Btn>
        </div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// FINANCIAL PROJECTIONS
// ────────────────────────────────────────────
const FinancialModule = ({ data, setData }) => {
  const f = data.financials;
  const [editDoc, setEditDoc] = useState(null);
  const financialDocs = data.financialDocs || [];
  const weightedPipeline = (data.prospects || []).reduce((a, p) => a + (p.dealValue || 0) * ((p.probability || 0) / 100), 0);
  const totalPipeline = (data.prospects || []).reduce((a, p) => a + (p.dealValue || 0), 0);
  const updateF = (k, v) => setData(d => ({ ...d, financials: { ...d.financials, [k]: v } }));
  const saveDoc = doc => { setData(d => ({ ...d, financialDocs: doc.id ? (d.financialDocs || []).map(x => x.id === doc.id ? doc : x) : [...(d.financialDocs || []), { ...doc, id: Date.now() }] })); setEditDoc(null); };
  const runway = f.monthlyBurn > 0 ? Math.round((f.cashOnHand + f.ffCommitted) / f.monthlyBurn) : "—";

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Financials</h2><p style={{ color: T.textDim, fontSize: 14 }}>Live data from CRM pipeline · Enter your actuals below</p></div>

      {/* KPIs — only live/real data */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="F&F Target" value={`$${(f.ffTarget / 1000).toFixed(0)}K`} accent={T.gold} />
        <KPI label="F&F Committed" value={`$${(f.ffCommitted / 1000).toFixed(0)}K`} sub={`${Math.round(f.ffCommitted / f.ffTarget * 100)}% of target`} accent={f.ffCommitted >= f.ffTarget ? T.green : T.amber} />
        <KPI label="Wtd Pipeline" value={`$${(weightedPipeline / 1e6).toFixed(1)}M`} sub={`$${(totalPipeline / 1e6).toFixed(1)}M total · from CRM`} accent={T.accent} />
        {f.monthlyBurn > 0 && <KPI label="Runway" value={`${runway}mo`} sub={`$${(f.cashOnHand / 1000).toFixed(0)}K cash · $${(f.monthlyBurn / 1000).toFixed(0)}K/mo burn`} accent={runway !== "—" && runway < 6 ? T.red : T.green} />}
      </div>

      {/* Editable actuals — user enters real numbers */}
      <Card style={{ marginBottom: 24 }}>
        <SectionTitle>Your Numbers</SectionTitle>
        <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 14 }}>Enter your real figures. Runway auto-calculates.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Cash on Hand ($)"><Input type="number" value={f.cashOnHand || ""} onChange={v => updateF("cashOnHand", parseInt(v) || 0)} placeholder="0" /></FormField>
          <FormField label="Monthly Burn ($)"><Input type="number" value={f.monthlyBurn || ""} onChange={v => updateF("monthlyBurn", parseInt(v) || 0)} placeholder="0" /></FormField>
          <FormField label="F&F Target ($)"><Input type="number" value={f.ffTarget} onChange={v => updateF("ffTarget", parseInt(v) || 0)} /></FormField>
          <FormField label="F&F Committed ($)"><Input type="number" value={f.ffCommitted} onChange={v => updateF("ffCommitted", parseInt(v) || 0)} /></FormField>
        </div>
      </Card>

      {/* Embedded Financial Model — live from Google Sheets */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <SectionTitle>Financial Model — Live</SectionTitle>
          <a href="https://docs.google.com/spreadsheets/d/1DnV6ExU8zyHENN0FgxDDjkVrJO7nzEqj/edit?usp=drive_link&ouid=109350579601617179499&rtpof=true&sd=true" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.accent, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>{Icons.link} Open Full Sheet</a>
        </div>
        <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>To enable the live embed: open the spreadsheet in Google Drive → File → Save as Google Sheets. Then set sharing to "Anyone with the link."</p>
        <iframe
          src="https://docs.google.com/spreadsheets/d/1DnV6ExU8zyHENN0FgxDDjkVrJO7nzEqj/preview"
          style={{ width: "100%", height: 500, border: `1px solid ${T.border}`, borderRadius: 8, background: T.surface }}
          title="CMR.AI Financial Model"
          allow="autoplay"
        />
      </Card>

      {/* Additional Drive models */}
      <SectionTitle action={<div style={{ display: "flex", gap: 8 }}>
        <a href="https://drive.google.com/drive/folders/1o5Rfwq4PiLTs2zAvrH9Nkds9aZa5UyUG" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, color: T.accent, textDecoration: "none", fontFamily: "'Outfit', sans-serif" }}>{Icons.link} Open Drive</a>
        <Btn small onClick={() => setEditDoc({ title: "", driveLink: "", description: "" })}>{Icons.plus} Add Model</Btn>
      </div>}>Linked Documents</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {financialDocs.map(doc => (
          <Card key={doc.id} style={{ padding: 16, cursor: "pointer" }} onClick={() => setEditDoc(doc)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{doc.title}</div>
              {doc.driveLink ? <span style={{ color: T.green, flexShrink: 0 }}>{Icons.check}</span> : <span style={{ color: T.textMuted, flexShrink: 0 }}>{Icons.link}</span>}
            </div>
            <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.4, marginBottom: 8 }}>{doc.description}</div>
            {doc.driveLink ? <a href={doc.driveLink} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: T.accent, textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace" }}>Open in Drive →</a> : <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'IBM Plex Mono', monospace" }}>No link yet</span>}
          </Card>
        ))}
      </div>

      {editDoc && <Modal title={editDoc.id ? "Edit Model" : "Add Financial Model"} onClose={() => setEditDoc(null)}>
        <FormField label="Title"><Input value={editDoc.title} onChange={v => setEditDoc({ ...editDoc, title: v })} /></FormField>
        <FormField label="Description"><Input textarea value={editDoc.description} onChange={v => setEditDoc({ ...editDoc, description: v })} /></FormField>
        <FormField label="Google Drive Link"><DriveLink link={editDoc.driveLink} onChange={v => setEditDoc({ ...editDoc, driveLink: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editDoc.id && <Btn danger onClick={() => { setData(d => ({ ...d, financialDocs: (d.financialDocs || []).filter(x => x.id !== editDoc.id) })); setEditDoc(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditDoc(null)}>Cancel</Btn><Btn primary onClick={() => saveDoc(editDoc)}>Save</Btn>
        </div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// LEGAL
// ────────────────────────────────────────────
const LegalModule = ({ data, setData }) => {
  const [editDoc, setEditDoc] = useState(null);
  const types = ["corporate", "fundraising", "client", "ip", "compliance", "employment"];
  const saveDoc = doc => { setData(d => ({ ...d, legalDocs: doc.id ? d.legalDocs.map(x => x.id === doc.id ? doc : x) : [...d.legalDocs, { ...doc, id: Date.now() }] })); setEditDoc(null); };
  const byType = types.reduce((acc, t) => { acc[t] = data.legalDocs.filter(d => d.type === t); return acc; }, {});
  const complete = data.legalDocs.filter(d => d.status === "complete").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Legal & Corporate</h2></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Documents" value={data.legalDocs.length} sub={`${complete} complete`} />
        <KPI label="Completion" value={`${Math.round(complete / data.legalDocs.length * 100)}%`} accent={complete / data.legalDocs.length > 0.7 ? T.green : T.amber} />
      </div>
      <SectionTitle action={<Btn small onClick={() => setEditDoc({ title: "", type: "corporate", status: "pending", driveLink: "", dueDate: "" })}>{Icons.plus} Add Document</Btn>}>Documents</SectionTitle>
      {types.filter(t => byType[t]?.length > 0).map(t => (
        <div key={t} style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{t}</div>
          {byType[t].map(doc => (
            <div key={doc.id} onClick={() => setEditDoc(doc)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", cursor: "pointer", borderRadius: 6 }} onMouseOver={e => e.currentTarget.style.background = T.cardHover} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ flex: 1, fontSize: 13 }}>{doc.title}</div>
              <StatusBadge status={doc.status} />
              {doc.dueDate && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textDim }}>{doc.dueDate}</span>}
              {doc.driveLink && <span style={{ color: T.accent }}>{Icons.link}</span>}
            </div>
          ))}
        </div>
      ))}
      {editDoc && <Modal title={editDoc.id ? "Edit Document" : "Add Document"} onClose={() => setEditDoc(null)}>
        <FormField label="Title"><Input value={editDoc.title} onChange={v => setEditDoc({ ...editDoc, title: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Type"><Select value={editDoc.type} onChange={v => setEditDoc({ ...editDoc, type: v })} options={types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} /></FormField>
          <FormField label="Status"><Select value={editDoc.status} onChange={v => setEditDoc({ ...editDoc, status: v })} options={[{ value: "pending", label: "Pending" }, { value: "draft", label: "Draft" }, { value: "in_progress", label: "In Progress" }, { value: "complete", label: "Complete" }]} /></FormField>
          <FormField label="Due Date"><Input type="date" value={editDoc.dueDate} onChange={v => setEditDoc({ ...editDoc, dueDate: v })} /></FormField>
        </div>
        <FormField label="Google Drive Link"><DriveLink link={editDoc.driveLink} onChange={v => setEditDoc({ ...editDoc, driveLink: v })} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editDoc.id && <Btn danger onClick={() => { setData(d => ({ ...d, legalDocs: d.legalDocs.filter(x => x.id !== editDoc.id) })); setEditDoc(null); }}>{Icons.trash} Delete</Btn>}
          <Btn onClick={() => setEditDoc(null)}>Cancel</Btn><Btn primary onClick={() => saveDoc(editDoc)}>Save</Btn>
        </div>
      </Modal>}
    </div>
  );
};



// ────────────────────────────────────────────
// TASK TRACKER
// ────────────────────────────────────────────
const TaskTracker = ({ data, setData }) => {
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const saveTask = t => { setData(d => ({ ...d, tasks: t.id ? d.tasks.map(x => x.id === t.id ? t : x) : [...d.tasks, { ...t, id: Date.now() }] })); setEditTask(null); };
  const toggleStatus = task => { const next = { todo: "in_progress", in_progress: "done", done: "todo" }; setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === task.id ? { ...t, status: next[t.status] || "todo" } : t) })); };
  const filtered = data.tasks.filter(t => (filter === "all" || t.status === filter) && (filterAssignee === "all" || t.assignee === filterAssignee));
  const byStatus = { todo: filtered.filter(t => t.status === "todo"), in_progress: filtered.filter(t => t.status === "in_progress"), done: filtered.filter(t => t.status === "done") };
  const modules = ["product", "investor", "crm", "financial", "legal", "hr", "market"];

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>Task Tracker</h2></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <KPI label="Total" value={data.tasks.length} />
        <KPI label="To Do" value={data.tasks.filter(t => t.status === "todo").length} accent={T.textDim} />
        <KPI label="In Progress" value={data.tasks.filter(t => t.status === "in_progress").length} accent={T.amber} />
        <KPI label="Done" value={data.tasks.filter(t => t.status === "done").length} accent={T.green} />
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Select value={filter} onChange={setFilter} options={[{ value: "all", label: "All Status" }, { value: "todo", label: "To Do" }, { value: "in_progress", label: "In Progress" }, { value: "done", label: "Done" }]} />
        <Select value={filterAssignee} onChange={setFilterAssignee} options={[{ value: "all", label: "All Assignees" }, ...["Dani", "Antony", "Miles", "Alexia"].map(n => ({ value: n, label: n }))]} />
        <div style={{ flex: 1 }} />
        <Btn small primary onClick={() => setEditTask({ title: "", assignee: "Dani", priority: "medium", status: "todo", module: "product", dueDate: "" })}>{Icons.plus} New Task</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {[["todo", "To Do", T.textDim], ["in_progress", "In Progress", T.amber], ["done", "Done", T.green]].map(([status, label, color]) => (
          <div key={status}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} /> {label} ({byStatus[status].length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {byStatus[status].sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.priority] ?? 9) - ({ critical: 0, high: 1, medium: 2, low: 3 }[b.priority] ?? 9)).map(task => (
                <Card key={task.id} style={{ padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, flex: 1, lineHeight: 1.3 }}>{task.title}</div>
                    <button onClick={() => toggleStatus(task)} style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: 4, width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: task.status === "done" ? T.green : T.textMuted, flexShrink: 0 }}>{task.status === "done" ? Icons.check : ""}</button>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <StatusBadge status={task.priority} />
                    <Badge color={T.textDim}>{task.module}</Badge>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textDim, marginLeft: "auto" }}>{task.assignee}</span>
                  </div>
                  {task.dueDate && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: new Date(task.dueDate) < new Date() && task.status !== "done" ? T.red : T.textMuted, marginTop: 5 }}>Due: {task.dueDate}</div>}
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <button onClick={() => setEditTask(task)} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: 11 }}>{Icons.edit}</button>
                    <button onClick={() => setData(d => ({ ...d, tasks: d.tasks.filter(t => t.id !== task.id) }))} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 11 }}>{Icons.trash}</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      {editTask && <Modal title={editTask.id ? "Edit Task" : "New Task"} onClose={() => setEditTask(null)}>
        <FormField label="Title"><Input value={editTask.title} onChange={v => setEditTask({ ...editTask, title: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Assignee"><Select value={editTask.assignee} onChange={v => setEditTask({ ...editTask, assignee: v })} options={["Dani", "Antony", "Miles", "Alexia"].map(n => ({ value: n, label: n }))} /></FormField>
          <FormField label="Priority"><Select value={editTask.priority} onChange={v => setEditTask({ ...editTask, priority: v })} options={[{ value: "critical", label: "Critical" }, { value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }]} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Module"><Select value={editTask.module} onChange={v => setEditTask({ ...editTask, module: v })} options={modules.map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))} /></FormField>
          <FormField label="Due Date"><Input type="date" value={editTask.dueDate} onChange={v => setEditTask({ ...editTask, dueDate: v })} /></FormField>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}><Btn onClick={() => setEditTask(null)}>Cancel</Btn><Btn primary onClick={() => saveTask(editTask)}>Save</Btn></div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// HR & PEOPLE
// ────────────────────────────────────────────
const HRModule = ({ data, setData }) => {
  const [editMember, setEditMember] = useState(null);
  const [viewPolicy, setViewPolicy] = useState(null);
  const [editPolicy, setEditPolicy] = useState(null);
  const saveMember = m => { setData(d => ({ ...d, team: m.id ? d.team.map(x => x.id === m.id ? m : x) : [...d.team, { ...m, id: Date.now() }] })); setEditMember(null); };
  const savePolicy = p => { setData(d => ({ ...d, policies: p.id ? d.policies.map(x => x.id === p.id ? p : x) : [...d.policies, { ...p, id: Date.now() }] })); setEditPolicy(null); };
  const totalEquity = data.team.reduce((a, m) => a + (m.equity || 0), 0);
  const f = data.team.filter(m => m.gender === "F").length;
  const m = data.team.filter(m => m.gender === "M").length;
  const genderData = [{ name: "Female", value: f, color: T.gold }, { name: "Male", value: m, color: T.accent }].filter(d => d.value > 0);
  const equityData = data.team.filter(m => m.equity > 0).map(m => ({ name: m.name, value: m.equity }));
  if (totalEquity < 100) equityData.push({ name: "Unallocated", value: 100 - totalEquity });
  const ec = [T.accent, T.gold, T.green, T.amber, T.red, T.textDim];

  return (
    <div>
      <div style={{ marginBottom: 28 }}><h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, marginBottom: 4 }}>HR & People</h2></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <KPI label="Team" value={data.team.length} />
        <KPI label="Gender Balance" value={`${f}F / ${m}M`} accent={f / data.team.length >= 0.4 ? T.green : T.amber} sub={`${Math.round(f / data.team.length * 100)}% female`} />
        <KPI label="Equity" value={`${totalEquity}%`} sub={`${100 - totalEquity}% unallocated`} />
        <KPI label="Policies" value={data.policies.length} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <SectionTitle action={<Btn small onClick={() => setEditMember({ name: "", role: "", type: "Employee", equity: 0, location: "", allocation: 100, gender: "", email: "", startDate: new Date().toISOString().slice(0, 10) })}>{Icons.plus} Add Member</Btn>}>Team Directory</SectionTitle>
          <Table columns={[
            { label: "Name", key: "name" }, { label: "Role", key: "role" },
            { label: "Type", render: r => <Badge>{r.type}</Badge>, nowrap: true },
            { label: "Equity", render: r => `${r.equity}%`, nowrap: true },
            { label: "Location", key: "location", nowrap: true },
            { label: "Allocation", render: r => `${r.allocation}%`, nowrap: true },
            { label: "Gender", key: "gender", nowrap: true },
            { label: "", render: r => <button onClick={e => { e.stopPropagation(); setEditMember(r); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button> },
          ]} data={data.team} onRowClick={r => setEditMember(r)} />
        </div>
        <div>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Gender Balance</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart><Pie data={genderData} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={50} strokeWidth={0}>{genderData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>{genderData.map(d => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textDim }}><span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />{d.name}: {d.value}</div>)}</div>
          </Card>
          <Card>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Equity Cap Table</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart><Pie data={equityData} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={50} strokeWidth={0}>{equityData.map((d, i) => <Cell key={i} fill={ec[i % ec.length]} />)}</Pie><Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12 }} formatter={v => [`${v}%`]} /></PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>{equityData.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.textDim }}><span style={{ width: 6, height: 6, borderRadius: 1, background: ec[i % ec.length] }} />{d.name}: {d.value}%</div>)}</div>
          </Card>
        </div>
      </div>
      <SectionTitle action={<Btn small onClick={() => setEditPolicy({ title: "", status: "draft", version: "0.1", lastUpdated: new Date().toISOString().slice(0, 10), content: "", acknowledgments: [] })}>{Icons.plus} Add Policy</Btn>}>Compliance Policies</SectionTitle>
      {data.policies.map(p => (
        <Card key={p.id} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setViewPolicy(p)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div><div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textDim, marginTop: 3 }}>v{p.version} · {p.lastUpdated}</div></div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><StatusBadge status={p.status} /><button onClick={e => { e.stopPropagation(); setEditPolicy(p); }} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer" }}>{Icons.edit}</button></div>
          </div>
        </Card>
      ))}
      {viewPolicy && <Modal title={viewPolicy.title} onClose={() => setViewPolicy(null)} wide><div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8 }}>{viewPolicy.content}</div></Modal>}
      {editMember && <Modal title={editMember.id ? "Edit Member" : "Add Member"} onClose={() => setEditMember(null)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FormField label="Name"><Input value={editMember.name} onChange={v => setEditMember({ ...editMember, name: v })} /></FormField>
          <FormField label="Role"><Input value={editMember.role} onChange={v => setEditMember({ ...editMember, role: v })} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Type"><Select value={editMember.type} onChange={v => setEditMember({ ...editMember, type: v })} options={["Founder", "Founder (Pending)", "Advisor", "Employee", "Contractor"].map(t => ({ value: t, label: t }))} /></FormField>
          <FormField label="Gender"><Select value={editMember.gender} onChange={v => setEditMember({ ...editMember, gender: v })} options={[{ value: "F", label: "Female" }, { value: "M", label: "Male" }, { value: "NB", label: "Non-Binary" }, { value: "O", label: "Other" }]} /></FormField>
          <FormField label="Location"><Input value={editMember.location} onChange={v => setEditMember({ ...editMember, location: v })} /></FormField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Equity (%)"><Input type="number" value={editMember.equity} onChange={v => setEditMember({ ...editMember, equity: parseFloat(v) || 0 })} /></FormField>
          <FormField label="Allocation (%)"><Input type="number" value={editMember.allocation} onChange={v => setEditMember({ ...editMember, allocation: parseInt(v) || 0 })} /></FormField>
          <FormField label="Start Date"><Input type="date" value={editMember.startDate} onChange={v => setEditMember({ ...editMember, startDate: v })} /></FormField>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          {editMember.id && <Btn danger onClick={() => { setData(d => ({ ...d, team: d.team.filter(x => x.id !== editMember.id) })); setEditMember(null); }}>{Icons.trash} Remove</Btn>}
          <Btn onClick={() => setEditMember(null)}>Cancel</Btn><Btn primary onClick={() => saveMember(editMember)}>Save</Btn>
        </div>
      </Modal>}
      {editPolicy && <Modal title={editPolicy.id ? "Edit Policy" : "New Policy"} onClose={() => setEditPolicy(null)} wide>
        <FormField label="Title"><Input value={editPolicy.title} onChange={v => setEditPolicy({ ...editPolicy, title: v })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <FormField label="Version"><Input value={editPolicy.version} onChange={v => setEditPolicy({ ...editPolicy, version: v })} /></FormField>
          <FormField label="Status"><Select value={editPolicy.status} onChange={v => setEditPolicy({ ...editPolicy, status: v })} options={[{ value: "draft", label: "Draft" }, { value: "active", label: "Active" }, { value: "archived", label: "Archived" }]} /></FormField>
          <FormField label="Date"><Input type="date" value={editPolicy.lastUpdated} onChange={v => setEditPolicy({ ...editPolicy, lastUpdated: v })} /></FormField>
        </div>
        <FormField label="Content"><Input textarea value={editPolicy.content} onChange={v => setEditPolicy({ ...editPolicy, content: v })} style={{ minHeight: 200 }} /></FormField>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}><Btn onClick={() => setEditPolicy(null)}>Cancel</Btn><Btn primary onClick={() => savePolicy(editPolicy)}>Save</Btn></div>
      </Modal>}
    </div>
  );
};

// ────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────
const MODULES = [
  { id: "command", label: "Command Center", icon: Icons.command },
  { id: "product", label: "Product Hub", icon: Icons.product },
  { id: "investor", label: "Investor & Raise", icon: Icons.investor },
  { id: "market", label: "Addressable Market", icon: Icons.target },
  { id: "crm", label: "Client Pipeline", icon: Icons.crm },
  { id: "financial", label: "Financials", icon: Icons.financial },
  { id: "legal", label: "Legal", icon: Icons.legal },
  { id: "tasks", label: "Task Tracker", icon: Icons.tasks },
  { id: "hr", label: "HR & People", icon: Icons.hr },
];

export default function App() {
  const [data, setData] = useState(null);
  const [activeModule, setActiveModule] = useState("command");
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setData(stored ? JSON.parse(stored) : defaultData);
    } catch {
      setData(defaultData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data && !loading) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
    }
  }, [data, loading]);

  const updateData = useCallback(updater => setData(prev => typeof updater === "function" ? updater(prev) : updater), []);

  if (loading || !data) return (
    <div style={{ background: T.bg, color: T.text, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, marginBottom: 8 }}><span style={{ color: T.accent }}>CMR</span>.AI</div>
        <div style={{ color: T.textDim, fontSize: 13 }}>Loading Startup OS...</div>
      </div>
    </div>
  );

  const renderModule = () => {
    const p = { data, setData: updateData };
    const map = { command: CommandCenter, product: ProductHub, investor: InvestorModule, market: AddressableMarket, crm: CRMModule, financial: FinancialModule, legal: LegalModule, tasks: TaskTracker, hr: HRModule };
    const C = map[activeModule] || CommandCenter;
    return <C {...p} />;
  };

  return (
    <>
      <style>{fonts}</style>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        ::selection{background:${T.accentDim};color:${T.white}}
        input:focus,select:focus,textarea:focus{border-color:${T.accent}!important}
      `}</style>
      <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: "'Outfit', sans-serif", fontSize: 14, overflow: "hidden" }}>
        <div style={{ width: sidebarCollapsed ? 56 : 210, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", transition: "width 0.2s", flexShrink: 0, overflow: "hidden" }}>
          <div onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ padding: sidebarCollapsed ? "18px 10px" : "18px 18px", borderBottom: `1px solid ${T.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, minHeight: 60 }}>
            <div style={{ width: 30, height: 30, background: `linear-gradient(135deg, ${T.accent}, ${T.gold})`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: T.bg, flexShrink: 0 }}>C</div>
            {!sidebarCollapsed && <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700, lineHeight: 1 }}><span style={{ color: T.accent }}>CMR</span><span style={{ color: T.textDim }}>.AI</span></div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Startup OS</div>
            </div>}
          </div>
          <nav style={{ flex: 1, padding: "10px 6px", overflow: "auto" }}>
            {MODULES.map(mod => (
              <button key={mod.id} onClick={() => setActiveModule(mod.id)} title={sidebarCollapsed ? mod.label : undefined}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sidebarCollapsed ? "9px 12px" : "9px 12px", background: activeModule === mod.id ? `${T.accent}12` : "transparent", border: "none", borderRadius: 7, color: activeModule === mod.id ? T.accent : T.textDim, cursor: "pointer", fontSize: 12.5, fontFamily: "'Outfit', sans-serif", fontWeight: activeModule === mod.id ? 600 : 400, textAlign: "left", transition: "all 0.15s", marginBottom: 1, justifyContent: sidebarCollapsed ? "center" : "flex-start" }}>
                <span style={{ flexShrink: 0, display: "flex" }}>{mod.icon}</span>
                {!sidebarCollapsed && <span>{mod.label}</span>}
              </button>
            ))}
          </nav>
          {!sidebarCollapsed && <div style={{ padding: "12px 18px", borderTop: `1px solid ${T.border}` }}>
            <a href="https://drive.google.com/drive/folders/1o5Rfwq4PiLTs2zAvrH9Nkds9aZa5UyUG" target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.accent, textDecoration: "none", marginBottom: 8, fontWeight: 500 }}>{Icons.link} Google Drive</a>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textMuted }}>v2.0 · CONFIDENTIAL<br/>© 2026 CMR.AI</div>
          </div>}
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>{renderModule()}</div>
      </div>
    </>
  );
}
