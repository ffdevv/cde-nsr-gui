import scrollOnLoad from "./scrollOnLoad.js";

// DEMO
// will use localStorage to persist the configuration
// object used to init the scrollOnLoad
const setConfig = (c) => localStorage.setItem("vsi-config", c);
const _config = JSON.parse(localStorage.getItem("vsi-config") || "{}");
const _mode = localStorage.getItem("vsi-mode") || "";

const initConfigBtn = (id, config) => {
  setConfig(JSON.stringify(config));
  localStorage.setItem("vsi-mode", id);
};

const vsiCss = `
html {
  scroll-behavior: instant;
}
`;
initConfigBtn("browser-inject", {
  scrollRestoration: "auto",
  injectCss: vsiCss,
  removeInjectedCssTimeout: 0
});

scrollOnLoad(_config);
