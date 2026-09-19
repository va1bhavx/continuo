import React from "react";
import { getInitials } from "../components/web/manage-links";

export interface IconProps {
  size?: number;
  className?: string;
}

export interface QuickLinkIconDefinition {
  id: string;
  name: string;
  domains: string[];
  render: (props: IconProps) => React.ReactNode;
}

// Crisp inline SVGs for prominent domains
const GitHubIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const YouTubeIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const RedditIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.095.333.333 0 0 0 0 .468c.742.743 1.895 1.077 2.947 1.077 1.053 0 2.205-.334 2.947-1.077a.333.333 0 0 0 0-.468.327.327 0 0 0-.468 0c-.571.57-1.57.842-2.479.842-.908 0-1.908-.272-2.479-.842a.326.326 0 0 0-.239-.095z" />
  </svg>
);

const XTwitterIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.553 4.197 1.603 6.02L.055 24l6.104-1.601A11.97 11.97 0 0 0 12.031 24C18.677 24 24 18.677 24 12.031 24 5.385 18.677 0 12.031 0zm7.042 17.067c-.296.832-1.47 1.536-2.023 1.597-.525.058-1.21.082-3.87-1.021-3.239-1.341-5.328-4.636-5.489-4.851-.157-.216-1.309-1.745-1.309-3.327 0-1.583.829-2.361 1.124-2.684.296-.324.646-.405.861-.405.215 0 .431.002.619.011.199.01.464-.075.726.554.27.647.915 2.235.996 2.397.081.162.135.351.027.567-.108.216-.162.351-.323.54-.162.189-.341.423-.487.567-.162.162-.332.338-.143.662.189.324.839 1.385 1.802 2.242 1.238 1.103 2.282 1.445 2.606 1.607.324.162.513.135.702-.081.189-.216.809-.944 1.025-1.268.216-.324.432-.27.728-.162.297.108 1.889.89 2.213 1.052.324.162.54.243.62.378.081.135.081.783-.216 1.615z" />
  </svg>
);

const TelegramIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const TikTokIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.91c-.01 2.37-.9 4.73-2.57 6.4-1.7 1.7-4.13 2.64-6.55 2.56-2.43-.07-4.8-1.07-6.44-2.82-1.62-1.72-2.5-4.13-2.42-6.53.07-2.45 1.08-4.81 2.82-6.45 1.75-1.64 4.19-2.52 6.62-2.41.05 1.34.02 2.68.03 4.02-1.32-.07-2.69.37-3.62 1.33-.94.96-1.43 2.34-1.32 3.69.1 1.32.79 2.58 1.86 3.37 1.07.8 2.52 1.04 3.79.66 1.25-.38 2.27-1.42 2.64-2.67.16-.54.23-1.1.23-1.66V.02z" />
  </svg>
);

const NetflixIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5.398 0v24h3.69V10.222L14.912 24h3.69V0h-3.69v13.778L9.088 0H5.398z" />
  </svg>
);

const AmazonIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.918 13.953c-.352.029-.714-.078-.967-.323-.393-.38-.415-1.01-.06-1.422.383-.443 1.076-.554 1.627-.611 1.096-.114 2.22-.057 3.284.199.114.77-.142 1.6-.826 1.942-.313.157-.683.214-1.058.215zm4.842 5.093c-1.905 1.397-4.323 2.137-6.726 2.137-3.414 0-6.602-1.424-8.887-3.818-.284-.299-.043-.655.327-.47 2.378 1.182 5.048 1.822 7.771 1.822 2.179 0 4.385-.455 6.27-1.395.427-.213.797.242.417.585zm1.536-1.252c-.242-.313-1.594-.74-2.206-.883-.185-.043-.284.143-.142.271.954.854 2.063 1.224 2.348 1.509.284.285.341 1.395-.498 2.406-.1.114.029.256.157.17 1.024-.71 2.063-2.133 1.708-3.078-.071-.185-.825-.342-1.367-.395zm-3.214-9.3c-.342-1.282-1.353-2.023-2.548-2.023-1.068 0-1.922.584-2.221 1.48-.071.214-.085.456-.043.684.342-.043.697-.071 1.053-.085 1.253-.057 2.506.014 3.759-.056zm3.371 4.544c-.057-.755-.256-1.481-.598-2.15-.754-1.467-2.121-2.406-3.759-2.549-1.124-.099-2.249-.042-3.372.043-.684.057-1.438.17-2.065.484-1.253.627-1.95 1.823-1.794 3.204.143 1.268 1.01 2.278 2.249 2.535 1.281.27 2.605.085 3.843-.27.427-.129.84-.285 1.239-.47v.512c0 .727-.27 1.424-.755 1.966-.626.697-1.537.982-2.449.911-1.025-.085-1.922-.683-2.32-1.623-.086-.199-.271-.299-.484-.242l-1.652.541c-.185.057-.27.27-.199.455.755 1.837 2.478 2.99 4.457 3.104 1.765.1 3.518-.54 4.671-1.894.882-1.039 1.267-2.42 1.267-3.788l-.071-4.71z" />
  </svg>
);

const SpotifyIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const TwitchIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const StackOverflowIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.666 4.626.933-1.931-9.664-4.631-.935 1.936zm3.012-4.99l8.118 6.945 1.399-1.626-8.119-6.946-1.398 1.627zM15.407.5l-1.758 1.218 6.096 8.78 1.76-1.22L15.407.5z" />
  </svg>
);

const GoogleIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const GmailIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const DiscordIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const NotionIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.735c-.466-.373-.886-.466-2.053-.373L2.733 2.527c-.466.047-.56.327-.373.513l2.099 1.168zm.933 3.687v12.787c0 .84.42 1.12 1.306 1.027l14.195-.84c.886-.046.98-.606.98-1.26V6.96c0-.7-.373-.933-1.073-.886l-14.475.84c-.653.047-.933.327-.933.981zm13.729.84l.093 11.201c0 .28-.14.42-.42.42l-.56-.047-4.293-6.533v6.393c0 .327-.233.42-.653.42h-.887c-.42 0-.466-.187-.466-.514V10.15c0-.327.186-.467.56-.467l4.806 7.14V9.208c0-.327.234-.467.56-.467h1.253z" />
  </svg>
);

const FigmaIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 12a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm-6 0a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm6 6a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3zm-6 0a3 3 0 0 1-3-3 3 3 0 0 1 3-3h3v3a3 3 0 0 1-3 3zm0-12a3 3 0 0 1 3-3h3v6h-3a3 3 0 0 1-3-3zm6-3h3a3 3 0 0 1 0 6h-3z" />
  </svg>
);

const SlackIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const BlueskyIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.797-7.993C2.569 1.045 1.565 1.368.906 1.668.295 1.966.157 3.136.157 3.824c0 .688.378 5.648.624 6.476.815 2.735 3.711 3.658 6.382 3.364-3.913.58-7.386 2.004-2.83 7.075 5.011 5.19 6.868-1.114 7.82-4.306.953 3.192 2.049 9.267 7.73 4.306 4.265-4.306 1.171-6.495-2.74-7.075 2.67.294 5.567-.629 6.382-3.364.246-.828.623-5.788.623-6.476 0-.688-.138-1.858-.75-2.156-.658-.3-1.662-.623-4.296 1.139-2.75 1.94-5.71 5.879-6.798 7.993z" />
  </svg>
);

const VercelIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);

const OpenAIIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.784a4.472 4.472 0 0 1 2.36-1.973V12.6a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.784zm16.598 2.559L13.123 7.99l2.02-1.164a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.43-.699zm2.01-4.423l-.143-.09-4.767-2.756a.794.794 0 0 0-.782 0L9.414 7.443V5.11a.075.075 0 0 1 .033-.062l4.84-2.796a4.499 4.499 0 0 1 6.663 4.228zM8.306 12.86v-2.38l3.694-2.132 3.694 2.133v4.265l-3.694 2.133z" />
  </svg>
);

const GitLabIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 0 0-.867 0L1.387 9.452.045 13.587a.91.91 0 0 0 .33.993l11.625 8.445 11.625-8.445a.91.91 0 0 0 .33-.993z" />
  </svg>
);

const PinterestIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.95-.13-2.41.03-3.45l1.07-4.54s-.27-.55-.27-1.37c0-1.28.74-2.24 1.67-2.24.79 0 1.17.59 1.17 1.3 0 .79-.51 1.98-.77 3.08-.22.92.46 1.67 1.36 1.67 1.64 0 2.9-1.73 2.9-4.22 0-2.21-1.59-3.75-3.86-3.75-2.63 0-4.17 1.97-4.17 4.01 0 .79.31 1.64.69 2.11.08.09.09.18.07.27l-.26 1.05c-.04.18-.14.22-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.37 5.92 5.55 0 3.31-2.09 5.98-4.99 5.98-.97 0-1.89-.51-2.2-1.11l-.6 2.29c-.22.84-.81 1.89-1.21 2.53A12.01 12.01 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
  </svg>
);

const MediumIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const SubstackIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
  </svg>
);

const ThreadsIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.82 8.653c-.225 3.364-1.97 5.163-4.877 5.163-1.464 0-2.614-.541-3.237-1.523v2.89c.866.52 1.956.816 3.237.816 2.82 0 4.887-1.432 5.309-4.22h2.247c-.52 3.99-3.415 6.09-7.556 6.09-2.025 0-3.73-.623-4.997-1.821C6.702 14.88 6.06 13.12 6.06 11.02c0-2.1.642-3.86 1.886-5.048C9.213 4.784 10.918 4.16 12.943 4.16c3.968 0 6.643 2.053 7.027 5.673h-2.15c-.328-2.457-1.956-3.794-4.877-3.794-1.39 0-2.522.457-3.266 1.32-.743.864-1.144 2.115-1.144 3.661s.401 2.797 1.144 3.661c.744.863 1.876 1.32 3.266 1.32 1.923 0 3.337-.887 3.82-2.348h-3.82v-1.7h5.82v1.7z" />
  </svg>
);

const AppleIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.83c.67-.82 1.12-1.96 1-3.1-.97.04-2.14.65-2.83 1.45-.6.69-1.13 1.85-.99 2.97 1.08.08 2.19-.55 2.82-1.32" />
  </svg>
);

const MicrosoftIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M0 0h11.4v11.4H0zM12.6 0H24v11.4H12.6zM0 12.6h11.4V24H0zM12.6 12.6H24V24H12.6z" />
  </svg>
);

const LinearIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M2.583 20.355C1.196 18.232.387 15.689.387 12.955c0-6.942 5.626-12.568 12.568-12.568 2.734 0 5.277.809 7.4 2.196L2.583 20.355zm2.735 1.777L21.43 5.485c1.388 2.123 2.197 4.666 2.197 7.4 0 6.942-5.626 12.568-12.568 12.568-2.734 0-5.277-.809-7.4-2.196z" />
  </svg>
);

const TrelloIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.5 0H4.5C2.015 0 0 2.015 0 4.5v15C0 21.985 2.015 24 4.5 24h15c2.485 0 4.5-2.015 4.5-4.5V4.5C24 2.015 21.985 0 19.5 0zM10 16.5c0 .828-.672 1.5-1.5 1.5h-3A1.5 1.5 0 0 1 4 16.5v-11C4 4.672 4.672 4 5.5 4h3c.828 0 1.5.672 1.5 1.5v11zm10-5c0 .828-.672 1.5-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6c0-.828.672-1.5 1.5-1.5h3c.828 0 1.5.672 1.5 1.5v6z" />
  </svg>
);

const DribbbleIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm8.566 8.358a9.92 9.92 0 0 1-3.606 2.87 23.36 23.36 0 0 0-4.043-4.57 9.873 9.873 0 0 1 7.649 1.7zm-9.358-6.3a9.888 9.888 0 0 1 5.922 2.046c-.958 1.107-2.115 2.274-3.46 3.486A26.96 26.96 0 0 1 8.52 3.013c.866-.62 1.838-.955 2.688-.955zM6.67 3.967c.725 1.258 1.632 2.637 2.71 4.116-2.738 1.29-5.741 2.09-7.303 2.378A9.974 9.974 0 0 1 6.67 3.967zM2.057 12.443c1.782-.32 4.966-1.127 7.828-2.483.473.874.92 1.769 1.34 2.684-3.79 1.493-7.227 4.542-8.312 5.642a9.92 9.92 0 0 1-.856-5.843zm10.702 9.474a9.914 9.914 0 0 1-5.787-1.898c.95-.98 4.2-3.832 7.896-5.26a27.18 27.18 0 0 1 1.777 6.848 9.89 9.89 0 0 1-3.886.31zm5.275-1.57a25.32 25.32 0 0 0-1.688-6.327c1.378-.453 2.915-.694 4.55-.713a9.97 9.97 0 0 1-2.862 7.04z" />
  </svg>
);

const WikipediaIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.09 13.124 9.018 4.792H6.96L.768 20.354h2.24l1.696-4.528h5.68l1.648 4.528h2.096l3.392-8.912 3.424 8.912h2.096L23.232 4.792h-2.08l-5.696 15.152-3.36-8.82zm-4.704.832 2.048-5.488 2.048 5.488H7.386z" />
  </svg>
);

const DropboxIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M6 2.025l6 3.825-6 3.825L0 5.85 6 2.025zm12 0l6 3.825-6 3.825-6-3.825 6-3.825zM0 13.5l6 3.825 6-3.825-6-3.825L0 13.5zm18-3.825l-6 3.825 6 3.825 6-3.825-6-3.825zM6 18.6l6-3.825 6 3.825-6 3.825-6-3.825z" />
  </svg>
);

const ZoomIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M1.385 5.5A1.385 1.385 0 0 0 0 6.885v10.23c0 .765.62 1.385 1.385 1.385h13.385a1.385 1.385 0 0 0 1.385-1.385v-3.15l5.88 4.2a.58.58 0 0 0 .965-.435V6.27a.58.58 0 0 0-.965-.435l-5.88 4.2V6.885A1.385 1.385 0 0 0 14.77 5.5H1.385z" />
  </svg>
);

const CanvaIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.375 16.71c-3.12 0-5.265-2.07-5.265-4.77 0-3.045 2.535-5.175 5.76-5.175 1.62 0 2.85.51 3.51 1.23l-1.08 1.29c-.585-.54-1.425-.87-2.4-.87-2.07 0-3.795 1.365-3.795 3.495 0 1.845 1.485 3.165 3.39 3.165.735 0 1.485-.195 1.995-.495v-1.62h-2.1v-1.56h3.81v3.915c-.945.87-2.31 1.395-3.825 1.395z" />
  </svg>
);

const QuoraIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.75 0C5.707 0 0 5.529 0 12.35c0 6.643 5.373 12.046 12.164 12.333l.235 2.067c.07.616.592 1.077 1.212 1.077.303 0 .603-.11.839-.32l3.411-3.04c3.818-1.785 6.139-5.59 6.139-9.767C24 5.529 18.293 0 12.75 0zm.014 20.315c-4.484 0-8.12-3.57-8.12-7.965 0-4.394 3.636-7.965 8.12-7.965 4.485 0 8.121 3.571 8.121 7.965 0 4.395-3.636 7.965-8.121 7.965z" />
  </svg>
);

const LeetCodeIcon: React.FC<IconProps> = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.815 3.655 5.86 5.86 0 0 0 3.34-.658l3.415-2.124a1.378 1.378 0 0 0 .543-1.895 1.379 1.379 0 0 0-1.895-.544l-3.41 2.12a3.107 3.107 0 0 1-1.782.35 3.167 3.167 0 0 1-2.55-1.95 3.125 3.125 0 0 1-.22-.71 3.01 3.01 0 0 1-.035-1.29 2.97 2.97 0 0 1 .685-1.205l3.85-4.12 5.405-5.787a1.376 1.376 0 0 0-.05-1.946A1.37 1.37 0 0 0 13.483 0zm-2.88 7.218a1.377 1.377 0 0 0-.974.405L4.57 12.75a1.378 1.378 0 1 0 1.95 1.95l5.06-5.127a1.377 1.377 0 0 0-.976-2.355zm6.47 5.76a1.376 1.376 0 0 0-.97.404l-3.06 3.1a1.378 1.378 0 1 0 1.95 1.95l3.06-3.1a1.378 1.378 0 0 0-.98-2.354z" />
  </svg>
);

