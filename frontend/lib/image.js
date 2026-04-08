// Image URL helpers for responsive delivery.
export function getOptimizedImageUrl(url, { width = 900, quality = 75 } = {}) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  if (url.includes('res.cloudinary.com')) {
    // Apply Cloudinary automatic format/quality plus target width.
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }

  if (url.includes('images.unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=format&fit=crop&w=${width}&q=${quality}`;
  }

  return url;
}
