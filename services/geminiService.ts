
import { GoogleGenAI } from "@google/genai";
import { VideoParams, ImageParams } from '../types';

export const geminiService = {
  generateImage: async (prompt: string, params: ImageParams): Promise<string> => {
    // Selalu inisialisasi instance baru untuk mengambil API_KEY terbaru dari environment
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [{ text: `${prompt}. Style: ${params.style}. Color grading: ${params.colorGrading}` }];
    
    if (params.referenceImages && params.referenceImages.length > 0) {
      params.referenceImages.forEach(imgB64 => {
        parts.push({
          inlineData: {
            data: imgB64.split(',')[1],
            mimeType: 'image/png'
          }
        });
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: params.aspectRatio,
          }
        }
      });

      if (!response.candidates?.[0]?.content?.parts) throw new Error("Gagal mendapatkan aset visual.");

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error('Format gambar tidak didukung oleh mesin.');
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_NOT_FOUND");
      }
      throw error;
    }
  },

  generateVideo: async (imageB64: string, prompt: string, params: VideoParams): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let charDetails = '';
    if (params.character && (params.character.name || params.character.features)) {
      charDetails = `Character Name: ${params.character.name}. Features: ${params.character.features}. Outfit: ${params.character.outfit}.`;
    }

    const videoPrompt = `
      Create a cinematic video from this starting image.
      Primary Action: ${prompt}.
      Visual Style: ${params.style}.
      Camera Technique: ${params.cameraAngle}.
      Context: ${params.scene || 'None'}.
      ${charDetails}
    `;

    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: videoPrompt,
        image: {
          imageBytes: imageB64.split(',')[1],
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: params.aspectRatio,
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Gagal mendapatkan link unduhan video.");

      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) throw new Error("Gagal mengunduh file video dari server.");
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        throw new Error("KEY_NOT_FOUND");
      }
      throw error;
    }
  }
};
