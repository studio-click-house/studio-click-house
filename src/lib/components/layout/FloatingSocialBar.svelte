<script lang="ts">
  import { onMount } from "svelte";
  import {
    Play,
    Instagram,
    Linkedin,
    Facebook,
    Youtube,
    MessageCircle,
    Mail,
    Phone,
  } from "lucide-svelte";
  import { siteConfig } from "$lib/config/site";
  import { _ } from "svelte-i18n";

  const AUDIO_SRC = "/audio/Audio-Presentation.mp3";

  let isPlaying = $state(false);
  let hasUserInteracted = $state(false);
  let audioElement: HTMLAudioElement | null = null;

  function toggleAudio(e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
    }
    if (!audioElement) return;

    hasUserInteracted = true;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }

  onMount(() => {
    audioElement = new Audio(AUDIO_SRC);
    audioElement.preload = "auto";

    audioElement.onplay = () => {
      isPlaying = true;
    };

    audioElement.onpause = () => {
      isPlaying = false;
    };

    audioElement.onended = () => {
      isPlaying = false;
      if (audioElement) {
        audioElement.currentTime = 0;
      }
    };

    const tryAutoplay = () => {
      if (!hasUserInteracted && audioElement && audioElement.paused) {
        audioElement.play().catch(() => {
          // Browser requires user interaction before autoplay
        });
      }
    };

    window.addEventListener("site-preloader-complete", tryAutoplay, { once: true });
    window.addEventListener("site-preloader-logo-landed", tryAutoplay, { once: true });

    const handleFirstGesture = () => {
      tryAutoplay();
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true, passive: true });

    return () => {
      cleanupListeners();
      window.removeEventListener("site-preloader-complete", tryAutoplay);
      window.removeEventListener("site-preloader-logo-landed", tryAutoplay);
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
        audioElement = null;
      }
    };
  });

  const socialItems = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: siteConfig.links.whatsapp || "https://wa.me/8809609777111",
      icon: MessageCircle,
      hoverClass: "hover:bg-[#25D366] hover:text-black hover:shadow-[0_0_12px_rgba(37,211,102,0.4)]",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: siteConfig.links.instagram || "https://instagram.com/studioclickhouse",
      icon: Instagram,
      hoverClass: "hover:bg-[#E4405F] hover:text-white hover:shadow-[0_0_12px_rgba(228,64,95,0.4)]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: siteConfig.links.linkedin || "https://linkedin.com/company/studioclickhouse",
      icon: Linkedin,
      hoverClass: "hover:bg-[#0A66C2] hover:text-white hover:shadow-[0_0_12px_rgba(10,102,194,0.4)]",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: siteConfig.links.facebook || "https://facebook.com/studioclickhouse",
      icon: Facebook,
      hoverClass: "hover:bg-[#1877F2] hover:text-white hover:shadow-[0_0_12px_rgba(24,119,242,0.4)]",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: siteConfig.links.youtube || "https://youtube.com/@studioclickhouse",
      icon: Youtube,
      hoverClass: "hover:bg-[#FF0000] hover:text-white hover:shadow-[0_0_12px_rgba(255,0,0,0.4)]",
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:${siteConfig.contact.email}`,
      icon: Mail,
      hoverClass: "hover:bg-brand-green hover:text-brand-dark hover:shadow-[0_0_12px_rgba(126,166,65,0.4)]",
    },
    {
      id: "phone",
      label: "Call",
      href: `tel:${siteConfig.contact.phoneHref}`,
      icon: Phone,
      hoverClass: "hover:bg-brand-green hover:text-brand-dark hover:shadow-[0_0_12px_rgba(126,166,65,0.4)]",
    },
  ];
</script>

<aside
  id="floating-social-sidebar"
  aria-label="Social links and Studio Audio Brief"
  class="fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none flex flex-col items-end gap-2.5"
>
  <!-- Main Social Links Island -->
  <div
    class="flex flex-col items-center gap-1.5 rounded-l-2xl rounded-r-none border-y border-l border-r-0 border-white/15 bg-[#181615]/95 pl-2 pr-1.5 py-2.5 backdrop-blur-xl shadow-2xl transition-all duration-300 ring-1 ring-white/5"
  >
    {#each socialItems as item (item.id)}
      <div class="relative group flex items-center">
        <a
          href={item.href}
          target={item.href.startsWith("http") ? "_blank" : undefined}
          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          class="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/80 transition-all duration-200 hover:scale-110 active:scale-95 {item.hoverClass}"
        >
          <item.icon size={15} strokeWidth={1.8} />
        </a>

        <!-- Minimal Tooltip -->
        <span
          role="tooltip"
          class="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-md border border-white/15 bg-[#181615] px-2.5 py-1 font-mono text-[0.65rem] text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-hover:-translate-x-0.5"
        >
          {item.label}
        </span>
      </div>
    {/each}
  </div>

  <!-- Separate Audio Brief Island (placed close below with a little gap) -->
  <div
    class="flex items-center rounded-l-2xl rounded-r-none border-y border-l border-r-0 border-white/15 bg-[#181615]/95 pl-2 pr-1.5 py-2 backdrop-blur-xl shadow-2xl transition-all duration-300 ring-1 ring-white/5"
  >
    <div class="relative group flex items-center">
      <button
        type="button"
        onclick={toggleAudio}
        aria-label={isPlaying ? "Pause Studio Audio Brief" : "Play Studio Audio Brief"}
        class="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 {isPlaying
          ? 'bg-brand-green text-brand-dark shadow-[0_0_12px_rgba(126,166,65,0.6)]'
          : 'bg-white/[0.06] text-white/80 hover:bg-brand-green hover:text-brand-dark hover:shadow-[0_0_12px_rgba(126,166,65,0.4)]'}"
      >
        {#if isPlaying}
          <!-- 3 animated equalizer running lines -->
          <div class="flex items-center justify-center gap-[2.5px] h-3.5" aria-hidden="true">
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-1"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-2"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-3"></span>
          </div>
        {:else}
          <!-- Triangle play button -->
          <Play size={13} class="fill-current translate-x-[1px]" aria-hidden="true" />
        {/if}
      </button>

      <!-- Minimal Tooltip -->
      <span
        role="tooltip"
        class="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-md border border-white/15 bg-[#181615] px-2.5 py-1 font-mono text-[0.65rem] text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-hover:-translate-x-0.5"
      >
        {isPlaying ? ($_('social.pauseBrief') || 'Pause Brief') : ($_('social.playBrief') || 'Play Brief')}
      </span>
    </div>
  </div>
</aside>

<style>
  @keyframes barBounce1 {
    0%,
    100% {
      height: 30%;
    }
    50% {
      height: 100%;
    }
  }

  @keyframes barBounce2 {
    0%,
    100% {
      height: 90%;
    }
    50% {
      height: 25%;
    }
  }

  @keyframes barBounce3 {
    0%,
    100% {
      height: 45%;
    }
    50% {
      height: 95%;
    }
  }

  .animate-bar-1 {
    animation: barBounce1 600ms ease-in-out infinite;
  }
  .animate-bar-2 {
    animation: barBounce2 520ms ease-in-out infinite 80ms;
  }
  .animate-bar-3 {
    animation: barBounce3 680ms ease-in-out infinite 160ms;
  }
</style>
