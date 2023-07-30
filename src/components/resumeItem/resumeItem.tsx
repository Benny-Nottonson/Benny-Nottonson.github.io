import { component$ } from "@builder.io/qwik";

type resumeProp =
  | {
      type: "work";
      role: string;
      location: string;
      link: string;
      start: string;
      end: string;
    }
  | {
      type: "experience";
      title: string;
      description: string;
    };

export default component$((props: resumeProp) => {
  return (
    <li class="mt-4 text-zinc-400">
      <p>
        {props.type === "work" ? (
          <>
            <span class="font-bold">{props.role}</span> at{" "}
            <a
              target="_blank"
              href={props.link}
              class="underline duration-500 hover:text-zinc-300"
              aria-name="CSULB"
            >
              {props.location}
            </a>{" "}
            from
            <span class="font-bold">
              {" "}
              {props.start} - {props.end}
            </span>
          </>
        ) : (
          <>
            <span class="font-bold">{props.title} - </span>
            <span>{props.description}</span>
          </>
        )}
      </p>
    </li>
  );
});
