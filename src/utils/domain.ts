export function getDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".");
    if (parts[0] === "www") parts.shift();
    return parts.length > 1 ? parts[parts.length - 2] : parts[0];
  } catch (e) {
    return "link";
  }
}

export function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
}
