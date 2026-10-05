// Image/CDN assets live on www even when the API host (BASE_URL) is staging.
// Normalize any golalita.com host (apex, www, gcstage, …) and relative paths.
const ASSET_ORIGIN = "https://www.golalita.com";

export const rewriteAssetUrl = (url) => {
  if (typeof url !== "string" || !url) {
    return url;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${ASSET_ORIGIN}${trimmed}`;
  }

  return trimmed.replace(
    /^https?:\/\/(?:[\w-]+\.)?golalita\.com(?=\/|:|$)/i,
    ASSET_ORIGIN
  );
};

export const getCategoryImageFallback = (id) => {
  if (id == null || !Number.isFinite(Number(id))) {
    return undefined;
  }
  return `${ASSET_ORIGIN}/go/api/image/${id}/x_image3/partner.category`;
};

export const pickCategoryImage = (item) => {
  const candidates = [
    item?.x_image_url_3,
    typeof item?.image3 === "string" ? item.image3 : null,
    item?.x_image_url_4,
    item?.x_gif_image,
    item?.image_url,
    item?.x_image_url_2,
  ].filter((value) => typeof value === "string" && value.trim());

  if (candidates[0]) {
    return rewriteAssetUrl(candidates[0]);
  }

  return getCategoryImageFallback(item?.id);
};

export const withRewrittenCategoryImages = (categories) =>
  (Array.isArray(categories) ? categories : []).map((item) => {
    const next = { ...item };
    [
      "x_image_url_2",
      "image_url",
      "x_image_url_3",
      "x_image_url_4",
      "x_gif_image",
      "image3",
    ].forEach((key) => {
      if (typeof next[key] === "string" && next[key]) {
        next[key] = rewriteAssetUrl(next[key]);
      }
    });
    if (!next.x_image_url_3) {
      next.x_image_url_3 = getCategoryImageFallback(next.id);
    }
    if (!next.image3 && next.x_image_url_3) {
      next.image3 = next.x_image_url_3;
    }
    return next;
  });
