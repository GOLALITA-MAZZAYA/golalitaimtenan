const sniffBase64Mime = b64 => {
  if (b64.startsWith('/9j/')) return 'image/jpeg';
  if (b64.startsWith('iVBOR')) return 'image/png';
  if (b64.startsWith('R0lGOD')) return 'image/gif';
  if (b64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
};

export const normalizeImageUri = uri => {
  if (!uri || typeof uri !== 'string') {
    return null;
  }

  const trimmed = uri.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,([\s\S]+)$/);
    if (match) {
      const b64 = match[1].replace(/\s/g, '');
      return `data:${sniffBase64Mime(b64)};base64,${b64}`;
    }
    return trimmed;
  }

  if (trimmed.startsWith('https://') || trimmed.startsWith('file://') || trimmed.startsWith('content://')) {
    return trimmed;
  }

  if (trimmed.startsWith('http://')) {
    return `https://${trimmed.slice(7)}`;
  }

  const b64 = trimmed.replace(/\s/g, '');
  return `data:${sniffBase64Mime(b64)};base64,${b64}`;
};

export const toImageSource = source => {
  if (!source || typeof source === 'number') {
    return source;
  }

  if (Array.isArray(source)) {
    return source.map(toImageSource);
  }

  const uri = typeof source === 'string' ? source : source.uri;
  const normalized = normalizeImageUri(uri);

  if (!normalized) {
    return source;
  }

  if (typeof source === 'string') {
    return { uri: normalized };
  }

  return { ...source, uri: normalized };
};
