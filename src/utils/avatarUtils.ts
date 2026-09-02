/**
 * Helper utility to generate clean Hebrew initials from a person's full name.
 * e.g., "ציזנר גיא" -> "צג", "שקל ששון נאוה" -> "נש", "לוין אלי" -> "אל"
 */
export function getHebrewInitials(fullName: string): string {
  if (!fullName) return 'סג';
  
  const cleanName = fullName
    .replace(/[״"׳'()\-]/g, ' ')
    .trim();
    
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'סג';
  
  if (parts.length === 1) {
    return parts[0].slice(0, 2);
  }
  
  // First letter of first word and first letter of second/last word
  const first = parts[0][0] || '';
  const last = parts[parts.length - 1][0] || '';
  return `${first}${last}`;
}

/**
 * Returns a stable color hash based on the name for pleasant avatar background gradients.
 */
export function getAvatarColor(name: string): { bg: string; text: string; border: string } {
  const colors = [
    { bg: 'from-cyan-900/60 to-blue-900/80', text: 'text-cyan-300', border: 'border-cyan-500/40' },
    { bg: 'from-violet-900/60 to-indigo-900/80', text: 'text-violet-300', border: 'border-violet-500/40' },
    { bg: 'from-amber-900/60 to-orange-900/80', text: 'text-amber-300', border: 'border-amber-500/40' },
    { bg: 'from-emerald-900/60 to-teal-900/80', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    { bg: 'from-rose-900/60 to-pink-900/80', text: 'text-rose-300', border: 'border-rose-500/40' },
    { bg: 'from-blue-900/60 to-sky-900/80', text: 'text-sky-300', border: 'border-sky-500/40' },
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
