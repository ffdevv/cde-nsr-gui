/*
  Using the sessionStorage make the page automatically scroll to the last position after refreshing
  You can make the scroll position persistent through sessions using the localStorage
  
  usage:
  
  scrollOnLoad();
  scrollOnLoad({getKey: () => window.location.pathname, storage: localStorage});
*/
const ENABLE = true;
const STORAGE = sessionStorage; // localStorage if you want more persistence
const GET_KEY = () => {
  const path = window.location.pathname;
  const search = window.location.search || "";
  return `${path}${search}`;
};
const GET_Y_OFFSET = () => window.pageYOffset;
const BEHAVIOR = "instant"; // "instant" "smooth" "auto"
const SCROLL_RESTORATION = "manual"; // "auto" "manual"
const REMOVE_INJECTED_CSS_TIMEOUT = 100;

const scrollOnLoad = ({
  storage,
  getKey,
  key,
  getYOffset,
  y,
  behavior,
  scrollRestoration,
  injectCss,
  removeInjectedCssTimeout // pass 0 to not remove injectedCss
}) => {
  scrollRestoration ??= SCROLL_RESTORATION;
  behavior ??= BEHAVIOR;
  storage ??= STORAGE;
  getKey ??= GET_KEY;
  getYOffset ??= GET_Y_OFFSET;
  removeInjectedCssTimeout ??= REMOVE_INJECTED_CSS_TIMEOUT;
  key ??= getKey();

  const enable = scrollRestoration === "manual";

  if (injectCss) {
    const head = document.getElementsByTagName("head")[0];
    const style = document.createElement("style");
    style.innerHTML = injectCss;
    head.appendChild(style);
    if (!!removeInjectedCssTimeout) {
      setTimeout(() => {
        style.remove();
      }, removeInjectedCssTimeout);
    }
  }

  if (!enable) {
    // enable browser default
    storage.removeItem(key);
    window.history.scrollRestoration = "auto";
    return;
  }

  // set the scroll height in storage
  storage.setItem(key, y ?? storage.getItem(key) ?? getYOffset());
  window.addEventListener(
    "scroll",
    () => storage.setItem(key, y ?? getYOffset()),
    { passive: true }
  );

  // disable auto scroll
  window.history.scrollRestoration = scrollRestoration;

  // custom scroll
  document.onreadystatechange = () => {
    if (document.readyState !== "complete") return;
    window.scroll({
      top: storage.getItem(key) ?? 0,
      behavior: behavior
    });
  };
};

export default scrollOnLoad;
