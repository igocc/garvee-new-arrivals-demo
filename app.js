const products = [
  {
    id: "harrow-8ft",
    category: "Agriculture",
    subcategory: "Equipment",
    name: "8 ft Heavy-Duty Drag Harrow Driveway Grader",
    url: "https://www.garvee.com/products/garvee-garveetech-drag-harrow-driveway-grader-pho-15ey5veq",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/61PrbY5JX9L.jpg?v=1726831553&width=600&format=webp&quality=88",
    addedDays: 9,
    price: 137.99,
    compareAt: 309.99,
    rating: 4.84,
    reviews: 167,
    inventory: 28,
    sold30: 96,
    conversion: 0.072,
    delivery: "Fri, Sep 25",
  },
  {
    id: "garden-cart-900",
    category: "Lawn & Garden",
    subcategory: "Garden carts",
    name: "900 lb Heavy-Duty Steel Garden Cart Wagon",
    url: "https://www.garvee.com/products/garvee-heavy-duty-steel-garden-cart-pho-34h8t6ln",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpr9ipy4bn.jpg?v=1786498112&width=600&format=webp&quality=88",
    addedDays: 12,
    price: 123.99,
    compareAt: 154.99,
    rating: 4.86,
    reviews: 195,
    inventory: 35,
    sold30: 118,
    conversion: 0.081,
    delivery: "Fri, Sep 25",
  },
  {
    id: "mini-split-24k",
    category: "Climate",
    subcategory: "Mini split AC",
    name: "24,000 BTU 19 SEER2 WiFi Mini Split AC & Heater",
    url: "https://www.garvee.com/products/garvee-24000-btu-high-efficiency-mini-mhk-375gubeb",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpnfzoaww.jpg?v=1780105249&width=600&format=webp&quality=88",
    addedDays: 18,
    price: 973.99,
    compareAt: 1199.99,
    rating: 4.84,
    reviews: 147,
    inventory: 18,
    sold30: 74,
    conversion: 0.048,
    delivery: "Mon, Sep 28",
  },
  {
    id: "scalloped-rug-5x7",
    category: "Rugs",
    subcategory: "Area rugs",
    name: "5 × 7 ft Washable Scalloped Floral Area Rug",
    url: "https://www.garvee.com/products/garvee-scalloped-floral-area-rug-5x7-grass-green-phk-36epa7kh",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/cimage_b4b3bfd2e7e4b870.jpg?v=1788939575&width=600&format=webp&quality=88",
    addedDays: 6,
    price: 42.99,
    compareAt: 59.99,
    rating: 4.9,
    reviews: 41,
    inventory: 12,
    sold30: 88,
    conversion: 0.093,
    delivery: "Fri, Sep 25",
  },
  {
    id: "truck-box-36",
    category: "Automotive",
    subcategory: "Truck storage",
    name: "36 in Heavy-Duty Steel Truck Bed Tool Box",
    url: "https://www.garvee.com/products/garvee-heavy-duty-steel-truck-bed-pae-34ek4aj3",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/fe17866966841964881_713e0f74-d802-4e4f-b9f3-c291b3db86aa.jpg?v=1787708724&width=600&format=webp&quality=88",
    addedDays: 4,
    price: 259.99,
    compareAt: 299.99,
    rating: 0,
    reviews: 0,
    inventory: 24,
    sold30: 42,
    conversion: 0.057,
    delivery: "Sat, Sep 26",
  },
  {
    id: "dog-crate-71",
    category: "Home & Furniture",
    subcategory: "Pet furniture",
    name: "71 in Double Dog Crate Furniture with Storage",
    url: "https://www.garvee.com/products/garvee-71-in-dog-crate-furniture-for-2-dogs-white-mps-33mw943x",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpsig18z7k.jpg?v=1787289869&width=600&format=webp&quality=88",
    addedDays: 7,
    price: 369.99,
    compareAt: 429.99,
    rating: 0,
    reviews: 0,
    inventory: 17,
    sold30: 37,
    conversion: 0.044,
    delivery: "Mon, Sep 28",
  },
  {
    id: "field-fence-14",
    category: "Agriculture",
    subcategory: "Fencing",
    name: "14 Gauge 4 × 328 ft Galvanized Livestock Fence",
    url: "https://www.garvee.com/products/garvee-14-gauge-galvanized-livestock-fence-4ft-x-328ft-ppg-35aabdec",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmp2uhr23ne_5752b8d0-d2a0-4ce4-812e-ddd51735f76b.jpg?v=1787541867&width=600&format=webp&quality=88",
    addedDays: 3,
    price: 149.99,
    compareAt: 211.99,
    rating: 0,
    reviews: 0,
    inventory: 31,
    sold30: 49,
    conversion: 0.062,
    delivery: "Fri, Sep 25",
  },
  {
    id: "runner-rug-2x4",
    category: "Rugs",
    subcategory: "Runner rugs",
    name: "2 × 4 ft Washable Braided Print Runner Rug",
    url: "https://www.garvee.com/products/garvee-braided-print-rug-modern-boho-2x4-black-pho-104gnvmz",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/1698322225056.jpg?v=1787896990&width=600&format=webp&quality=88",
    addedDays: 15,
    price: 29.99,
    compareAt: 39.99,
    rating: 4.71,
    reviews: 80,
    inventory: 6,
    sold30: 105,
    conversion: 0.089,
    delivery: "Fri, Sep 25",
  },
  {
    id: "planter-two-pack",
    category: "Lawn & Garden",
    subcategory: "Planters",
    name: "16 in Self-Watering Tall Planter Pots, 2-Pack",
    url: "https://www.garvee.com/products/garvee-self-watering-tall-planter-pots-ppg-34nnsbl6",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/fe17866162614529387.jpg?v=1787732429&width=600&format=webp&quality=88",
    addedDays: 2,
    price: 52.99,
    compareAt: 69.99,
    rating: 0,
    reviews: 0,
    inventory: 52,
    sold30: 31,
    conversion: 0.051,
    delivery: "Fri, Sep 25",
  },
  {
    id: "nesting-box-10",
    category: "Agriculture",
    subcategory: "Poultry supplies",
    name: "10-Compartment Roll Away Chicken Nesting Box",
    url: "https://www.garvee.com/products/garvee-10-compartment-chicken-nesting-box-with-legs-red-pps-33a8dvrp",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpm7048uq5.jpg?v=1787899296&width=600&format=webp&quality=88",
    addedDays: 10,
    price: 223.99,
    compareAt: 279.99,
    rating: 4.73,
    reviews: 11,
    inventory: 21,
    sold30: 44,
    conversion: 0.058,
    delivery: "Sat, Sep 26",
  },
  {
    id: "mini-split-18k",
    category: "Climate",
    subcategory: "Mini split AC",
    name: "18,000 BTU 19 SEER2 Smart Mini Split Heat Pump",
    url: "https://www.garvee.com/products/garvee-mini-split-ac-heat-pump-mhk-375f38rq",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpabwkt6dm.jpg?v=1779270163&width=600&format=webp&quality=88",
    addedDays: 20,
    price: 746.99,
    compareAt: 899.99,
    rating: 4.84,
    reviews: 147,
    inventory: 14,
    sold30: 61,
    conversion: 0.042,
    delivery: "Mon, Sep 28",
  },
  {
    id: "rug-4x6-blue",
    category: "Rugs",
    subcategory: "Area rugs",
    name: "4 × 6 ft Washable Botanical Scalloped Rug",
    url: "https://www.garvee.com/products/garvee-4x6-botanical-scalloped-area-rug-phk-36h3bk6f",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpoosybmhs.jpg?v=1789098892&width=600&format=webp&quality=88",
    addedDays: 5,
    price: 26.99,
    compareAt: 49.99,
    rating: 4.79,
    reviews: 63,
    inventory: 13,
    sold30: 73,
    conversion: 0.087,
    delivery: "Fri, Sep 25",
  },
  {
    id: "truck-box-underbody",
    category: "Automotive",
    subcategory: "Truck storage",
    name: "34.5 in Lockable Underbody Truck Tool Box",
    url: "https://www.garvee.com/products/garvee-heavy-duty-underbody-truck-tool-pae-34e5kyfw",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/cimage_0e48133d8927512a.jpg?v=1787708653&width=600&format=webp&quality=88",
    addedDays: 8,
    price: 169.99,
    compareAt: 219.99,
    rating: 0,
    reviews: 0,
    inventory: 26,
    sold30: 35,
    conversion: 0.049,
    delivery: "Sat, Sep 26",
  },
  {
    id: "cod-skin-treats",
    category: "Home & Furniture",
    subcategory: "Pet supplies",
    name: "Natural Cod Skin Jerky Dog Treats, 6 oz",
    url: "https://www.garvee.com/products/garvee-thin-cut-cod-skin-jerky-dog-treats-pps-33jmxcb9",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpdfg6foh8.jpg?v=1787297451&width=600&format=webp&quality=88",
    addedDays: 11,
    price: 29.99,
    compareAt: 39.99,
    rating: 5,
    reviews: 2,
    inventory: 44,
    sold30: 28,
    conversion: 0.066,
    delivery: "Fri, Sep 25",
  },
  {
    id: "garden-cart-500",
    category: "Lawn & Garden",
    subcategory: "Garden carts",
    name: "500 lb Steel Utility Dump Cart with Folding Sides",
    url: "https://www.garvee.com/products/garvee-heavy-duty-steel-garden-cart-pho-34h8xuur",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmpa414y40p.jpg?v=1786498188&width=600&format=webp&quality=88",
    addedDays: 14,
    price: 113.99,
    compareAt: 149.99,
    rating: 4.86,
    reviews: 195,
    inventory: 30,
    sold30: 84,
    conversion: 0.075,
    delivery: "Fri, Sep 25",
  },
  {
    id: "dog-crate-black",
    category: "Home & Furniture",
    subcategory: "Pet furniture",
    name: "71 in Double Dog Crate TV Stand, Black",
    url: "https://www.garvee.com/products/garvee-71-in-dog-crate-furniture-for-2-dogs-black-mps-33mwjad5",
    image: "https://cdn.shopify.com/s/files/1/0724/6698/9369/files/shopify_2Fai_images_2Ftmplh87okli.jpg?v=1787289868&width=600&format=webp&quality=88",
    addedDays: 16,
    price: 369.99,
    compareAt: 459.99,
    rating: 0,
    reviews: 0,
    inventory: 11,
    sold30: 26,
    conversion: 0.038,
    delivery: "Mon, Sep 28",
  },
];

