// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // JS rules
      "no-console": "off",
      "indent": [
        "error",
        4
      ],
      "arrow-parens": "warn",
      "semi": "warn",
      "no-multiple-empty-lines": [
        "error",
        {
          "max": 1,
        }
      ],
      "quotes": [
        "error",
        "single",
        { "avoidEscape": true }
      ],
      // TS rules
      "@typescript-eslint/no-unused-vars": "warn",
      // Angular rules
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
    ],
    rules: {},
  }
);
