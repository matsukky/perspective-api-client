import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginSortKeys from "eslint-plugin-typescript-sort-keys";

export default tseslint.config(
	{
		ignores: [
			"**.js",
			"tsup.config.ts",
			"dist/**",
			"node_modules/**",
			"test.js",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		plugins: {
			"typescript-sort-keys": eslintPluginSortKeys,
		},
		rules: {
			"typescript-sort-keys/interface": "error",
			"typescript-sort-keys/string-enum": "error",
		},
	},
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			"default-param-last": "off",
			"@typescript-eslint/default-param-last": "error",
		},
	}
);
