import {
	PropsWithChildren,
	ReactNode,
	ComponentType,
	FunctionComponent,
} from "react";

type MDXComponentProps = PropsWithChildren<ReactNode>;

type MDXComponent = ComponentType<MDXComponentProps>;

type MDXComponents = Record<string, MDXComponent>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
	const baseComponents: MDXComponents = {
		h1: ({ children }: MDXComponentProps) => (
			<h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-100 md:text-center sm:text-4xl">
				{children}
			</h1>
		),
		h2: ({ children }: MDXComponentProps) => (
			<h2 className="text-zinc-50">{children}</h2>
		),
	};

	return { ...baseComponents, ...components };
}
