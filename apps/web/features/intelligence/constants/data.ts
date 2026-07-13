import type {
  Citation,
  IntelDocument,
  KnowledgeBase,
  SearchHit,
} from "../types";

export const knowledgeBases: KnowledgeBase[] = [
  { id: "kb-legal", name: "Legal", description: "Contracts, NDAs, and compliance documents", docCount: 4, visibility: "org" },
  { id: "kb-finance", name: "Finance", description: "Invoices, vendor spend, and procurement", docCount: 3, visibility: "org" },
  { id: "kb-ops", name: "Operations", description: "Policies, reports, and internal knowledge", docCount: 2, visibility: "private" },
];

export const intelDocuments: IntelDocument[] = [
  {
    id: "doc-msa-acme",
    name: "Acme Corp — Master Services Agreement.pdf",
    docType: "contract",
    mimeType: "application/pdf",
    sizeBytes: 2_411_520,
    pages: 42,
    kbId: "kb-legal",
    uploadedBy: "Alex Kim",
    uploadedAt: "2026-06-24",
    status: "indexed",
    source: "upload",
    language: "en",
    riskScore: 68,
    summary:
      "Three-year MSA with Acme Corp covering platform licensing and support. Auto-renews annually unless terminated with 90 days' notice. Liability capped at 12 months of fees; uncapped for data-breach claims — flagged as above-standard exposure.",
    tags: ["msa", "auto-renewal", "liability", "acme"],
    entities: [
      { id: "e1", type: "org", value: "Acme Corp", confidence: 0.99 },
      { id: "e2", type: "date", value: "2026-09-30 (renewal)", confidence: 0.97 },
      { id: "e3", type: "amount", value: "$240,000 / yr", confidence: 0.95 },
      { id: "e4", type: "obligation", value: "90-day termination notice", confidence: 0.93 },
      { id: "e5", type: "person", value: "J. Whitfield (signatory)", confidence: 0.9 },
    ],
    deadlines: [
      { label: "Renewal window opens", date: "2026-07-02" },
      { label: "Termination notice deadline", date: "2026-07-02" },
      { label: "Auto-renewal date", date: "2026-09-30" },
    ],
    piiFlags: [
      { type: "Email address", count: 3 },
      { type: "Phone number", count: 1 },
    ],
  },
  {
    id: "doc-northwind",
    name: "Northwind Vendor Contract 2026.pdf",
    docType: "contract",
    mimeType: "application/pdf",
    sizeBytes: 1_136_640,
    pages: 18,
    kbId: "kb-legal",
    uploadedBy: "Priya Nair",
    uploadedAt: "2026-06-20",
    status: "indexed",
    source: "gdrive",
    language: "en",
    riskScore: 34,
    summary:
      "Standard supply agreement with Northwind Traders. Net-45 payment terms, 8% early-payment discount, SLA credits for late delivery. No unusual clauses detected.",
    tags: ["vendor", "supply", "net-45"],
    entities: [
      { id: "e1", type: "org", value: "Northwind Traders", confidence: 0.99 },
      { id: "e2", type: "amount", value: "$86,500", confidence: 0.96 },
      { id: "e3", type: "obligation", value: "Net-45 payment terms", confidence: 0.94 },
    ],
    deadlines: [{ label: "Contract expiry", date: "2026-12-31" }],
    piiFlags: [{ type: "Email address", count: 2 }],
  },
  {
    id: "doc-invoice-cloudscale",
    name: "Q2 Invoice — CloudScale Infrastructure.pdf",
    docType: "invoice",
    mimeType: "application/pdf",
    sizeBytes: 312_320,
    pages: 3,
    kbId: "kb-finance",
    uploadedBy: "Finance Bot",
    uploadedAt: "2026-06-28",
    status: "indexed",
    source: "email",
    language: "en",
    riskScore: 12,
    summary:
      "Quarterly infrastructure invoice from CloudScale: $18,940 across compute, storage, and egress. 14% above Q1 — egress line item doubled. Matches PO-2214.",
    tags: ["invoice", "cloudscale", "q2", "po-2214"],
    entities: [
      { id: "e1", type: "org", value: "CloudScale Inc.", confidence: 0.99 },
      { id: "e2", type: "amount", value: "$18,940.00", confidence: 0.98 },
      { id: "e3", type: "date", value: "Due 2026-07-28", confidence: 0.97 },
    ],
    deadlines: [{ label: "Payment due", date: "2026-07-28" }],
  },
  {
    id: "doc-retention-policy",
    name: "Data Retention Policy v3.docx",
    docType: "policy",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    sizeBytes: 148_480,
    pages: 9,
    kbId: "kb-ops",
    uploadedBy: "Alex Kim",
    uploadedAt: "2026-06-15",
    status: "indexed",
    source: "upload",
    language: "en",
    riskScore: 8,
    summary:
      "Internal policy defining retention periods: customer records 7 years, logs 18 months, backups 90 days. Adds GDPR right-to-erasure workflow introduced in v3.",
    tags: ["policy", "gdpr", "retention"],
    entities: [
      { id: "e1", type: "obligation", value: "7-year customer record retention", confidence: 0.95 },
      { id: "e2", type: "obligation", value: "Erasure within 30 days of request", confidence: 0.92 },
    ],
  },
  {
    id: "doc-vendor-risk",
    name: "Vendor Risk Assessment — Globex.xlsx",
    docType: "spreadsheet",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    sizeBytes: 254_976,
    pages: 4,
    kbId: "kb-finance",
    uploadedBy: "Priya Nair",
    uploadedAt: "2026-06-22",
    status: "indexed",
    source: "upload",
    language: "en",
    riskScore: 57,
    summary:
      "Scored risk matrix for Globex Corporation across security, financial, and delivery dimensions. Overall risk medium-high driven by missing SOC 2 report and single-region hosting.",
    tags: ["vendor-risk", "globex", "soc2"],
    entities: [
      { id: "e1", type: "org", value: "Globex Corporation", confidence: 0.99 },
      { id: "e2", type: "obligation", value: "SOC 2 report outstanding", confidence: 0.9 },
    ],
  },
  {
    id: "doc-pipeline-review",
    name: "Sales Pipeline Review — June.pdf",
    docType: "report",
    mimeType: "application/pdf",
    sizeBytes: 1_843_200,
    pages: 26,
    kbId: "kb-ops",
    uploadedBy: "Alex Kim",
    uploadedAt: "2026-07-02",
    status: "processing",
    source: "upload",
    language: "en",
    tags: ["sales", "pipeline"],
    entities: [],
  },
  {
    id: "doc-initech-renewal",
    name: "Renewal Terms — Initech.eml",
    docType: "email",
    mimeType: "message/rfc822",
    sizeBytes: 96_256,
    pages: 2,
    kbId: "kb-legal",
    uploadedBy: "Email Ingest",
    uploadedAt: "2026-06-30",
    status: "indexed",
    source: "email",
    language: "en",
    riskScore: 21,
    summary:
      "Email thread confirming Initech renewal at current pricing with a 5% uplift cap for 2027. Attachment contains the countersigned amendment.",
    tags: ["renewal", "initech", "amendment"],
    entities: [
      { id: "e1", type: "org", value: "Initech LLC", confidence: 0.98 },
      { id: "e2", type: "obligation", value: "5% uplift cap for 2027", confidence: 0.91 },
    ],
    deadlines: [{ label: "Countersign amendment", date: "2026-07-15" }],
    piiFlags: [{ type: "Email address", count: 6 }],
  },
  {
    id: "doc-suspicious",
    name: "Suspicious_invoice_final.pdf",
    docType: "invoice",
    mimeType: "application/pdf",
    sizeBytes: 88_064,
    pages: 1,
    kbId: "kb-finance",
    uploadedBy: "Email Ingest",
    uploadedAt: "2026-07-01",
    status: "quarantined",
    source: "email",
    language: "en",
    tags: [],
    entities: [],
    error: "Malware signature detected (embedded JS payload). File isolated in quarantine bucket — never parsed.",
  },
  {
    id: "doc-fax-scan",
    name: "Legacy Order Form (fax scan).pdf",
    docType: "other",
    mimeType: "application/pdf",
    sizeBytes: 4_505_600,
    pages: 6,
    kbId: "kb-ops",
    uploadedBy: "Priya Nair",
    uploadedAt: "2026-06-29",
    status: "failed",
    source: "upload",
    language: "en",
    tags: [],
    entities: [],
    error: "OCR confidence below threshold after 3 attempts (scan quality). Re-upload a higher-resolution copy.",
  },
];

