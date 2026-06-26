import { IGeminiProvider } from '@/shared/infra/ai/gemini.provider.interface';

export class FakeGeminiProvider implements IGeminiProvider {
  public responses: string[] = ['Mocked Gemini Response'];

  async generateText(prompt: string): Promise<string> {
    return this.responses[0];
  }

  public setResponse(response: string): void {
    this.responses = [response];
  }
}