const categoryLabels = ["All", "Agriculture", "Lawn & Garden", "Home & Furniture", "Rugs", "Automotive", "Climate"];

const modeCopy = {
  trending: {
    title: "30-day movers",
    description: "New products ranked by early sales velocity, conversion quality, freshness, and stock health.",
  },
  newest: {
    title: "Just landed",
    description: "The newest in-stock products first, with low-inventory risk kept visible.",
  },
  deals: {
    title: "Fresh deals",
    description: "New arrivals with the strongest verified markdowns, separated from popularity ranking.",
  },
  rated: {
    title: "Early favorites",
    description: "High-rated new products ranked with review-count confidence, not star rating alone.",
  },
};

const state = {
  category: "All",
  mode: "trending",
  query: "",
  visible: 8,
  cart: 0,
};

const els = {
  categoryTabs: document.querySelector("#categoryTabs"),
  modeTabs: document.querySelector("#modeTabs"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  resultContext: document.querySelector("#resultContext"),
  discoveryTitle: document.querySelector("#discoveryTitle"),
  modeDescription: document.querySelector("#modeDescription"),
  signalStrip: document.querySelector("#signalStrip"),
  searchInput: document.querySelector("#searchInput"),
  loadMore: document.querySelector("#loadMore"),
  emptyState: document.querySelector("#emptyState"),
  clearFilters: document.querySelector("#clearFilters"),
  cartCount: document.querySelector("#cartCount"),
  toast: document.querySelector("#toast"),
  logicDialog: document.querySelector("#logicDialog"),
  openLogic: document.querySelector("#openLogic"),
  closeLogic: document.querySelector("#closeLogic"),
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function discountFor(product) {
  return Math.round((1 - product.price / product.compareAt) * 100);
}

function ratingConfidence(product) {
  if (!product.reviews) return 0;
  const priorRating = 4.35;
  const priorWeight = 24;
  return (product.rating * product.reviews + priorRating * priorWeight) / (product.reviews + priorWeight);
}

function trendScore(product) {
  const ageAdjustedVelocity = product.sold30 / Math.max(product.addedDays, 7);
  const velocity = clamp(ageAdjustedVelocity / 12);
  const conversion = clamp(product.conversion / 0.09);
  const freshness = clamp(1 - product.addedDays / 32);
  const rating = product.reviews ? clamp((ratingConfidence(product) - 4) / 1) : 0.32;
  const inventory = product.inventory < 7 ? product.inventory / 14 : clamp(product.inventory / 28);
  const promotion = clamp(discountFor(product) / 45);
  return Math.round((velocity * 0.35 + conversion * 0.2 + freshness * 0.2 + rating * 0.1 + inventory * 0.1 + promotion * 0.05) * 100);
}

function filteredProducts() {
  const query = state.query.trim().toLowerCase();
  const items = products.filter((product) => {
    const categoryMatch = state.category === "All" || product.category === state.category;
    const queryMatch = !query || `${product.name} ${product.category} ${product.subcategory}`.toLowerCase().includes(query);
    return categoryMatch && queryMatch && product.inventory > 0 && product.addedDays <= 30;
  });

  return items.sort((a, b) => {
    if (state.mode === "newest") return a.addedDays - b.addedDays;
    if (state.mode === "deals") return discountFor(b) - discountFor(a) || trendScore(b) - trendScore(a);
    if (state.mode === "rated") return ratingConfidence(b) - ratingConfidence(a) || b.reviews - a.reviews;
    return trendScore(b) - trendScore(a);
  });
}

function renderCategories() {
  els.categoryTabs.innerHTML = categoryLabels
    .map((category) => {
      const count = category === "All" ? products.length : products.filter((product) => product.category === category).length;
      const selected = state.category === category;
      return `
        <button
          class="category-tab${selected ? " is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${selected}"
          data-category="${category}"
        >
          ${category}
          <span>${count}</span>
        </button>
      `;
    })
    .join("");
}

function renderSignals(items) {
  if (!items.length) {
    els.signalStrip.innerHTML = "";
    return;
  }

  const averageDiscount = Math.round(items.reduce((sum, item) => sum + discountFor(item), 0) / items.length);
  const fastDelivery = items.filter((item) => item.delivery.includes("Fri")).length;
  const reviewCoverage = Math.round((items.filter((item) => item.reviews > 0).length / items.length) * 100);

  els.signalStrip.innerHTML = `
    <div class="signal-card"><div><span>Assortment</span><strong>${items.length} available now</strong></div><b>30-day window</b></div>
    <div class="signal-card"><div><span>Offer depth</span><strong>${averageDiscount}% avg. markdown</strong></div><b>Price-history gate</b></div>
    <div class="signal-card"><div><span>Decision confidence</span><strong>${reviewCoverage}% reviewed</strong></div><b>${fastDelivery} ship fastest</b></div>
  `;
}

function ratingMarkup(product) {
  if (!product.reviews) return `<span class="rating-new">New · no reviews yet</span>`;
  return `<span class="stars" aria-hidden="true">★★★★★</span><strong>${product.rating.toFixed(1)}</strong><span>(${product.reviews})</span>`;
}

function productCard(product, index) {
  const discount = discountFor(product);
  const trendingBadge = state.mode === "trending" && index < 3 ? `<span class="badge badge-hot">Trending #${index + 1}</span>` : "";
  const newBadge = product.addedDays <= 7 ? `<span class="badge badge-new">Just landed</span>` : `<span class="badge">New ${product.addedDays}d</span>`;
  const stockClass = product.inventory <= 8 ? "low-stock" : "";
  const stockText = product.inventory <= 8 ? `Only ${product.inventory} left` : "In stock";

  return `
    <article class="product-card">
      <a class="product-media" href="${product.url}" target="_blank" rel="noreferrer" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="600" height="540" />
        <span class="badge-stack">${trendingBadge}${newBadge}</span>
      </a>
      <div class="product-body">
        <p class="product-kicker">${product.category} · ${product.subcategory}</p>
        <h3 class="product-name"><a href="${product.url}" target="_blank" rel="noreferrer">${product.name}</a></h3>
        <div class="rating-row">${ratingMarkup(product)}</div>
        <div class="price-row">
          <span class="price">${money.format(product.price)}</span>
          <span class="compare-price">${money.format(product.compareAt)}</span>
          <span class="discount-label">-${discount}%</span>
        </div>
        <p class="fulfillment"><strong class="${stockClass}">${stockText}</strong><br />Delivery from ${product.delivery}</p>
        <button class="add-button" type="button" data-add="${product.id}">
          <svg><use href="#icon-plus"></use></svg>
          Quick add
        </button>
      </div>
    </article>
  `;
}

function renderProducts() {
  const items = filteredProducts();
  const shown = items.slice(0, state.visible);
  const copy = modeCopy[state.mode];

  els.discoveryTitle.textContent = copy.title;
  els.modeDescription.textContent = copy.description;
  els.resultContext.textContent = state.category === "All" ? "All categories" : state.category;
  els.resultCount.textContent = `${items.length} products`;
  renderSignals(items);

  els.productGrid.innerHTML = shown.map(productCard).join("");
  els.productGrid.hidden = items.length === 0;
  els.emptyState.hidden = items.length > 0;
  els.loadMore.hidden = items.length <= state.visible;
}

function updateModeButtons() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const selected = button.dataset.mode === state.mode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}

function resetVisible() {
  state.visible = 8;
}

els.categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  resetVisible();
  renderCategories();
  renderProducts();
});

