import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const siteDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const happyDomPath = path.join(process.env.HAPPY_DOM_DIR, "node_modules/happy-dom/lib/index.js");
const { Window } = await import(pathToFileURL(happyDomPath));

const window = new Window({ url: pathToFileURL(path.join(siteDir, "index.html")).href });
window.ResizeObserver = class {
  observe() {}
  disconnect() {}
};
window.HTMLCanvasElement.prototype.getContext = () => ({
  font: "",
  measureText: (text) => ({ width: String(text).length * 8 }),
});

const html = await fs.readFile(path.join(siteDir, "index.html"), "utf8");
window.document.write(html);
Object.defineProperty(window.document, "fonts", { value: { ready: Promise.resolve() } });

for (const filename of ["catalog.js", "vendor/pretext.bundle.js", "app.js"]) {
  window.eval(await fs.readFile(path.join(siteDir, filename), "utf8"));
}
await Promise.resolve();

const document = window.document;
const click = (selector) => {
  const element = document.querySelector(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  element.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  return element;
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(document.querySelectorAll(".hero-slide").length === 3, "Expected three hero slides");
assert(document.querySelectorAll(".category-card").length === 12, "Expected All plus eleven category cards");
assert(document.querySelectorAll(".product-card").length === 10, "Default view should show ten products");
assert(document.querySelector("#catalogTitle").textContent === "Trending new arrivals", "Trending should be the default tab");

if (process.env.RENDER_OUT) {
  const base = document.createElement("base");
  base.href = pathToFileURL(`${siteDir}/`).href;
  document.head.prepend(base);
  await fs.writeFile(process.env.RENDER_OUT, `<!doctype html>\n${document.documentElement.outerHTML}`);
}

click('[data-mode="newest"]');
assert(document.querySelector("#catalogTitle").textContent === "The newest of the new", "Newest tab did not render");
assert([...document.querySelectorAll("[data-days]")].every((button) => button.disabled), "Time filter should disable on Newest");

click('[data-mode="deals"]');
click('[data-days="60"]');
assert(document.querySelector('[data-days="60"]').classList.contains("is-active"), "60-day filter did not activate");
assert(!document.querySelector('[data-days="60"]').disabled, "Time filter did not re-enable after leaving Newest");

const beforeMore = document.querySelectorAll(".product-card").length;
click("#viewMore");
const afterMore = document.querySelectorAll(".product-card").length;
assert(afterMore > beforeMore, "View more did not append products");

click("[data-add]");
assert(document.querySelector("#cartCount").textContent === "1", "Cart count did not update");

click("#heroClose");
assert(document.querySelector("#heroShell").hidden, "Hero did not close");
click("#heroRestore button");
assert(!document.querySelector("#heroShell").hidden, "Hero did not restore");

const searchInput = document.querySelector("#mobileSearchInput");
searchInput.value = "no-product-can-match-this";
searchInput.dispatchEvent(new window.InputEvent("input", { bubbles: true }));
assert(!document.querySelector("#emptyState").hidden, "No-result search did not show the empty state");
click("#resetFilters");
assert(document.querySelectorAll(".product-card").length === 10, "Reset filters did not restore the default ten products");

click('[data-category="Air Conditioners"]');
assert(document.querySelector("#resultEyebrow").textContent.includes("Air Conditioners"), "Category filter did not update context");
assert(document.querySelectorAll(".product-card").length > 0, "Air Conditioners category should contain products");

console.log(JSON.stringify({
  heroSlides: document.querySelectorAll(".hero-slide").length,
  categories: document.querySelectorAll(".category-card").length,
  defaultProducts: 10,
  productsAfterMore: afterMore,
  cartCount: Number(document.querySelector("#cartCount").textContent),
  status: "pass",
}, null, 2));

window.happyDOM.abort();
