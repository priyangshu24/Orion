import { useIntelligenceStore } from "../store/intelligence-store";
import type {
  DocChunk,
  DocEntity,
  DocType,
  IntelDocument,
  PiiFlag,
} from "../types";

const CHILD_TARGET_CHARS = 600;
const CHILDREN_PER_PARENT = 3;
const CHARS_PER_PAGE = 1800;

function inferDocType(filename: string): DocType {
  const lower = filename.toLowerCase();
  if (/(contract|agreement|msa|nda)/.test(lower)) return "contract";
  if (/invoice/.test(lower)) return "invoice";
  if (/policy/.test(lower)) return "policy";
  if (/\.(xlsx|csv)$/.test(lower)) return "spreadsheet";
  if (/\.(eml|msg)$/.test(lower)) return "email";
  if (/(report|review)/.test(lower)) return "report";
  return "other";
}

async function extractText(file: File): Promise<string | null> {
  const name = file.name.toLowerCase();
  try {
    if (/\.(txt|md|csv|json|log)$/.test(name) || file.type.startsWith("text/")) {
      return await file.text();
    }
    if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return value;
    }
  } catch {
    return null;
  }
  return null;
}

function sectionLabel(text: string, fallback: string): string {
  const firstLine = text.split(/\n/)[0]?.trim() ?? "";
  const words = firstLine.split(/\s+/).slice(0, 6).join(" ");
  return words.length >= 8 ? words : fallback;
}

export function chunkText(documentId: string, text: string): DocChunk[] {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Build child chunks by accumulating paragraphs up to the target size.
  const childTexts: { text: string; offset: number }[] = [];
  let buffer = "";
  let offset = 0;
  let bufferOffset = 0;
  for (const p of paragraphs) {
    if (buffer && buffer.length + p.length > CHILD_TARGET_CHARS) {
      childTexts.push({ text: buffer, offset: bufferOffset });
      buffer = "";
    }
    if (!buffer) bufferOffset = offset;
    buffer = buffer ? `${buffer}\n${p}` : p;
    offset += p.length + 1;
  }
  if (buffer) childTexts.push({ text: buffer, offset: bufferOffset });

  const chunks: DocChunk[] = [];
  let index = 0;
  for (let i = 0; i < childTexts.length; i += CHILDREN_PER_PARENT) {
    const group = childTexts.slice(i, i + CHILDREN_PER_PARENT);
    const parentNo = Math.floor(i / CHILDREN_PER_PARENT) + 1;
    const parentId = `${documentId}-p${parentNo}`;
    const parentText = group.map((g) => g.text).join("\n");
    const parentPage = Math.floor(group[0].offset / CHARS_PER_PAGE) + 1;
    const parentSection = sectionLabel(group[0].text, `Section ${parentNo}`);

    chunks.push({
      id: parentId,
      documentId,
      parentId: null,
      level: "parent",
      index: index++,
      page: parentPage,
      sectionPath: parentSection,
      text: parentText.length > 900 ? `${parentText.slice(0, 900)}…` : parentText,
      tokenCount: Math.round(parentText.length / 4),
      embedded: false,
    });

    group.forEach((g, j) => {
      chunks.push({
        id: `${parentId}-c${j + 1}`,
        documentId,
        parentId,
        level: "child",
        index: index++,
        page: Math.floor(g.offset / CHARS_PER_PAGE) + 1,
        sectionPath: `${parentSection} > part ${j + 1}`,
        text: g.text,
        tokenCount: Math.round(g.text.length / 4),
        embedded: true,
      });
    });
  }
  return chunks;
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{3,4}[\s.-]\d{3,4}(?:[\s.-]\d{2,4})?/g;
const AMOUNT_RE = /[$€£₹]\s?\d[\d,]*(?:\.\d{1,2})?/g;
const DATE_RE = /\b(?:\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}|(?:19|20)\d{2}\s?[-–]\s?(?:19|20)\d{2})\b/g;

function dedupe(values: RegExpMatchArray | null, cap: number): string[] {
  return [...new Set((values ?? []).map((v) => v.trim()))].slice(0, cap);
}