export const mockSearchHits: SearchHit[] = [
  {
    id: "hit-1",
    documentId: "doc-msa-acme",
    documentName: "Acme Corp — Master Services Agreement.pdf",
    docType: "contract",
    page: 31,
    sectionPath: "9 > 9.2 > Limitation of Liability",
    snippet:
      "…aggregate liability shall not exceed the fees paid in the twelve (12) months preceding the claim, provided that no cap shall apply to losses arising from a breach of Section 7 (Data Protection)…",
    score: 0.94,
  },
  {
    id: "hit-2",
    documentId: "doc-msa-acme",
    documentName: "Acme Corp — Master Services Agreement.pdf",
    docType: "contract",
    page: 12,
    sectionPath: "4 > 4.1 > Term and Renewal",
    snippet:
      "…this Agreement shall automatically renew for successive one (1) year terms unless either party provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term…",
    score: 0.91,
  },
  {
    id: "hit-3",
    documentId: "doc-initech-renewal",
    documentName: "Renewal Terms — Initech.eml",
    docType: "email",
    page: 1,
    sectionPath: "Thread > Re: 2027 Renewal",
    snippet:
      "…we can commit to renewal at current pricing with any future uplift capped at 5% for the 2027 term, per the attached amendment…",
    score: 0.87,
  },
  {
    id: "hit-4",
    documentId: "doc-northwind",
    documentName: "Northwind Vendor Contract 2026.pdf",
    docType: "contract",
    page: 7,
    sectionPath: "3 > Payment Terms",
    snippet:
      "…invoices are payable net forty-five (45) days from receipt; an early-payment discount of eight percent (8%) applies to payments made within ten (10) days…",
    score: 0.82,
  },
  {
    id: "hit-5",
    documentId: "doc-retention-policy",
    documentName: "Data Retention Policy v3.docx",
    docType: "policy",
    page: 4,
    sectionPath: "2 > Retention Schedule",
    snippet:
      "…customer records shall be retained for seven (7) years following account closure; system logs for eighteen (18) months; encrypted backups for ninety (90) days…",
    score: 0.79,
  },
];

