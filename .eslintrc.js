module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
};
