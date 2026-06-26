export interface IGeminiProvider {
  generateText(prompt: string): Promise<string>;
}
