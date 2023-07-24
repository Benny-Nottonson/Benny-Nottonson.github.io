import { component$ } from "@builder.io/qwik";

interface ResumeWorkProps {
  type: "work";
  role: string;
  location: string;
  link: string;
  start: string;
  end: string;
  title?: never;
  description?: never;
}

interface ResumeExperienceProps {
  type: "experience";
  role?: never;
  location?: never;
  link?: never;
  start?: never;
  end?: never;
  title: string;
  description: string;
}

type ResumeItemProps = ResumeWorkProps | ResumeExperienceProps;

export default component$(
  ({
    type,
    role,
    location,
    link,
    start,
    end,
    title,
    description,
  }: ResumeItemProps) => {
    if (type === "work") {
      return (
        <li class="mt-4 text-zinc-400">
          <p>
            <span class="font-bold">{role}</span> at{" "}
            <a
              target="_blank"
              href={link}
              class="underline duration-500 hover:text-zinc-300"
              aria-name="CSULB"
            >
              {location}
            </a>{" "}
            from
            <span class="font-bold">
              {" "}
              {start} - {end}
            </span>
          </p>
        </li>
      );
    } else {
      return (
        <li class="mt-4 text-zinc-400">
          <p>
            <span class="font-bold">{title} - </span>
            <span>{description}</span>
          </p>
        </li>
      );
    }
  },
);
