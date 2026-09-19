import { describe, it, expect } from "vitest";
import {
  extractHostname,
  getQuickLinkIcon,
  resolveQuickLinkAvatar,
} from "./quick-link-icons";

describe("quick-link-icons", () => {
  describe("extractHostname", () => {
    it("extracts hostname from full HTTPS URLs", () => {
      expect(extractHostname("https://github.com")).toBe("github.com");
      expect(extractHostname("https://github.com/va1bhavx")).toBe("github.com");
      expect(extractHostname("https://www.github.com/dashboard")).toBe("github.com");
    });

    it("extracts hostname from HTTP URLs", () => {
      expect(extractHostname("http://github.com")).toBe("github.com");
    });

    it("extracts hostname from bare domain names without protocol", () => {
      expect(extractHostname("github.com")).toBe("github.com");
      expect(extractHostname("www.linkedin.com")).toBe("linkedin.com");
    });

    it("strips mobile m. subdomains", () => {
      expect(extractHostname("https://m.youtube.com")).toBe("youtube.com");
    });

    it("preserves other subdomains", () => {
      expect(extractHostname("https://gist.github.com")).toBe("gist.github.com");
      expect(extractHostname("https://docs.google.com")).toBe("docs.google.com");
    });

    it("handles empty or invalid strings safely", () => {
      expect(extractHostname("")).toBe("");
      expect(extractHostname("   ")).toBe("");
    });
  });

  describe("getQuickLinkIcon", () => {
    it("matches github for all variants", () => {
      expect(getQuickLinkIcon("https://github.com")?.id).toBe("github");
      expect(getQuickLinkIcon("https://github.com/va1bhavx")?.id).toBe("github");
      expect(getQuickLinkIcon("http://github.com")?.id).toBe("github");
      expect(getQuickLinkIcon("github.com")?.id).toBe("github");
      expect(getQuickLinkIcon("gist.github.com")?.id).toBe("github");
    });

    it("matches youtube and youtu.be", () => {
      expect(getQuickLinkIcon("https://youtube.com")?.id).toBe("youtube");
      expect(getQuickLinkIcon("https://www.youtube.com/watch?v=123")?.id).toBe("youtube");
      expect(getQuickLinkIcon("https://youtu.be/abc")?.id).toBe("youtube");
    });

    it("matches linkedin", () => {
      expect(getQuickLinkIcon("https://linkedin.com")?.id).toBe("linkedin");
      expect(getQuickLinkIcon("https://www.linkedin.com/in/someone")?.id).toBe("linkedin");
      expect(getQuickLinkIcon("linkedin.com")?.id).toBe("linkedin");
    });

    it("matches reddit", () => {
      expect(getQuickLinkIcon("https://reddit.com")?.id).toBe("reddit");
      expect(getQuickLinkIcon("https://old.reddit.com/r/react")?.id).toBe("reddit");
    });

    it("matches facebook, instagram, and whatsapp", () => {
      expect(getQuickLinkIcon("https://facebook.com")?.id).toBe("facebook");
      expect(getQuickLinkIcon("https://fb.com/page")?.id).toBe("facebook");
      expect(getQuickLinkIcon("https://instagram.com/profile")?.id).toBe("instagram");
      expect(getQuickLinkIcon("https://web.whatsapp.com")?.id).toBe("whatsapp");
    });

    it("matches spotify, amazon, netflix, and twitch", () => {
      expect(getQuickLinkIcon("https://open.spotify.com")?.id).toBe("spotify");
      expect(getQuickLinkIcon("https://www.amazon.com/dp/123")?.id).toBe("amazon");
      expect(getQuickLinkIcon("https://netflix.com/browse")?.id).toBe("netflix");
      expect(getQuickLinkIcon("https://twitch.tv/streamer")?.id).toBe("twitch");
    });

    it("matches wikipedia, dropbox, and zoom", () => {
      expect(getQuickLinkIcon("https://en.wikipedia.org/wiki/React")?.id).toBe("wikipedia");
      expect(getQuickLinkIcon("https://dropbox.com/home")?.id).toBe("dropbox");
      expect(getQuickLinkIcon("https://zoom.us/j/123")?.id).toBe("zoom");
    });

    it("returns null for unknown domain", () => {
      expect(getQuickLinkIcon("https://myrandompersonalblog.io")).toBeNull();
      expect(getQuickLinkIcon("https://example.com")).toBeNull();
    });
  });

  describe("resolveQuickLinkAvatar", () => {
    it("resolves to icon for known domain", () => {
      const res = resolveQuickLinkAvatar("GitHub", "https://github.com/user");
      expect(res.type).toBe("icon");
      expect(res.iconName).toBe("GitHub");
      expect(res.renderIcon).toBeDefined();
    });

    it("resolves to initials for unknown domain", () => {
      const res = resolveQuickLinkAvatar("Tailwind CSS", "https://tailwindcss.com");
      expect(res.type).toBe("initials");
      expect(res.initials).toBe("TC");
    });

    it("handles single-word or empty labels gracefully", () => {
      const res = resolveQuickLinkAvatar("Documentation", "https://internal-wiki.local");
      expect(res.type).toBe("initials");
      expect(res.initials).toBe("DO");
    });
  });
});
