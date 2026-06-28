import { IAIProvider } from '@/shared/infra/ai/ai.provider.interface';

export class FakeGeminiProvider implements IAIProvider {
  public responses: string[] = ['Mocked Gemini Response'];

  async generateText(prompt: string): Promise<string> {
    return this.responses[0];
  }

  public setResponse(response: string): void {
    this.responses = [response];
  }
}
