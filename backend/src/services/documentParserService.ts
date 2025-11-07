import pdf from "pdf-parse";
import * as mammoth from "mammoth";

/**
 * Document Parser Service
 * Extracts text from PDF and DOCX files
 */
export class DocumentParserService {
  /**
   * Parse a PDF file and extract text
   */
  async parsePDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      throw new Error(
        `PDF parsing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Parse a DOCX file and extract text
   */
  async parseDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(
        `DOCX parsing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Parse a document based on file extension
   */
  async parseDocument(buffer: Buffer, fileName: string): Promise<string> {
    const extension = fileName.toLowerCase().split(".").pop();

    switch (extension) {
      case "pdf":
        return await this.parsePDF(buffer);
      case "docx":
        return await this.parseDOCX(buffer);
      case "txt":
        return buffer.toString("utf-8");
      default:
        throw new Error(
          `Unsupported file type: ${extension}. Supported types: PDF, DOCX, TXT`
        );
    }
  }
}

// Export singleton instance
export const documentParserService = new DocumentParserService();
