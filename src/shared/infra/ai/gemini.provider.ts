import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IAIProvider } from './ai.provider.interface';
import { AppError } from '@/shared/errors/app-error';
import { HttpStatus } from '@/shared/http/http-status';
import { StructuredLogger } from '../logger/logger';

const GEMINI_TIMEOUT_MS = 10_000;

function rejectAfterTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${ms}ms`));
    }, ms);
  });
}

export class GeminiProvider implements IAIProvider {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  // just using gemini-1.5-flash for default model for now because it's free and fast,
  // but we can change it later to have better performance
  constructor(modelName: string = 'gemini-2.5-flash') {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new AppError('GEMINI_API_KEY is not defined in environment variables', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await Promise.race([this.model.generateContent(prompt), rejectAfterTimeout(GEMINI_TIMEOUT_MS)]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      StructuredLogger.error('Gemini API failed to generate text', { module: 'ai', details: error });
      throw new AppError(
        error instanceof Error ? error.message : 'Failed to generate text',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
