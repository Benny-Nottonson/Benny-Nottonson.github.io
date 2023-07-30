import { component$ } from "@builder.io/qwik";

function markdownToHtml(markdown: string): string {
  markdown = markdown.replace(/`([^`]+)`/g, "<code>$1</code>");
  markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  markdown = markdown.replace(/---(.+?)---/s, "");
  markdown = markdown.replace(/\n/g, "<br>");
  markdown = markdown.replace(/^<br>|<br>$/g, "");
  return markdown;
}

export default component$((p: { code: string }) => {
  const project = markdownToHtml(p.code);
  return (
    <div
      class="prose prose-zinc prose-quoteless"
      dangerouslySetInnerHTML={project}
    ></div>
  );
});