els.modeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  state.mode = button.dataset.mode;
  resetVisible();
  updateModeButtons();
  renderProducts();
});

els.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  resetVisible();
  renderProducts();
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (event.key === "/" && target.tagName !== "INPUT" && !target.isContentEditable) {
    event.preventDefault();
    els.searchInput.focus();
  }
});

els.productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  state.cart += 1;
  els.cartCount.textContent = state.cart;
  document.querySelector(".cart-button").setAttribute("aria-label", `Cart with ${state.cart} item${state.cart === 1 ? "" : "s"}`);
  showToast(`${product.name} added to the demo cart`);
});

els.loadMore.addEventListener("click", () => {
  state.visible += 8;
  renderProducts();
});

els.clearFilters.addEventListener("click", () => {
  state.category = "All";
  state.query = "";
  els.searchInput.value = "";
  resetVisible();
  renderCategories();
  renderProducts();
});

els.openLogic.addEventListener("click", () => els.logicDialog.showModal());
els.closeLogic.addEventListener("click", () => els.logicDialog.close());
els.logicDialog.addEventListener("click", (event) => {
  const bounds = els.logicDialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) els.logicDialog.close();
});

async function setupPretext() {
  try {
    const { prepare, layout } = await import("https://esm.sh/@chenglou/pretext");
    await document.fonts.ready;
    const elements = [...document.querySelectorAll("[data-pretext]")];
    const prepared = new Map();

    const prepareElement = (element) => {
      const style = getComputedStyle(element);
      prepared.set(element, prepare(element.textContent.trim(), style.font));
    };

    const relayout = () => {
      for (const [element, handle] of prepared) {
        const style = getComputedStyle(element);
        const lineHeight = Number.parseFloat(style.lineHeight);
        if (!Number.isFinite(lineHeight)) continue;
        const { height } = layout(handle, element.clientWidth, lineHeight);
        element.style.minHeight = `${Math.ceil(height)}px`;
      }
    };

    elements.forEach((element) => {
      prepareElement(element);
      if (element.isContentEditable) {
        new MutationObserver(() => {
          prepareElement(element);
          relayout();
        }).observe(element, { characterData: true, childList: true, subtree: true });
      }
    });

    new ResizeObserver(relayout).observe(document.body);
    relayout();
  } catch (error) {
    document.documentElement.classList.add("pretext-fallback");
  }
}

renderCategories();
renderProducts();
setupPretext();
