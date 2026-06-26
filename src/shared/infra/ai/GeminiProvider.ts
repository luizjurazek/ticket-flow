import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IGeminiProvider } from './IGeminiProvider';
import { AppError } from '@/shared/errors/AppError';

export class GeminiProvider implements IGeminiProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  // just using gemini-1.5-flash for default model for now because it's free and fast,
  // but we can change it later to have better performance
  constructor(modelName: string = 'gemini-1.5-flash') {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new AppError('GEMINI_API_KEY is not defined in environment variables', 500);
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new AppError('Failed to generate content from Gemini', 500);
    }
  }
}
