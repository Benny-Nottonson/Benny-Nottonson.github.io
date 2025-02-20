import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/Heading";
import ProjectCards from "@/components/ProjectsCard";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

const projectsPage = () => {
  const Projects = [
    {
      title: "Basalt",
      description: `A Machine Learning framework from scratch in Pure Mojo 🔥`,
      tags: ["Mojo", "Pytorch", "Machine Learning"],
      link: "https://github.com/basalt-org/basalt",
    },

    {
      title: "Mojo Marathons",
      description:
        "A community centered around Mojo programming language. We host weekly coding marathons, workshops, and discussions.",
      tags: ["Mojo", "Community"],
      link: "https://github.com/Benny-Nottonson/Mojo-Marathons",
    },
    {
      title: "Losal Dance",
      description:
        "Losal Dance is a dance school website made with Nextjs and Tailwindcss. It was made with love for my high school dance program.",
      tags: ["Nextjs", "Typescript", "Shadcn Ui"],
      link: "https://www.losaldance.net/",
    },
    {
      title: "Spotify Sort",
      description:
        "A simple python app that sorts your Spotify playlists based on color based image sorting. It uses the Spotify API and Pillow library to calculate the CCV (Color Coherence Vector) of each image.",
      tags: ["Python", "Machine Learning"],
      link: "https://github.com/Benny-Nottonson/spotifySort",
    },
    {
      title: "Tensorflow Image Morpher",
      description:
        "This is a free tool to check create morphing videos from two or moreimages. It uses the Tensorflow library to create the morphing effect.",
      tags: ["Python", "Tensorflow", "Machine Learning"],
      link: "https://github.com/Benny-Nottonson/tensorflowImageMorpher",
    },
    {
      title: "AppLab Whitelist Proxy",
      description:
        "A JavaScript based proxy server that allows you to fetch from AppLab API without CORS or blacklisting.",
      tags: ["Javascript"],
      link: "https://github.com/Benny-Nottonson/appLabWhitelistProxy",
    },
  ];

  return (
    <div className="h-full w-full relative flex flex-col items-start gap-5 overflow-hidden">
      <Badge variant="secondary" className="gap-1.5 py-1 ">
        <Layers className="h-4 w-4" />
        Projects
      </Badge>
      <div className="flex flex-col gap-3">
        <Heading>My Projects</Heading>
        <FramerWrapper y={0} x={200}>
          <p className=" font-poppins text-lg w-full text-primary max-sm:text-base">
            I love to Build Cool Projects. Here, you&#x27;ll find a curated
            collection of my creative endeavors and technical projects. Each
            piece represents a journey of innovation, problem-solving, and
            continuous learning. Feel free to explore this showcase of my
            passion and expertise in action.
          </p>
        </FramerWrapper>
      </div>

      <div className=" w-full flex flex-row flex-wrap gap-3 max-lg:flex-col">
        {Projects.map((val, indx) => {
          return <ProjectCards key={indx} value={val} num={indx} />;
        })}
      </div>
    </div>
  );
};

export default projectsPage;
