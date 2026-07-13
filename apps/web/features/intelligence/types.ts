export type DocumentStatus =
  | "uploaded"
  | "scanning"
  | "processing"
  | "indexed"
  | "failed"
  | "quarantined";

export type DocType =
  | "contract"
  | "invoice"
  | "policy"
  | "report"
  | "spreadsheet"
  | "email"
  | "other";

export type DocSource = "upload" | "gdrive" | "email";

export type EntityType = "person" | "org" | "date" | "amount" | "obligation";

export interface DocEntity {
  id: string;
  type: EntityType;
  value: string;
  confidence: number;
}

export interface DocDeadline {
  label: string;
  date: string;
}

export interface PiiFlag {
  type: string;
  count: number;
}

export interface IntelDocument {
  id: string;
  name: string;
  docType: DocType;
  mimeType: string;
  sizeBytes: number;
  pages: number;
  kbId: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  source: DocSource;
  language: string;
  riskScore?: number;
  summary?: string;
  tags: string[];
  entities: DocEntity[];
  deadlines?: DocDeadline[];
  piiFlags?: PiiFlag[];
  error?: string;
}

export type PipelineStageKey =
  | "upload"
  | "scan"
  | "extract"
  | "chunk"
  | "embed"
  | "index";

export type PipelineStageState = "done" | "active" | "pending" | "failed";

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  docCount: number;
  visibility: "org" | "private";
}

export interface SearchHit {
  id: string;
  documentId: string;
  documentName: string;
  docType: DocType;
  page: number;
  sectionPath: string;
  snippet: string;
  score: number;
}

export interface Citation {
  index: number;
  documentId: string;
  documentName: string;
  page: number;
  quote: string;
}

export interface IntelChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  streaming?: boolean;
}

export interface DocChunk {
  id: string;
  documentId: string;
  parentId: string | null;
  level: "parent" | "child";
  index: number;
  page: number;
  sectionPath: string;
  text: string;
  tokenCount: number;
  embedded: boolean;
}
