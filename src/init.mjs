import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const allProjects = readdirSync(join(process.cwd(), "src/content/projects"))
  .map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fileContents = readFileSync(
      join(process.cwd(), "src/content/projects", fileName),
      "utf8",
    );
    const { data } = matter(fileContents);
    const date = data.date ? data.date : null;
    const published = data.published ?? false;
    const title = data.title ?? "";
    const description = data.description ?? "";
    const url = data.url ?? "";
    const repository = data.repository ?? "";
    const content = fileContents.split("---").slice(2).join("---");
    return {
      slug,
      published,
      date,
      title,
      description,
      url,
      repository,
      content,
      ...data,
    };
  });

writeFileSync(
  join(process.cwd(), "src/projects.ts"),
  `export const allProjects = ${JSON.stringify(allProjects)}`,
);
