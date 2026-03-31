export function getTokenDelay(token: string, wpm: number): number {
  const safeWpm = Math.max(wpm, 50);
  const baseDelay = 60000 / safeWpm;

  const bareToken = token.replace(/[^\p{L}\p{N}'’-]/gu, '');
  let multiplier = 1;

  if (bareToken.length >= 8) {
    multiplier += 0.15;
  }

  if (bareToken.length >= 12) {
    multiplier += 0.15;
  }

  if (/[,:;)]$/.test(token)) {
    multiplier += 0.35;
  }

  if (/[.!?]$/.test(token)) {
    multiplier += 0.6;
  }

  return Math.round(baseDelay * multiplier);
}
