import nextVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "*.config.mjs",
      "*.config.ts",
    ],
  },
  ...nextVitals,
];
