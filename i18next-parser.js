module.exports = {
  locales: ["en", "fr", "nl"],
  output: "public/locales/$LOCALE/common.json",
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  keySeparator: ".",
  namespaceSeparator: ":",
};
