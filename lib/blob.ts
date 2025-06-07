import { put } from "@vercel/blob"
import { env } from "./env"


export async function uploadImageToBlob(imageUrl: string, filename: string): Promise<string> {
  try {
    // Convert relative URLs to absolute URLs
    if (imageUrl.startsWith('/')) {
      // Use your app's URL as the base
      const baseUrl = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      imageUrl = `${baseUrl}${imageUrl}`;
    }
    
    // Now fetch the image with a proper absolute URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Get the image as a blob
    const imageBlob = await response.blob();
    
    // Upload to Vercel Blob storage
    const { url } = await put(filename, imageBlob, {
      access: 'public',
      token: env.BLOB_READ_WRITE_TOKEN,
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading image to blob:', error);
    // Return the original URL in case of error
    return imageUrl;
  }
}

// // Test blob connection
export async function testBlobConnection() {
  try {
    const testBlob = new Blob(["test"], { type: "text/plain" })
    
    // Add random suffix to prevent conflicts
    const randomSuffix = Math.random().toString(36).substring(2, 10)
    const testFilename = `test-connection-${randomSuffix}.txt`
    
    const { url } = await put(testFilename, testBlob, {
      access: "public",
      token: env.BLOB_READ_WRITE_TOKEN,
    })

    // Clean up test file
    try {
      await fetch(url, { method: "DELETE" })
    } catch (e) {
      // Ignore cleanup errors
    }

    return { success: true, message: "Blob storage connection successful" }
  } catch (error) {
    return { success: false, message: `Blob storage connection failed: ${error}` }
  }
}
