import { DocumentDetailPage } from "@/features/intelligence/components/document-detail-page";

export const metadata = {
  title: "Document — Intelligence Hub — OrionOS",
};

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DocumentDetailPage id={id} />;
}
