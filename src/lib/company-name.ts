const COMPANY_NAME = /(the)( Stores Consulting Group)/i;

/**
 * Splits plain title text so the full company name can be rendered with the
 * `company-name` component styles. Content stays plain text; no match returns
 * null.
 */
export function splitCompanyName(title: string): { before: string; the: string; rest: string; after: string } | null {
  const match = COMPANY_NAME.exec(title);
  if (!match) return null;
  return {
    before: title.slice(0, match.index),
    the: match[1],
    rest: match[2],
    after: title.slice(match.index + match[0].length),
  };
}
