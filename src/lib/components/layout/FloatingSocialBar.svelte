<script lang="ts">
  import { onMount } from "svelte";
  import {
    Instagram,
    Linkedin,
    Facebook,
    Youtube,
    MessageCircle,
    Mail,
    Phone,
  } from "lucide-svelte";
  import { siteConfig } from "$lib/config/site";

  const STUDIO_BRIEF_SCRIPT =
    "Welcome to Studio Click House. We are a global creative post-production studio delivering high-end commercial retouching, e-commerce image workflows, CGI, and cinematic video editing. We partner with leading brands, agencies, and photographers worldwide with guaranteed 15-minute response times and precision turnarounds. Explore our portfolio or start your free trial today.";

  let isPlaying = $state(false);
  let isPaused = $state(false);
  let hasUserStopped = $state(false);
  let speechUtterance: SpeechSynthesisUtterance | null = null;

  function getBestVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const preferred = [
      "Google US English",
      "Google UK English Female",
      "Samantha",
      "Daniel",
      "Karen",
      "Microsoft Jenny",
      "Microsoft Ryan",
    ];

    for (const name of preferred) {
      const match = voices.find((v) => v.name.includes(name));
      if (match) return match;
    }

    const en = voices.find((v) => v.lang.startsWith("en"));
    return en || voices[0] || null;
  }

  function startPlayback() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch {}

    speechUtterance = new SpeechSynthesisUtterance(STUDIO_BRIEF_SCRIPT);
    speechUtterance.rate = 0.95;
    speechUtterance.pitch = 1.0;

    const voice = getBestVoice();
    if (voice) {
      speechUtterance.voice = voice;
    }

    speechUtterance.onstart = () => {
      isPlaying = true;
      isPaused = false;
    };

    speechUtterance.onend = () => {
      isPlaying = false;
      isPaused = false;
    };

    speechUtterance.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") {
        isPlaying = false;
        isPaused = false;
      }
    };

    try {
      window.speechSynthesis.speak(speechUtterance);
      // In some browsers, isPlaying isn't set until onstart fires. Set optimistic state:
      isPlaying = true;
      isPaused = false;
    } catch {
      // Browser autoplay policy might hold until gesture
    }
  }

  function toggleAudio() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      isPlaying = false;
      isPaused = true;
      hasUserStopped = true;
    } else if (isPaused) {
      hasUserStopped = false;
      startPlayback();
    } else {
      hasUserStopped = false;
      startPlayback();
    }
  }

  onMount(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const tryStart = () => {
      if (!hasUserStopped && !isPlaying) {
        startPlayback();
      }
    };

    // Load voices and try start immediately
    if (window.speechSynthesis.getVoices().length > 0) {
      tryStart();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        tryStart();
      };
    }

    // Try again on preloader completion events
    window.addEventListener("site-preloader-complete", tryStart, { once: true });
    window.addEventListener("site-preloader-logo-landed", tryStart, { once: true });

    // Ensure audio starts on first user action (movement, scroll, click, key)
    const handleGesture = () => {
      if (!hasUserStopped && !isPlaying) {
        tryStart();
      }
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointermove", handleGesture);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("scroll", handleGesture);
      window.removeEventListener("wheel", handleGesture);
    };

    window.addEventListener("pointermove", handleGesture, { once: true, passive: true });
    window.addEventListener("pointerdown", handleGesture, { once: true, passive: true });
    window.addEventListener("click", handleGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleGesture, { once: true, passive: true });
    window.addEventListener("touchstart", handleGesture, { once: true, passive: true });
    window.addEventListener("scroll", handleGesture, { once: true, passive: true });
    window.addEventListener("wheel", handleGesture, { once: true, passive: true });

    return () => {
      cleanupListeners();
      window.removeEventListener("site-preloader-complete", tryStart);
      window.removeEventListener("site-preloader-logo-landed", tryStart);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
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
          : 'bg-white text-black shadow-[0_0_8px_rgba(255,255,255,0.35)] hover:bg-brand-green hover:text-brand-dark'}"
      >
        {#if isPlaying}
          <!-- 3 animated equalizer running lines -->
          <div class="flex items-center justify-center gap-[2.5px] h-3.5" aria-hidden="true">
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-1"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-2"></span>
            <span class="w-[2px] h-full bg-current rounded-full animate-bar-3"></span>
          </div>
        {:else}
          <!-- 2 black pause vertical bar lines inside full white circle -->
          <div class="flex items-center justify-center gap-[3px] h-3" aria-hidden="true">
            <span class="w-[2.5px] h-3 bg-black rounded-full"></span>
            <span class="w-[2.5px] h-3 bg-black rounded-full"></span>
          </div>
        {/if}
      </button>

      <!-- Minimal Tooltip -->
      <span
        role="tooltip"
        class="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-md border border-white/15 bg-[#181615] px-2.5 py-1 font-mono text-[0.65rem] text-white opacity-0 shadow-xl backdrop-blur-md transition-all duration-150 group-hover:opacity-100 group-hover:-translate-x-0.5"
      >
        {isPlaying ? "Pause Brief" : "Play Brief"}
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
