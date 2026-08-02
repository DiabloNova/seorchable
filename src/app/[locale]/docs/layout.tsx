import React from "react";
import { DocsService } from "@/lib/docsService";
import { DocumentationLayout } from "@/components/docs/DocumentationLayout";

interface DocsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale || "fa") as "en" | "fa";

  // Retrieve active categories for this locale on the server using fs
  const categories = DocsService.getCategories(locale);

  return (
    <DocumentationLayout
      categories={categories}
      activeSlug="" // Will be resolved dynamically on client using usePathname
      locale={locale}
    >
      {children}
    </DocumentationLayout>
  );
}
