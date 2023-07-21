import { useVisibleTask$, useSignal, component$ } from "@builder.io/qwik";

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
        class={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
          isIntersecting.value
            ? "bg-zinc-900/0 border-transparent"
            : "bg-zinc-900/500  border-zinc-800 "
        }`}
      >
        <div class="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div class="flex justify-between gap-8">
            <a
              href="/projects"
              class="duration-200 text-zinc-400 hover:text-zinc-100"
            >
              Projects
            </a>
            <a
              href="/contact"
              class="duration-200 text-zinc-400 hover:text-zinc-100"
            >
              Contact
            </a>
          </div>

          <a href="/" class="duration-200 text-zinc-300 hover:text-zinc-100">
            <div class="w-6 h-6 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-arrow-left"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
});
