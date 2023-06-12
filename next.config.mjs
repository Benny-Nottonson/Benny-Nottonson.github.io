import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	headers: async () => {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value:
							"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';",
					},
				],
			},
		];
	},
};

export default withContentlayer(nextConfig);
