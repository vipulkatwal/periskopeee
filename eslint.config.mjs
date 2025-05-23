import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			// Disable all rules (add more as needed)
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"react-hooks/exhaustive-deps": "off",
			"react-hooks/rules-of-hooks": "off",
			"@typescript-eslint/no-explicit-any": "off",
			// Add more rules here if you want to disable others
		},
	},
];

export default eslintConfig;
