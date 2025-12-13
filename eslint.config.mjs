import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import tsPlugin from "eslint-config-next/typescript";

const eslintConfig = [
  nextPlugin.configs["core-web-vitals"],
  ...tsPlugin,
  prettierConfig,
];

export default eslintConfig;