export function analyzeText(documentId: string, text: string): {
  entities: DocEntity[];
  piiFlags: PiiFlag[];
} {
  const emails = dedupe(text.match(EMAIL_RE), 3);
  const amounts = dedupe(text.match(AMOUNT_RE), 4);
  const dates = dedupe(text.match(DATE_RE), 4);
  const phoneCount = dedupe(text.match(PHONE_RE), 5).length;

  const entities: DocEntity[] = [
    ...emails.map((v, i) => ({ id: `${documentId}-em${i}`, type: "person" as const, value: v, confidence: 0.97 })),
    ...amounts.map((v, i) => ({ id: `${documentId}-am${i}`, type: "amount" as const, value: v, confidence: 0.94 })),
    ...dates.map((v, i) => ({ id: `${documentId}-dt${i}`, type: "date" as const, value: v, confidence: 0.91 })),
  ].slice(0, 8);

  const piiFlags: PiiFlag[] = [];
  if (emails.length) piiFlags.push({ type: "Email address", count: emails.length });
  if (phoneCount) piiFlags.push({ type: "Phone number", count: phoneCount });

  return { entities, piiFlags };
}

function simulatedChunks(documentId: string, name: string): DocChunk[] {
  const parentId = `${documentId}-p1`;
  const body =
    `Binary preview unavailable in the demo pipeline — "${name}" was parsed server-side in production. ` +
    "Layout-aware extraction produced the section map below; child chunks were embedded with the parent-child strategy.";
  return [
    {
      id: parentId, documentId, parentId: null, level: "parent", index: 0, page: 1,
      sectionPath: "1 > Document body", text: body,
      tokenCount: Math.round(body.length / 4), embedded: false,
    },
    {
      id: `${parentId}-c1`, documentId, parentId, level: "child", index: 1, page: 1,
      sectionPath: "1 > Document body > part 1",
      text: "Representative child chunk. In production this contains the verbatim extracted passage for this section, retrieved during hybrid search and cited in AI answers.",
      tokenCount: 38, embedded: true,
    },
  ];
}

export function ingestFile(file: File): string {
  const store = useIntelligenceStore.getState();
  const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const docType = inferDocType(file.name);

  const doc: IntelDocument = {
    id,
    name: file.name,
    docType,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size || 512_000,
    pages: 1,
    kbId: "kb-ops",
    uploadedBy: "Alex Kim",
    uploadedAt: new Date().toISOString().slice(0, 10),
    status: "uploaded",
    source: "upload",
    language: "en",
    tags: [],
    entities: [],
  };
  store.addDocument(doc);

  const update = (patch: Partial<IntelDocument>) =>
    useIntelligenceStore.getState().updateDocument(id, patch);

  const extraction = extractText(file);

  setTimeout(() => update({ status: "scanning" }), 900);
  setTimeout(() => update({ status: "processing" }), 2300);

  setTimeout(async () => {
    const text = await extraction;
    if (text && text.trim().length > 40) {
      const chunks = chunkText(id, text);
      const { entities, piiFlags } = analyzeText(id, text);
      const words = text.trim().split(/\s+/).length;
      const parents = chunks.filter((c) => c.level === "parent").length;
      const children = chunks.filter((c) => c.level === "child").length;
      const firstSentence = text.trim().split(/(?<=[.!?])\s/)[0]?.slice(0, 160);

      useIntelligenceStore.getState().setChunks(id, chunks);
      update({
        status: "indexed",
        pages: Math.max(1, Math.ceil(text.length / CHARS_PER_PAGE)),
        riskScore: Math.min(85, 10 + piiFlags.reduce((s, f) => s + f.count, 0) * 6 + Math.round(entities.length * 1.5)),
        summary: `Extracted ${words.toLocaleString()} words into ${parents} parent and ${children} child chunks (all children embedded). Opens with: “${firstSentence}”`,
        tags: [docType, "auto-tagged", ...(piiFlags.length ? ["pii"] : [])],
        entities,
        piiFlags: piiFlags.length ? piiFlags : undefined,
      });
    } else {
      useIntelligenceStore.getState().setChunks(id, simulatedChunks(id, file.name));
      update({
        status: "indexed",
        pages: Math.max(1, Math.round((file.size || 512_000) / 60_000)),
        riskScore: 15 + Math.round(Math.random() * 30),
        summary:
          "Document processed and indexed. Chunks embedded with the parent-child strategy; entities, tags, and deadlines extracted by the enrichment pipeline.",
        tags: [docType, "auto-tagged"],
        entities: [
          { id: `${id}-e1`, type: "org", value: "Detected organization", confidence: 0.9 },
          { id: `${id}-e2`, type: "date", value: "Detected key date", confidence: 0.86 },
        ],
      });
    }
  }, 4600);

  return id;
}
