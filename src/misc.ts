export function newChildToken(): string {
  const n = 16;
  const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM';
  return Array(n).fill(0).map(() => alphabet[Math.floor(alphabet.length * Math.random())]).join('');
}
