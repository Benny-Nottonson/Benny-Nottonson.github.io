import { Slot, component$ } from "@builder.io/qwik";
import Card from "../../components/card/card";

interface SocialCardProps {
  href: string;
  label: string;
  handle: string;
}

export default component$(({ href, label, handle }: SocialCardProps) => {
  return (
    <Card key={href}>
      <a
        href={href}
        target="_blank"
        class="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-48  md:p-16"
      >
        <span
          class="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
          aria-hidden="true"
        />
        <span class="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
          <Slot />
        </span>{" "}
        <div class="z-10 flex flex-col items-center">
          <span class="text-center text-xl font-medium duration-150 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
            {handle}
          </span>
          <span class="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
            {label}
          </span>
        </div>
      </a>
    </Card>
  );
});