// Centralized Quick Link Icon Registry
export const QUICK_LINK_ICONS: QuickLinkIconDefinition[] = [
  {
    id: "github",
    name: "GitHub",
    domains: ["github.com", "github.io"],
    render: (props) => <GitHubIcon {...props} />,
  },
  {
    id: "youtube",
    name: "YouTube",
    domains: ["youtube.com", "youtu.be"],
    render: (props) => <YouTubeIcon {...props} />,
  },
  {
    id: "facebook",
    name: "Facebook",
    domains: ["facebook.com", "fb.com", "messenger.com"],
    render: (props) => <FacebookIcon {...props} />,
  },
  {
    id: "instagram",
    name: "Instagram",
    domains: ["instagram.com"],
    render: (props) => <InstagramIcon {...props} />,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    domains: ["whatsapp.com"],
    render: (props) => <WhatsAppIcon {...props} />,
  },
  {
    id: "telegram",
    name: "Telegram",
    domains: ["telegram.org", "t.me"],
    render: (props) => <TelegramIcon {...props} />,
  },
  {
    id: "tiktok",
    name: "TikTok",
    domains: ["tiktok.com"],
    render: (props) => <TikTokIcon {...props} />,
  },
  {
    id: "netflix",
    name: "Netflix",
    domains: ["netflix.com"],
    render: (props) => <NetflixIcon {...props} />,
  },
  {
    id: "amazon",
    name: "Amazon",
    domains: [
      "amazon.com",
      "amazon.in",
      "amazon.co.uk",
      "amazon.de",
      "amazon.ca",
      "amazon.co.jp",
      "amazon.fr",
      "amazon.es",
      "amazon.it",
    ],
    render: (props) => <AmazonIcon {...props} />,
  },
  {
    id: "spotify",
    name: "Spotify",
    domains: ["spotify.com"],
    render: (props) => <SpotifyIcon {...props} />,
  },
  {
    id: "twitch",
    name: "Twitch",
    domains: ["twitch.tv"],
    render: (props) => <TwitchIcon {...props} />,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    domains: ["linkedin.com"],
    render: (props) => <LinkedInIcon {...props} />,
  },
  {
    id: "reddit",
    name: "Reddit",
    domains: ["reddit.com"],
    render: (props) => <RedditIcon {...props} />,
  },
  {
    id: "x",
    name: "X / Twitter",
    domains: ["x.com", "twitter.com"],
    render: (props) => <XTwitterIcon {...props} />,
  },
  {
    id: "threads",
    name: "Threads",
    domains: ["threads.net"],
    render: (props) => <ThreadsIcon {...props} />,
  },
  {
    id: "gmail",
    name: "Gmail",
    domains: ["gmail.com", "mail.google.com"],
    render: (props) => <GmailIcon {...props} />,
  },
  {
    id: "google",
    name: "Google",
    domains: ["google.com", "drive.google.com", "calendar.google.com", "docs.google.com"],
    render: (props) => <GoogleIcon {...props} />,
  },
  {
    id: "discord",
    name: "Discord",
    domains: ["discord.com", "discord.gg"],
    render: (props) => <DiscordIcon {...props} />,
  },
  {
    id: "notion",
    name: "Notion",
    domains: ["notion.so", "notion.site"],
    render: (props) => <NotionIcon {...props} />,
  },
  {
    id: "figma",
    name: "Figma",
    domains: ["figma.com"],
    render: (props) => <FigmaIcon {...props} />,
  },
  {
    id: "slack",
    name: "Slack",
    domains: ["slack.com"],
    render: (props) => <SlackIcon {...props} />,
  },
  {
    id: "bluesky",
    name: "Bluesky",
    domains: ["bsky.app"],
    render: (props) => <BlueskyIcon {...props} />,
  },
  {
    id: "vercel",
    name: "Vercel",
    domains: ["vercel.com", "vercel.app"],
    render: (props) => <VercelIcon {...props} />,
  },
  {
    id: "chatgpt",
    name: "ChatGPT / OpenAI",
    domains: ["chatgpt.com", "openai.com"],
    render: (props) => <OpenAIIcon {...props} />,
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    domains: ["stackoverflow.com"],
    render: (props) => <StackOverflowIcon {...props} />,
  },
  {
    id: "gitlab",
    name: "GitLab",
    domains: ["gitlab.com"],
    render: (props) => <GitLabIcon {...props} />,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    domains: ["pinterest.com"],
    render: (props) => <PinterestIcon {...props} />,
  },
  {
    id: "medium",
    name: "Medium",
    domains: ["medium.com"],
    render: (props) => <MediumIcon {...props} />,
  },
  {
    id: "substack",
    name: "Substack",
    domains: ["substack.com"],
    render: (props) => <SubstackIcon {...props} />,
  },
  {
    id: "linear",
    name: "Linear",
    domains: ["linear.app"],
    render: (props) => <LinearIcon {...props} />,
  },
  {
    id: "trello",
    name: "Trello",
    domains: ["trello.com"],
    render: (props) => <TrelloIcon {...props} />,
  },
  {
    id: "apple",
    name: "Apple",
    domains: ["apple.com", "icloud.com"],
    render: (props) => <AppleIcon {...props} />,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    domains: ["microsoft.com", "outlook.com", "office.com", "live.com"],
    render: (props) => <MicrosoftIcon {...props} />,
  },
  {
    id: "dribbble",
    name: "Dribbble",
    domains: ["dribbble.com"],
    render: (props) => <DribbbleIcon {...props} />,
  },
  {
    id: "wikipedia",
    name: "Wikipedia",
    domains: ["wikipedia.org"],
    render: (props) => <WikipediaIcon {...props} />,
  },
  {
    id: "dropbox",
    name: "Dropbox",
    domains: ["dropbox.com"],
    render: (props) => <DropboxIcon {...props} />,
  },
  {
    id: "zoom",
    name: "Zoom",
    domains: ["zoom.us"],
    render: (props) => <ZoomIcon {...props} />,
  },
  {
    id: "canva",
    name: "Canva",
    domains: ["canva.com"],
    render: (props) => <CanvaIcon {...props} />,
  },
  {
    id: "quora",
    name: "Quora",
    domains: ["quora.com"],
    render: (props) => <QuoraIcon {...props} />,
  },
  {
    id: "leetcode",
    name: "LeetCode",
    domains: ["leetcode.com"],
    render: (props) => <LeetCodeIcon {...props} />,
  },
];

