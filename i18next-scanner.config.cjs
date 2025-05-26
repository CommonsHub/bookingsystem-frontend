module.exports = {
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  output: "./",
  options: {
    lngs: ["en", "fr", "nl"],
    resource: {
      loadPath: "public/locales/{{lng}}/common.json",
      savePath: "public/locales/{{lng}}/common.json",
    },
    keySeparator: ".",
    nsSeparator: ":",
  },
};
