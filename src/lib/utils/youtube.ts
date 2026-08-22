export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface YouTubePlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
  };
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
  }
}

const API_SCRIPT_ID = "youtube-iframe-api";

export function loadYouTubeApi(): Promise<YouTubeNamespace> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;

    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    if (!document.getElementById(API_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = API_SCRIPT_ID;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    let attempts = 0;
    const poll = window.setInterval(() => {
      attempts += 1;
      if (window.YT?.Player) {
        window.clearInterval(poll);
        resolve(window.YT);
      } else if (attempts > 150) {
        window.clearInterval(poll);
      }
    }, 100);
  });
}