/**
 * Normalizes any URL string by trimming and ensuring a protocol exists.
 */
export function normalizeUrl(rawUrl: string): string {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Extracts a normalized hostname from a URL, stripping "www." or "m." prefix.
 */
export function extractHostname(rawUrl: string): string {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return "";
  try {
    const urlObj = new URL(normalized);
    let host = urlObj.hostname.toLowerCase();
    if (host.startsWith("www.")) {
      host = host.slice(4);
    } else if (host.startsWith("m.")) {
      host = host.slice(2);
    }
    return host;
  } catch {
    const match = normalized.match(/^(?:https?:\/\/)?([^/:]+)/i);
    if (match && match[1]) {
      return match[1].toLowerCase().replace(/^(www\.|m\.)/, "");
    }
    return "";
  }
}

/**
 * Finds a matching icon definition for a given URL by comparing normalized domain and subdomains.
 */
export function getQuickLinkIcon(rawUrl: string): QuickLinkIconDefinition | null {
  const hostname = extractHostname(rawUrl);
  if (!hostname) return null;

  for (const item of QUICK_LINK_ICONS) {
    for (const domain of item.domains) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return item;
      }
    }
  }
  return null;
}

export interface QuickLinkAvatarResolution {
  type: "icon" | "initials";
  iconName?: string;
  renderIcon?: (props: IconProps) => React.ReactNode;
  initials?: string;
}

/**
 * Resolves the visual avatar for a quick link:
 * 1. Registered domain match -> Icon
 * 2. Fallback -> Initials
 */
export function resolveQuickLinkAvatar(
  label: string,
  url: string,
): QuickLinkAvatarResolution {
  const matched = getQuickLinkIcon(url);
  if (matched) {
    return {
      type: "icon",
      iconName: matched.name,
      renderIcon: matched.render,
    };
  }

  return {
    type: "initials",
    initials: getInitials(label),
  };
}
