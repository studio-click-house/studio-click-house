<script lang="ts">
  import { ArrowLeft, ArrowUpRight } from "lucide-svelte";
  import { resolve } from "$app/paths";
  import PageMeta from "$lib/components/seo/PageMeta.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { _ } from "svelte-i18n";

  let email = $state("");
  let password = $state("");
  let errorMsg = $state("");
  let successMsg = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!email || !password) {
      errorMsg = $_("login.errorFill") || "Please fill in all fields.";
      successMsg = "";
      return;
    }
    // Mock login logic
    errorMsg = "";
    successMsg = $_("login.success") || "Successfully authenticated. Redirecting to workspace...";
    setTimeout(() => {
      window.location.href = resolve("/");
    }, 1500);
  }
</script>

<PageMeta
  title="Client Portal Sign In | Studio Click House"
  description="Sign in to the Studio Click House client workspace portal to access your active visual projects, feedback boards, and finalized assets."
  canonicalPath="/login"
  noindex
/>

<main
  id="main-content"
  class="min-h-[100dvh] bg-brand-paper pt-32 pb-24 flex items-center"
>
  <div class="site-shell w-full max-w-md">
    <div
      class="border border-brand-dark/10 bg-brand-light p-8 md:p-10 shadow-sm relative"
    >
      <div
        class="absolute -top-3 left-6 bg-brand-green px-2.5 py-1 font-sans text-sm text-brand-dark font-bold"
      >
        {$_('login.badge') || 'Secure Access'}
      </div>

      <div class="text-center md:text-left">
        <h1 class="font-sans text-3xl tracking-[-0.045em] text-brand-dark font-bold">
          {$_('login.title') || 'Studio Workspace'}
        </h1>
        <p
          class="mt-2 font-sans text-sm text-brand-dark/40"
        >
          {$_('login.subtitle') || 'Enter credentials to view assets'}
        </p>
      </div>

      <form onsubmit={handleSubmit} class="mt-8 space-y-6">
        {#if errorMsg}
          <div
            class="bg-brand-coral/10 border border-brand-coral/20 p-3 text-sm text-brand-coral font-sans"
          >
            {errorMsg}
          </div>
        {/if}

        {#if successMsg}
          <div
            class="bg-brand-green/10 border border-brand-green/20 p-3 text-sm text-brand-green font-sans"
          >
            {successMsg}
          </div>
        {/if}

        <div class="space-y-2">
          <Label
            for="email"
            class="!block font-sans text-sm font-medium text-brand-dark/60"
          >
            {$_('login.emailLabel') || 'Email address'}
          </Label>
          <Input
            id="email"
            type="email"
            bind:value={email}
            autocomplete="email"
            required
            placeholder="name@company.com"
            class="h-auto w-full rounded-[var(--radius-control)] border-brand-dark/15 bg-brand-paper px-4 py-3 text-base sm:text-sm font-sans placeholder:text-brand-dark/30 focus-visible:border-brand-green focus-visible:ring-0"
          />
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <Label
              for="password"
              class="!block font-sans text-sm font-medium text-brand-dark/60"
            >
              {$_('login.passwordLabel') || 'Password'}
            </Label>
            <a
              href="#reset"
              class="font-sans text-sm text-brand-dark/45 hover:text-brand-green font-semibold"
            >
              {$_('login.forgot') || 'Forgot?'}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            bind:value={password}
            autocomplete="current-password"
            required
            placeholder="••••••••••••"
            class="h-auto w-full rounded-[var(--radius-control)] border-brand-dark/15 bg-brand-paper px-4 py-3 text-base sm:text-sm font-sans placeholder:text-brand-dark/30 focus-visible:border-brand-green focus-visible:ring-0"
          />
        </div>

        <Button
          type="submit"
          class="h-auto w-full rounded-[var(--radius-control)] bg-brand-dark py-4 text-center font-sans text-sm text-brand-light hover:bg-brand-green hover:text-brand-dark font-semibold"
        >
          {$_('login.signInButton') || 'Sign In to Hub'} <ArrowUpRight size={14} />
        </Button>
      </form>

      <div
        class="mt-8 flex flex-col gap-3 border-t border-brand-dark/10 pt-6 font-sans text-sm text-brand-dark/45 sm:flex-row sm:items-center sm:justify-between"
      >
        <a
          href={resolve("/")}
          class="flex items-center gap-1 hover:text-brand-green"
        >
          <ArrowLeft size={10} /> {$_('login.backHome') || 'Back home'}
        </a>
        <span>SCHL · Workspace v0.1</span>
      </div>
    </div>
  </div>
</main>