interface CannedAnswer {
  keywords: string[];
  answer: string;
  citations: Citation[];
}

export const cannedAnswers: CannedAnswer[] = [
  {
    keywords: ["renew", "renewal", "expire", "notice", "terminate"],
    answer:
      "You have two active renewal situations.\n\nThe Acme Corp MSA auto-renews on September 30, 2026 for another one-year term. To exit or renegotiate, written notice is required 90 days before renewal — that deadline is July 2, 2026, which is today. Given the liability exposure flagged in section 9.2, I'd recommend opening the renegotiation now.\n\nInitech has already agreed to renew at current pricing with a 5% uplift cap for 2027. The countersigned amendment is due back by July 15, 2026.",
    citations: [
      { index: 1, documentId: "doc-msa-acme", documentName: "Acme Corp — Master Services Agreement.pdf", page: 12, quote: "automatically renew … unless written notice … ninety (90) days prior" },
      { index: 2, documentId: "doc-initech-renewal", documentName: "Renewal Terms — Initech.eml", page: 1, quote: "uplift capped at 5% for the 2027 term" },
    ],
  },
  {
    keywords: ["liab", "cap", "risk", "exposure", "indemn"],
    answer:
      "The main liability exposure in your portfolio is the Acme Corp MSA.\n\nGeneral liability is capped at 12 months of fees (about $240,000), but the cap does not apply to data-protection breaches under Section 7 — that's uncapped exposure and above market standard. Combined with the auto-renewal clause, this drives the document's 68/100 risk score.\n\nBy comparison, the Northwind contract scores 34/100 with no unusual clauses, and Globex's vendor assessment is medium-high mainly due to a missing SOC 2 report, not contractual terms.",
    citations: [
      { index: 1, documentId: "doc-msa-acme", documentName: "Acme Corp — Master Services Agreement.pdf", page: 31, quote: "no cap shall apply to losses arising from a breach of Section 7 (Data Protection)" },
      { index: 2, documentId: "doc-vendor-risk", documentName: "Vendor Risk Assessment — Globex.xlsx", page: 2, quote: "SOC 2 report outstanding; single-region hosting" },
    ],
  },
  {
    keywords: ["invoice", "spend", "pay", "cost", "cloudscale", "vendor"],
    answer:
      "Your latest vendor activity:\n\nCloudScale's Q2 invoice is $18,940, due July 28, 2026 — 14% above Q1, driven by a doubled egress line item. It matches PO-2214, so it's cleared for approval, but the egress trend is worth a look before Q3.\n\nNorthwind invoices run net-45 with an 8% early-payment discount inside 10 days — paying the current cycle early would save roughly $580.",
    citations: [
      { index: 1, documentId: "doc-invoice-cloudscale", documentName: "Q2 Invoice — CloudScale Infrastructure.pdf", page: 1, quote: "Total due: $18,940.00 — egress charges increased 102% vs. Q1" },
      { index: 2, documentId: "doc-northwind", documentName: "Northwind Vendor Contract 2026.pdf", page: 7, quote: "early-payment discount of eight percent (8%) … within ten (10) days" },
    ],
  },
  {
    keywords: ["retention", "gdpr", "delete", "erasure", "policy", "compliance"],
    answer:
      "Per the Data Retention Policy v3: customer records are kept 7 years after account closure, system logs 18 months, and encrypted backups 90 days.\n\nVersion 3 added a GDPR right-to-erasure workflow — erasure requests must be completed within 30 days. If you're handling a deletion request, the policy's section 2 schedule is the authoritative source.",
    citations: [
      { index: 1, documentId: "doc-retention-policy", documentName: "Data Retention Policy v3.docx", page: 4, quote: "customer records … seven (7) years; system logs … eighteen (18) months" },
    ],
  },
];

export const fallbackAnswer: CannedAnswer = {
  keywords: [],
  answer:
    "Based on the 7 indexed documents in your workspace, I can help with contract terms, renewal deadlines, vendor spend, and policy questions.\n\nThe most time-sensitive item right now: the Acme Corp MSA termination-notice deadline is today (July 2, 2026). There's also an Initech amendment awaiting countersignature by July 15, and a CloudScale invoice due July 28.\n\nAsk me something specific — for example, \"What's our liability exposure with Acme?\" or \"Which invoices are due this month?\"",
  citations: [
    { index: 1, documentId: "doc-msa-acme", documentName: "Acme Corp — Master Services Agreement.pdf", page: 12, quote: "written notice of non-renewal at least ninety (90) days prior" },
  ],
};
