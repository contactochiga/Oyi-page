/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS test runner. */
// Unit DOM tests: no browser, network, product fixtures or production credentials.
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module");
const { JSDOM } = require("jsdom");
const ts = require("typescript"),
  React = require("react");
const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.IS_REACT_ACT_ENVIRONMENT = true;
let reduced = false,
  mediaListeners = [],
  hidden = false;
Object.defineProperty(document, "hidden", {
  get: () => hidden,
  configurable: true,
});
window.matchMedia = () => ({
  get matches() {
    return reduced;
  },
  addEventListener: (_, f) => mediaListeners.push(f),
  removeEventListener: (_, f) =>
    (mediaListeners = mediaListeners.filter((x) => x !== f)),
});
let now = 0,
  id = 0,
  timers = new Map();
const realTimeout = global.setTimeout,
  realClear = global.clearTimeout,
  realNow = Date.now;
global.setTimeout = (f, ms) => {
  timers.set(++id, { f, due: now + ms });
  return id;
};
global.clearTimeout = (id) => timers.delete(id);
Date.now = () => now;
const file = path.resolve("src/components/hardware/StoryCarousel.tsx");
const mod = new Module(file, module);
mod.filename = file;
mod.paths = module.paths;
const originalRequire = mod.require.bind(mod);
mod.require = (n) =>
  n === "next/link"
    ? {
        __esModule: true,
        default: ({ children, ...props }) =>
          React.createElement("a", props, children),
      }
    : originalRequire(n);
mod._compile(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText,
  file,
);
const Carousel = mod.exports.default,
  { createRoot } = require("react-dom/client"),
  { act } = React;
let checks = 0;
const check = (label, fn) => {
  fn();
  checks++;
  console.log("PASS " + label);
};
const root = createRoot(document.getElementById("root"));
const slides = [
  {
    key: "a",
    eyebrow: "Test",
    title: "A",
    description: "Test",
    ctaLabel: "Browse",
    ctaHref: "#browse",
    durationMs: 8000,
  },
  {
    key: "b",
    eyebrow: "Test",
    title: "B",
    description: "Test",
    ctaLabel: "Browse",
    ctaHref: "#browse",
    durationMs: 3000,
  },
];
const render = () =>
  act(() =>
    root.render(
      React.createElement(Carousel, { slides, ariaLabel: "Test stories" }),
    ),
  );
const heading = () => document.querySelector("h1").textContent;
const click = (label) =>
  act(() =>
    document
      .querySelector(`[aria-label="${label}"]`)
      .dispatchEvent(new window.MouseEvent("click", { bubbles: true })),
  );
const tick = (ms) => {
  const end = now + ms;
  while (true) {
    const next = [...timers]
      .filter(([, v]) => v.due <= end)
      .sort((a, b) => a[1].due - b[1].due)[0];
    if (!next) break;
    now = next[1].due;
    timers.delete(next[0]);
    act(() => next[1].f());
  }
  now = end;
};
try {
  render();
  check("one accessible heading", () =>
    assert.equal(document.querySelectorAll("h1").length, 1),
  );
  tick(2500);
  click("Pause autoplay");
  tick(20000);
  check("pause retains current slide", () => assert.equal(heading(), "A"));
  click("Play autoplay");
  tick(5499);
  check("resume preserves remaining duration", () =>
    assert.equal(heading(), "A"),
  );
  tick(1);
  check("automatic progression after remaining duration", () =>
    assert.equal(heading(), "B"),
  );
  tick(3000);
  check("per-slide duration loops correctly", () =>
    assert.equal(heading(), "A"),
  );
  click("Next story");
  check("next control advances", () => assert.equal(heading(), "B"));
  click("Previous story");
  check("previous control returns", () => assert.equal(heading(), "A"));
  const touch = (type, x, y) =>
    act(() => {
      const e = new window.Event(type, { bubbles: true });
      Object.defineProperty(
        e,
        type === "touchstart" ? "touches" : "changedTouches",
        { value: [{ clientX: x, clientY: y }] },
      );
      document.querySelector("section").dispatchEvent(e);
    });
  touch("touchstart", 250, 100);
  touch("touchend", 100, 110);
  check("horizontal swipe advances", () => assert.equal(heading(), "B"));
  touch("touchstart", 100, 100);
  touch("touchend", 180, 300);
  check("vertical scroll does not navigate", () =>
    assert.equal(heading(), "B"),
  );
  act(() => {
    hidden = true;
    document.dispatchEvent(new window.Event("visibilitychange"));
  });
  tick(10000);
  check("hidden document pauses", () => assert.equal(heading(), "B"));
  act(() => {
    hidden = false;
    document.dispatchEvent(new window.Event("visibilitychange"));
  });
  check("visible document resumes system pause", () =>
    assert.ok(document.querySelector('[aria-label="Pause autoplay"]')),
  );
  click("Pause autoplay");
  act(() => {
    hidden = true;
    document.dispatchEvent(new window.Event("visibilitychange"));
    hidden = false;
    document.dispatchEvent(new window.Event("visibilitychange"));
  });
  check("explicit pause survives tab visibility", () =>
    assert.ok(document.querySelector('[aria-label="Play autoplay"]')),
  );
  act(() => {
    reduced = true;
    mediaListeners.forEach((f) => f());
  });
  tick(30000);
  check("reduced motion stops automatic progression", () =>
    assert.equal(heading(), "B"),
  );
  check("reduced-motion indicator is static", () =>
    assert.equal(
      document.querySelector(".hw-progress").style.animation,
      "none",
    ),
  );
  check("play control precedes progress segments", () =>
    assert.equal(
      document.querySelector(".hw-story-controls").firstElementChild.className,
      "hw-play",
    ),
  );
  console.log(`${checks} carousel checks passed`);
} finally {
  act(() => root.unmount());
  global.setTimeout = realTimeout;
  global.clearTimeout = realClear;
  Date.now = realNow;
  dom.window.close();
}
