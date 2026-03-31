export function tokenizeText(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}
