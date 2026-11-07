/** @type {import("prettier").Config} */
const config = {
	semi: false,
	useTabs: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 100,
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
				singleAttributePerLine: false,
				htmlWhitespaceSensitivity: "ignore",
			},
		},
		{
			files: "*.html",
			options: {
				parser: "html",
				printWidth: 999,
			},
		},
		{
			files: "*.mdc",
			options: {
				parser: "markdown",
			},
		},
	],
	tailwindStylesheet: "./src/routes/layout.css",
}

export default config
