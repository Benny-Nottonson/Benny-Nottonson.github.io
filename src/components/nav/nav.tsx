import { useVisibleTask$, useSignal, component$ } from "@builder.io/qwik";
import SocialIcon from "../socialIcon/socialIcon";

const NavLink = ({ name }: { name: string }) => (
  <a
    href={`/${name.toLowerCase()}`}
    class="duration-200 text-zinc-400 hover:text-zinc-100"
  >
    {name}
  </a>
);

export default component$(() => {
  const ref = useSignal<HTMLElement>();
  const isIntersecting = useSignal<boolean>(true);

  useVisibleTask$(() => {
    if (!ref.value) return;
    const observer = new IntersectionObserver(
      ([entry]) => (isIntersecting.value = entry.isIntersecting),
    );

    observer.observe(ref.value);
    return () => observer.disconnect();
  });

  return (
    <header ref={ref}>
      <div
        class={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b ${
          isIntersecting.value
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800"
        }`}
      >
        <div class="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div class="flex justify-between gap-8">
            <NavLink name="Projects" />
            <NavLink name="Contact" />
            <NavLink name="Resume" />
          </div>

          <a
            href="/"
            class="duration-200 text-zinc-300 hover:text-zinc-100"
            aria-label="return"
          >
            <div class="w-6 h-6 ">
              <SocialIcon>
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </SocialIcon>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
});
