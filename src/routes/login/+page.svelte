<script lang="ts">
  import { ArrowLeft, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";

  let email = $state("");
  let password = $state("");
  let errorMsg = $state("");
  let successMsg = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!email || !password) {
      errorMsg = "Please fill in all fields.";
      successMsg = "";
      return;
    }
    // Mock login logic
    errorMsg = "";
    successMsg = "Successfully authenticated. Redirecting to workspace...";
    setTimeout(() => {
      window.location.href = resolve("/");
    }, 1500);
  }
</script>

<PageMeta
  title="Sign In | Studio Click House"
  description="Sign in to your Studio Click House client workspace to access your active projects and assets."
  canonicalPath="/login"
/>

<main
  id="login-page"
  class="min-h-[100dvh] bg-brand-paper pt-32 pb-24 flex items-center"
>
  <div class="site-shell w-full max-w-md">
    <div
      class="border border-brand-dark/10 bg-brand-light p-8 md:p-10 shadow-sm relative"
    >
      <div
        class="absolute -top-3 left-6 bg-brand-green px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-brand-dark font-bold"
      >
        Secure Access
      </div>

      <div class="text-center md:text-left">
        <h1 class="font-display text-3xl tracking-[-0.02em] text-brand-dark">
          Studio Workspace
        </h1>
        <p
          class="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/40"
        >
          Enter credentials to view assets
        </p>
      </div>

      <form onsubmit={handleSubmit} class="mt-8 space-y-6">
        {#if errorMsg}
          <div
            class="bg-brand-coral/10 border border-brand-coral/20 p-3 text-xs text-brand-coral font-mono"
          >
            {errorMsg}
          </div>
        {/if}

        {#if successMsg}
          <div
            class="bg-brand-green/10 border border-brand-green/20 p-3 text-xs text-brand-green font-mono"
          >
            {successMsg}
          </div>
        {/if}

        <div class="space-y-2">
          <label
            for="email"
            class="block font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/60"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            autocomplete="email"
            required
            placeholder="name@company.com"
            class="w-full border border-brand-dark/15 bg-brand-paper px-4 py-3 text-xs font-sans placeholder:text-brand-dark/30 focus:border-brand-green focus:outline-none transition-colors"
          />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label
              for="password"
              class="block font-mono text-[0.58rem] uppercase tracking-[0.14em] text-brand-dark/60"
            >
              Password
            </label>
            <a
              href="#reset"
              class="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-brand-dark/45 hover:text-brand-green"
            >
              Forgot?
            </a>
          </div>
          <input
            id="password"
            type="password"
            bind:value={password}
            autocomplete="current-password"
            required
            placeholder="••••••••••••"
            class="w-full border border-brand-dark/15 bg-brand-paper px-4 py-3 text-xs font-sans placeholder:text-brand-dark/30 focus:border-brand-green focus:outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-brand-dark py-4 text-center font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brand-light hover:bg-brand-green hover:text-brand-dark transition-colors flex items-center justify-center gap-2"
        >
          Sign In to Hub <ArrowUpRight size={14} />
        </button>
      </form>

      <div
        class="mt-8 border-t border-brand-dark/10 pt-6 flex justify-between items-center text-[0.58rem] font-mono uppercase tracking-[0.12em] text-brand-dark/45"
      >
        <a
          href={resolve("/")}
          class="flex items-center gap-1 hover:text-brand-green"
        >
          <ArrowLeft size={10} /> Back home
        </a>
        <span>SCH · Workspace v0.1</span>
      </div>
    </div>
  </div>
</main>
