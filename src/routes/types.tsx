import type { JSXNode, NoSerialize } from "@builder.io/qwik";

export interface Project {
  slug: string;
  published: boolean;
  date: string;
  title: string;
  description: string;
  url: string;
  repository?: string;
  content: NoSerialize<JSXNode>;
}
