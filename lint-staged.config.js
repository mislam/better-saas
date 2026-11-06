/** @type {import("lint-staged").Configuration} */
export default {
	"**/*.{js,cjs,mjs,ts,cts,mts,svelte}": ["eslint --fix --max-warnings=0", "prettier --write"],
	"**/*.{css,md,json,yml,yaml,html}": "prettier --write",
}
