import type { DocChunk } from "../types";

function chunk(
  documentId: string,
  id: string,
  parentId: string | null,
  level: "parent" | "child",
  index: number,
  page: number,
  sectionPath: string,
  text: string
): DocChunk {
  return {
    id,
    documentId,
    parentId,
    level,
    index,
    page,
    sectionPath,
    text,
    tokenCount: Math.max(12, Math.round(text.length / 4)),
    embedded: level === "child",
  };
}

const acme = "doc-msa-acme";
const northwind = "doc-northwind";
const cloudscale = "doc-invoice-cloudscale";
const retention = "doc-retention-policy";
const globex = "doc-vendor-risk";
const initech = "doc-initech-renewal";

export const mockChunks: Record<string, DocChunk[]> = {
  [acme]: [
    chunk(acme, `${acme}-p1`, null, "parent", 0, 12, "4 > Term and Renewal",
      "Section 4 — Term and Renewal. This Agreement commences on the Effective Date and continues for an initial term of three (3) years. It governs all Statements of Work executed by the parties during the term, each of which incorporates the terms of this Agreement by reference."),
    chunk(acme, `${acme}-p1-c1`, `${acme}-p1`, "child", 1, 12, "4 > 4.1 > Automatic Renewal",
      "4.1 Automatic Renewal. Following the Initial Term, this Agreement shall automatically renew for successive one (1) year terms (each a \"Renewal Term\") at the then-current list pricing, unless either party provides written notice of non-renewal in accordance with Section 4.2."),
    chunk(acme, `${acme}-p1-c2`, `${acme}-p1`, "child", 2, 12, "4 > 4.2 > Notice of Non-Renewal",
      "4.2 Notice of Non-Renewal. Written notice of non-renewal must be delivered to the counterparty's registered notice address at least ninety (90) days prior to the end of the then-current term. Notice delivered by electronic mail is effective only upon written acknowledgment of receipt."),
    chunk(acme, `${acme}-p2`, null, "parent", 3, 24, "7 > Data Protection",
      "Section 7 — Data Protection. Each party shall implement and maintain administrative, physical, and technical safeguards appropriate to the sensitivity of Customer Data, and in no event less protective than the security measures described in Exhibit C (Security Addendum)."),
    chunk(acme, `${acme}-p2-c1`, `${acme}-p2`, "child", 4, 25, "7 > 7.3 > Breach Notification",
      "7.3 Breach Notification. Provider shall notify Customer without undue delay, and in any event within seventy-two (72) hours, after becoming aware of a Security Incident affecting Customer Data, and shall provide reasonable cooperation with Customer's remediation and notification obligations."),
    chunk(acme, `${acme}-p3`, null, "parent", 5, 31, "9 > Limitation of Liability",
      "Section 9 — Limitation of Liability. Except as set forth in Section 9.2, neither party shall be liable for any indirect, incidental, special, consequential, or punitive damages, however caused and under any theory of liability, even if advised of the possibility of such damages."),
    chunk(acme, `${acme}-p3-c1`, `${acme}-p3`, "child", 6, 31, "9 > 9.1 > Liability Cap",
      "9.1 Liability Cap. Each party's aggregate liability arising out of or relating to this Agreement shall not exceed the total fees paid or payable by Customer in the twelve (12) months immediately preceding the event giving rise to the claim."),
    chunk(acme, `${acme}-p3-c2`, `${acme}-p3`, "child", 7, 31, "9 > 9.2 > Cap Exclusions",
      "9.2 Cap Exclusions. The limitation in Section 9.1 shall not apply to (a) losses arising from a breach of Section 7 (Data Protection), (b) either party's indemnification obligations under Section 10, or (c) amounts payable by Customer under Section 3 (Fees). No cap shall apply to clause (a)."),
  ],

  [northwind]: [
    chunk(northwind, `${northwind}-p1`, null, "parent", 0, 7, "3 > Payment Terms",
      "Section 3 — Payment Terms. Supplier shall invoice Buyer monthly in arrears for Goods delivered and accepted during the preceding calendar month. All invoices shall reference the applicable purchase order number and delivery confirmation."),
    chunk(northwind, `${northwind}-p1-c1`, `${northwind}-p1`, "child", 1, 7, "3 > 3.2 > Net-45 / Early Payment",
      "3.2 Invoices are payable net forty-five (45) days from receipt of a correct invoice. An early-payment discount of eight percent (8%) applies to invoices settled within ten (10) days of receipt. Disputed amounts must be raised within fifteen (15) days and do not suspend payment of undisputed amounts."),
    chunk(northwind, `${northwind}-p2`, null, "parent", 2, 11, "5 > Service Levels",
      "Section 5 — Service Levels. Supplier shall deliver Goods within the delivery windows specified in each purchase order. On-time delivery performance is measured monthly across all purchase orders accepted in the period."),
    chunk(northwind, `${northwind}-p2-c1`, `${northwind}-p2`, "child", 3, 11, "5 > 5.4 > SLA Credits",
      "5.4 SLA Credits. For each business day of delay beyond the committed delivery window, Buyer is entitled to a service credit equal to two percent (2%) of the value of the delayed order, up to a maximum of twenty percent (20%) per order. Credits are applied against the next monthly invoice."),
  ],

  [cloudscale]: [
    chunk(cloudscale, `${cloudscale}-p1`, null, "parent", 0, 1, "Invoice Summary",
      "Invoice CS-2026-0642 · Billing period Apr 1 – Jun 30, 2026 · PO-2214. Total due: $18,940.00 by July 28, 2026. Line items: Compute (reserved) $9,120.00; Object storage $3,410.00; Network egress $4,860.00; Support plan (Business) $1,550.00."),
    chunk(cloudscale, `${cloudscale}-p1-c1`, `${cloudscale}-p1`, "child", 1, 2, "Notes > Egress Variance",
      "Note 2 — Egress charges increased 102% vs. Q1 ($2,405.00 → $4,860.00), driven by cross-region replication traffic enabled on May 12. Consider enabling the compressed replication tier to reduce Q3 egress by an estimated 35–40%."),
  ],

  [retention]: [
    chunk(retention, `${retention}-p1`, null, "parent", 0, 4, "2 > Retention Schedule",
      "Section 2 — Retention Schedule. Records shall be retained only as long as required for the purpose for which they were collected, subject to the minimum and maximum periods in this schedule. Deviations require written approval from the Data Protection Officer."),
    chunk(retention, `${retention}-p1-c1`, `${retention}-p1`, "child", 1, 4, "2 > 2.1 > Periods",
      "2.1 Customer records: seven (7) years following account closure. System and access logs: eighteen (18) months on hot storage. Encrypted backups: ninety (90) days rolling. Recruitment records for unsuccessful candidates: six (6) months unless consent to retain is obtained."),
    chunk(retention, `${retention}-p2-c1`, null, "child", 2, 6, "4 > Right to Erasure",
      "Section 4 — Right to Erasure (v3 addition). Verified erasure requests must be completed within thirty (30) days of receipt. Erasure covers primary stores and search indexes immediately; backup copies expire within the ninety (90) day backup window and must not be restored except with DPO sign-off."),
  ],

  [globex]: [
    chunk(globex, `${globex}-p1`, null, "parent", 0, 2, "Sheet: Risk Matrix",
      "Risk matrix — Globex Corporation. Security: 3.8/5 (missing SOC 2 Type II report; ISO 27001 certificate valid to 2027-03). Financial: 2.1/5 (D&B rating stable, positive cash flow 8 consecutive quarters). Delivery: 3.2/5 (single-region hosting, no documented DR test in last 12 months). Overall: MEDIUM-HIGH."),
    chunk(globex, `${globex}-p1-c1`, `${globex}-p1`, "child", 1, 3, "Sheet: Remediation Plan",
      "Remediation items: (1) obtain SOC 2 Type II report or bridge letter by 2026-09-30; (2) contractual commitment to multi-region failover in next renewal; (3) evidence of annual DR test with RTO ≤ 4h. Re-score vendor after item (1) closes."),
  ],

  [initech]: [
    chunk(initech, `${initech}-p1`, null, "parent", 0, 1, "Thread > Re: 2027 Renewal",
      "From: m.waddams@initech.com · To: alex@orion.dev · Subject: Re: 2027 Renewal. \"Following Thursday's call — we can commit to renewal at current pricing with any future uplift capped at 5% for the 2027 term, per the attached amendment. Legal has countersigned; we need your signature back by July 15 to keep the current rate card.\""),
    chunk(initech, `${initech}-p1-c1`, `${initech}-p1`, "child", 1, 2, "Attachment > Amendment No. 2",
      "Amendment No. 2 to the Initech Master Subscription Agreement. Section 1: the Subscription Term is extended through December 31, 2027. Section 2: fees for the extended term equal current fees; any increase for periods after 2027 shall not exceed five percent (5%) per annum. All other terms remain unchanged."),
  ],
};
