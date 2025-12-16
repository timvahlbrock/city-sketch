import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import tsPlugin from "eslint-config-next/typescript";
import convexPlugin from "@convex-dev/eslint-plugin";

const eslintConfig = [
  nextPlugin.configs["core-web-vitals"],
  ...tsPlugin,
  ...convexPlugin.configs.recommended,
  prettierConfig,
];

export default eslintConfig;
