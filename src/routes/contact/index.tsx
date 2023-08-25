import { component$ } from "@builder.io/qwik";
import Nav from "../../components/nav/nav";
import SocialCard from "../../components/socialCard/socialCard";
import SocialIcon from "../../components/socialIcon/socialIcon";
import type { DocumentHead } from "@builder.io/qwik-city";

const socials = [
  {
    icon: (
      <SocialIcon>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </SocialIcon>
    ),
    href: "https://instagram.com/bennynottonson",
    label: "Instagram",
    handle: "@bennynottonson",
  },
  {
    icon: (
      <SocialIcon>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </SocialIcon>
    ),
    href: "mailto:bennynottonson@gmail.com",
    label: "Email",
    handle:
      "bennynottonson\
				@gmail.com",
  },
  {
    icon: (
      <SocialIcon>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </SocialIcon>
    ),
    href: "https://github.com/benny-nottonson",
    label: "Github",
    handle: "Benny-Nottonson",
  },
];

export default component$(() => {
  return (
    <div class="w-full bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0 pb-8">
      <Nav />
      <div class="container flex items-center justify-center min-h-screen px-4 mx-auto">
        <div class="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
          {socials.map((s) => (
            <SocialCard
              href={s.href}
              label={s.label}
              handle={s.handle}
              key={s.href}
            >
              {s.icon}
            </SocialCard>
          ))}
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact",
  meta: [
    {
      name: "description",
      content: "This is the contact page",
    },
    {
      property: "og:title",
      content: "Contact",
    },
    {
      property: "og:description",
      content: "This is the contact page",
    },
  ],
};
