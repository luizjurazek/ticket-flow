export interface IAIProvider {
  generateText(prompt: string): Promise<string>;
}
