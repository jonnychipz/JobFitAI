import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
import { config } from "../config";
import { CVData } from "../types";

/**
 * Azure Storage Service for CV file management
 * Uses Managed Identity in production, connection string in development
 */
export class StorageService {
  private containerClient: ContainerClient | null = null;
  private initialized: boolean = false;

  /**
   * Initialize the storage client with proper authentication
   */
  private async initialize(): Promise<void> {
    if (this.initialized && this.containerClient) {
      return;
    }

    try {
      let blobServiceClient: BlobServiceClient;

      // In production (Azure Functions), use managed identity
      if (!config.isDevelopment && config.azure.storage.accountName) {
        const credential = new DefaultAzureCredential();
        const accountUrl = `https://${config.azure.storage.accountName}.blob.core.windows.net`;
        blobServiceClient = new BlobServiceClient(accountUrl, credential);
      }
      // In development, use connection string
      else if (config.azure.storage.connectionString) {
        blobServiceClient = BlobServiceClient.fromConnectionString(
          config.azure.storage.connectionString
        );
      } else {
        throw new Error(
          "Storage configuration missing: either AZURE_STORAGE_ACCOUNT_NAME (with managed identity) or AZURE_STORAGE_CONNECTION_STRING required"
        );
      }

      this.containerClient = blobServiceClient.getContainerClient(
        config.azure.storage.containerName
      );

      // Create container if it doesn't exist (with no public access)
      await this.containerClient.createIfNotExists();

      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize storage client:", error);
      throw new Error(
        `Storage initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get the container client (initialize if needed)
   */
  private async getContainerClient(): Promise<ContainerClient> {
    if (!this.containerClient || !this.initialized) {
      await this.initialize();
    }
    if (!this.containerClient) {
      throw new Error("Storage client not initialized");
    }
    return this.containerClient;
  }

  /**
   * Upload CV file content to blob storage
   */
  async uploadCV(
    cvId: string,
    fileName: string,
    content: Buffer | string
  ): Promise<string> {
    const container = await this.getContainerClient();
    const blobName = `${cvId}/${fileName}`;
    const blockBlobClient = container.getBlockBlobClient(blobName);

    await blockBlobClient.upload(content, Buffer.byteLength(content), {
      blobHTTPHeaders: {
        blobContentType: this.getContentType(fileName),
      },
    });

    return blockBlobClient.url;
  }

  /**
   * Upload CV metadata as JSON
   */
  async uploadCVMetadata(cvData: CVData): Promise<string> {
    const container = await this.getContainerClient();
    const blobName = `${cvData.id}/metadata.json`;
    const blockBlobClient = container.getBlockBlobClient(blobName);

    const content = JSON.stringify(cvData, null, 2);
    await blockBlobClient.upload(content, content.length, {
      blobHTTPHeaders: {
        blobContentType: "application/json",
      },
    });

    return blockBlobClient.url;
  }

  /**
   * Download CV file content from blob storage
   */
  async downloadCV(cvId: string, fileName: string): Promise<Buffer> {
    const container = await this.getContainerClient();
    const blobName = `${cvId}/${fileName}`;
    const blockBlobClient = container.getBlockBlobClient(blobName);

    const downloadResponse = await blockBlobClient.download(0);
    if (!downloadResponse.readableStreamBody) {
      throw new Error("Failed to download CV file");
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
  }

  /**
   * Get CV metadata from blob storage
   */
  async getCVMetadata(cvId: string): Promise<CVData | null> {
    try {
      const container = await this.getContainerClient();
      const blobName = `${cvId}/metadata.json`;
      const blockBlobClient = container.getBlockBlobClient(blobName);

      const downloadResponse = await blockBlobClient.download(0);
      if (!downloadResponse.readableStreamBody) {
        return null;
      }

      const chunks: Buffer[] = [];
      for await (const chunk of downloadResponse.readableStreamBody) {
        chunks.push(Buffer.from(chunk));
      }

      const content = Buffer.concat(chunks).toString("utf-8");
      return JSON.parse(content) as CVData;
    } catch (error) {
      if ((error as any).statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * List all CVs for a user
   */
  async listUserCVs(userId: string): Promise<CVData[]> {
    const container = await this.getContainerClient();
    const cvs: CVData[] = [];

    // List all blobs with metadata.json suffix
    for await (const blob of container.listBlobsFlat({ prefix: "" })) {
      if (blob.name.endsWith("/metadata.json")) {
        try {
          const cvId = blob.name.split("/")[0];
          const metadata = await this.getCVMetadata(cvId);
          if (metadata && metadata.userId === userId) {
            cvs.push(metadata);
          }
        } catch (error) {
          console.error(`Failed to load metadata for ${blob.name}:`, error);
        }
      }
    }

    return cvs.sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  /**
   * Delete CV and all associated files
   */
  async deleteCV(cvId: string): Promise<void> {
    const container = await this.getContainerClient();
    const prefix = `${cvId}/`;

    // Delete all blobs with this prefix
    for await (const blob of container.listBlobsFlat({ prefix })) {
      await container.deleteBlob(blob.name);
    }
  }

  /**
   * Check if CV exists
   */
  async cvExists(cvId: string): Promise<boolean> {
    const metadata = await this.getCVMetadata(cvId);
    return metadata !== null;
  }

  /**
   * Get content type based on file extension
   */
  private getContentType(fileName: string): string {
    const ext = fileName.toLowerCase().split(".").pop();
    switch (ext) {
      case "pdf":
        return "application/pdf";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "doc":
        return "application/msword";
      case "txt":
        return "text/plain";
      default:
        return "application/octet-stream";
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
