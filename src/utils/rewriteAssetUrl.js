import { org } from '../org/config';

const TARGET_ORIGIN = `https://${org.baseUrl}`;

// Odoo often emits https://golalita.com/... (apex). That host 308s to www
// and is not in the SSL pin set, so native image loads fail. Staging pins
// gcptest, so also rewrite www → current env host.
export const rewriteAssetUrl = url => {
  if (typeof url !== 'string' || !url) {
    return url;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return `${TARGET_ORIGIN}${trimmed}`;
  }

  return trimmed.replace(
    /^https?:\/\/(?:www\.)?golalita\.com(?=\/|:|$)/i,
    TARGET_ORIGIN,
  );
};
