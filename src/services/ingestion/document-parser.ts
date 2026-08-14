import * as crypto from 'crypto';

export interface DocumentFile {
  fileName: string;
  mediaType: string; // e.g. "text/plain", "text/markdown", "application/json", "text/html"
  content: string | Buffer;
  sourceRef?: string;
  metadata?: Record<string, unknown>;
}

export interface ParsedSection {
  sectionIndex: number;
  title?: string;
  content: string;
}

export interface ParsedDocument {
  docId: string;
  docHash: string; // SHA-256
  fileName: string;
  mediaType: string;
  normalizedText: string;
  sections: ParsedSection[];
  metadata: Record<string, unknown>;
  characterCount: number;
  wordCount: number;
}

export interface IDocumentParser {
  parseDocument(file: DocumentFile): Promise<ParsedDocument>;
}

export class DefaultDocumentParser implements IDocumentParser {
  private supportedMediaTypes: Set<string> = new Set([
    'text/plain',
    'text/markdown',
    'application/json',
    'text/html',
    'text/x-markdown',
    'application/x-javascript',
    'text/csv'
  ]);

  private supportedExtensions: Set<string> = new Set([
    'txt', 'md', 'json', 'html', 'htm', 'csv'
  ]);

  /**
   * Normalizes document text deterministically:
   * - Unifies line endings (\r\n and \r -> \n)
   * - Replaces non-breaking spaces (\u00A0) with standard space
   * - Removes non-printable control characters except newlines/tabs
   * - Trims leading/trailing whitespace
   */
  public normalizeText(text: string): string {
    if (!text) return '';
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\u00A0/g, ' ')
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .trim();
  }

  /**
   * Generates a deterministic SHA-256 content hash for normalized text
   */
  public calculateContentHash(normalizedText: string): string {
    return crypto.createHash('sha256').update(normalizedText, 'utf8').digest('hex');
  }

  public async parseDocument(file: DocumentFile): Promise<ParsedDocument> {
    if (!file) {
      throw new Error('Validation Error: DocumentFile input is required and cannot be null/undefined');
    }

    if (!file.fileName || file.fileName.trim().length === 0) {
      throw new Error('Validation Error: fileName is required');
    }

    // Determine extension
    const extMatch = file.fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
    const extension = extMatch ? extMatch[1] : '';

    const normalizedMediaType = (file.mediaType || '').toLowerCase().trim();

    const isSupportedType =
      this.supportedMediaTypes.has(normalizedMediaType) ||
      this.supportedExtensions.has(extension);

    if (!isSupportedType) {
      throw new Error(
        `Unsupported Format Error: File '${file.fileName}' with type '${file.mediaType}' is not supported. Supported extensions: txt, md, json, html, csv.`
      );
    }

    let rawString = '';
    if (Buffer.isBuffer(file.content)) {
      rawString = file.content.toString('utf8');
    } else if (typeof file.content === 'string') {
      rawString = file.content;
    } else {
      throw new Error('Validation Error: File content must be a string or Buffer');
    }

    if (!rawString || rawString.trim().length === 0) {
      throw new Error(`Corrupted / Empty File Error: File '${file.fileName}' contains empty or unreadable content`);
    }

    let normalizedText = '';
    const sections: ParsedSection[] = [];

    // Parse according to type
    if (normalizedMediaType.includes('json') || extension === 'json') {
      try {
        const parsedJson = JSON.parse(rawString);
        if (typeof parsedJson === 'string') {
          normalizedText = this.normalizeText(parsedJson);
        } else {
          normalizedText = this.normalizeText(JSON.stringify(parsedJson, null, 2));
        }
        sections.push({ sectionIndex: 0, title: 'JSON Root', content: normalizedText });
      } catch (err) {
        throw new Error(`Corrupted File Error: Failed to parse JSON content in '${file.fileName}': ${err instanceof Error ? err.message : String(err)}`);
      }
    } else if (normalizedMediaType.includes('html') || extension === 'html' || extension === 'htm') {
      // Clean HTML tags deterministically without external heavy DOM dependencies
      const strippedHtml = rawString
        .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '')
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<[^>]+>/g, '');

      normalizedText = this.normalizeText(strippedHtml);
      sections.push({ sectionIndex: 0, title: 'HTML Body', content: normalizedText });
    } else if (normalizedMediaType.includes('markdown') || extension === 'md') {
      normalizedText = this.normalizeText(rawString);

      // Extract markdown headings as sections
      const headingRegex = /^(#{1,6})\s+(.+)$/gm;
      const matches = Array.from(normalizedText.matchAll(headingRegex));

      if (matches.length > 0) {
        let lastIdx = 0;
        matches.forEach((match, idx) => {
          const startIdx = match.index || 0;
          if (idx === 0 && startIdx > 0) {
            sections.push({
              sectionIndex: 0,
              title: 'Preamble',
              content: normalizedText.substring(0, startIdx).trim()
            });
          }
          const nextStartIdx = idx < matches.length - 1 ? (matches[idx + 1].index || normalizedText.length) : normalizedText.length;
          const sectionContent = normalizedText.substring(startIdx, nextStartIdx).trim();
          sections.push({
            sectionIndex: sections.length,
            title: match[2].trim(),
            content: sectionContent
          });
          lastIdx = nextStartIdx;
        });
      } else {
        sections.push({ sectionIndex: 0, title: 'Main Document', content: normalizedText });
      }
    } else {
      normalizedText = this.normalizeText(rawString);
      sections.push({ sectionIndex: 0, title: 'Main Document', content: normalizedText });
    }

    if (!normalizedText || normalizedText.trim().length === 0) {
      throw new Error(`Empty Content Error: Parsed text from '${file.fileName}' resulted in empty content`);
    }

    const docHash = this.calculateContentHash(normalizedText);
    const docId = `doc_${docHash.substring(0, 16)}`;

    const words = normalizedText.split(/\s+/).filter(w => w.length > 0);

    return {
      docId,
      docHash,
      fileName: file.fileName,
      mediaType: file.mediaType || `text/${extension || 'plain'}`,
      normalizedText,
      sections,
      metadata: {
        ...(file.metadata || {}),
        sourceRef: file.sourceRef || file.fileName,
        extension
      },
      characterCount: normalizedText.length,
      wordCount: words.length
    };
  }
}
