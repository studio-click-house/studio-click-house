<script lang="ts" module>
  import { cn, type WithElementRef } from "$lib/utils";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";
  import { type VariantProps, tv } from "tailwind-variants";

  export const buttonVariants = tv({
    base: "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] border border-transparent text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:shrink-0",
    variants: {
      variant: {
        primary: "bg-brand-green text-brand-dark hover:bg-brand-dark hover:text-brand-light",
        secondary: "border-brand-dark/25 bg-transparent text-brand-dark hover:border-brand-green hover:text-brand-green-ink",
        ghost: "text-brand-dark hover:text-brand-green-ink",
      },
      size: {
        sm: "min-h-9 gap-1.5 px-3 text-xs [&_svg]:size-3.5",
        md: "min-h-11 gap-2 px-5 [&_svg]:size-4",
        lg: "min-h-12 gap-3 px-6 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
    };
</script>

<script lang="ts">
  let {
    class: className,
    variant = "primary",
    size = "md",
    ref = $bindable(null),
    href = undefined,
    type = "button",
    disabled,
    children,
    ...restProps
  }: ButtonProps = $props();
</script>

{#if href}
  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? "link" : undefined}
    tabindex={disabled ? -1 : undefined}
    {...restProps}
  >
    {@render children?.()}
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
