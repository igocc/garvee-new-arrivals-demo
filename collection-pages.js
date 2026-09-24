(() => {
  "use strict";

  const data = window.GARVEE_DEMO_DATA;
  const page = document.body.dataset.collection;
  if (!data?.products?.length || !["best", "flash", "clearance"].includes(page)) return;

  const config = {
    best: {
      label: "Best Sellers",
      eyebrow: "What shoppers choose most",
      title: "Proven favorites, ranked.",
      description: "A transparent 30-day ranking built around net demo unit sales—not promotional placement.",
      resultsTitle: "All best sellers",
      quicks: [["rating4", "4★ & Up"], ["under100", "Under $100"], ["inStock", "In Stock"], ["fast", "Fast Delivery"]],
      sorts: [["rank", "Best-selling rank"], ["rating", "Highest rated"], ["reviews", "Most reviewed"], ["priceAsc", "Price: low to high"], ["priceDesc", "Price: high to low"]],
      method: "Ranked by deterministic 30-day demo unit sales. A production version should use paid units minus cancellations and full refunds, update daily, and retain rank snapshots.",
    },
    flash: {
      label: "Flash Deals",
      eyebrow: "Live · Limited-time event",
      title: "Act fast. Save for real.",
      description: "One clear event deadline, transparent savings, and inventory messages backed by available-to-sell quantities.",
      resultsTitle: "Live flash deals",
      quicks: [["ending2", "Ending in 2 hours"], ["discount40", "40%+ Off"], ["under100", "Under $100"], ["lowStock", "Last Units"]],
      sorts: [["ending", "Ending soon"], ["discount", "Biggest discount"], ["saving", "Biggest savings"], ["rank", "Best selling"], ["priceAsc", "Price: low to high"]],
      method: "This prototype uses one fixed campaign deadline and derives product urgency from demo fields. Production eligibility must require an active promotion ID, server start/end time, sale price, eligible variants, and current available-to-sell inventory.",
    },
    clearance: {
      label: "Clearance",
      eyebrow: "Final markdowns",
      title: "Last chance. Real value.",
      description: "Exit inventory organized around savings, remaining availability, and clear lifecycle—not an artificial countdown.",
      resultsTitle: "All clearance",
      quicks: [["discount50", "50%+ Off"], ["under100", "Under $100"], ["save100", "Save $100+"], ["lowStock", "Last Units"]],
      sorts: [["clearance", "Recommended clearance"], ["discount", "Biggest discount"], ["saving", "Biggest savings"], ["stock", "Last units"], ["rank", "Best selling"], ["priceAsc", "Price: low to high"]],
      method: "Clearance is treated as an inventory lifecycle state. Production products should carry an auditable clearance status, no-restock flag, reason, condition, and return-policy treatment. It should not inherit Flash Deal countdown behavior.",
    },
  }[page];

  const categories = [...new Set(data.products.map((product) => product.category))].sort((a, b) => a.localeCompare(b));
  const derived = data.products.map((product, index) => {
    const discount = product.compareAt > product.price ? Math.round((1 - product.price / product.compareAt) * 100) : 0;
    const saving = Math.max(0, product.compareAt - product.price);
    const hoursLeft = [1.4, 3.5, 7, 13, 23, 38][index % 6];
    return { ...product, discount, saving, hoursLeft, rank: 0, originalIndex: index };
  });
  const ranked = [...derived].sort((a, b) => b.sold30 - a.sold30 || b.reviews - a.reviews).map((product, index) => ({ ...product, rank: index + 1 }));

  const eligible = ranked.filter((product) => {
    if (page === "flash") return product.discount >= 10 && product.inventory > 0;
    if (page === "clearance") return (product.discount >= 15 || product.inventory <= 30) && product.inventory > 0;
    return product.inventory > 0;
  });

  const state = { category: "All", price: new Set(), rating: new Set(), availability: new Set(), discount: new Set(), urgency: new Set(), quick: new Set(), sort: config.sorts[0][0], visible: 12, cart: 0, query: "" };
  const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value >= 1000 ? 0 : 2 }).format(value);
  const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const countForCategory = (category) => category === "All" ? eligible.length : eligible.filter((product) => product.category === category).length;

  function nav() {
    return `<div class="announcement"><strong>GARVEE prototype</strong><span>Free shipping on all US orders</span></div>
      <header class="site-header">
        <div class="header-main page-width"><a class="brand" href="./index.html">GARVEE</a><form class="search" id="searchForm"><label class="sr-only" for="searchInput">Search products</label><input id="searchInput" type="search" placeholder="What are you looking for today?" /><button type="submit" aria-label="Search">⌕</button></form><div class="header-actions"><button type="button" data-toast="Account is disabled in this offline prototype.">Account</button><button type="button" data-toast="Cart preview"><span>Cart</span><b class="cart-count" id="cartCount">0</b></button></div></div>
        <nav class="primary-nav page-width" aria-label="Primary navigation"><a href="./index.html">New Arrivals</a><a href="./best-sellers.html" class="${page === "best" ? "is-active" : ""}">Best Sellers</a><a href="./flash-deals.html" class="${page === "flash" ? "is-active" : ""}">Flash Deals</a><a href="./clearance.html" class="${page === "clearance" ? "is-active" : ""}">Clearance</a><a href="https://www.garvee.com/" target="_blank" rel="noreferrer">GARVEE.com ↗</a></nav>
      </header>
      <div class="benefit-bar"><div class="page-width"><span><b>✓</b> Free Shipping</span><span><b>✓</b> 30-Day Returns</span><span><b>✓</b> 12-Month Warranty</span></div></div>`;
  }

  function hero() {
    const signal = page === "best"
      ? `<div class="hero-signal rank-signal" aria-label="Top three ranking"><span>#1</span><span>#2</span><span>#3</span></div>`
      : page === "flash"
        ? `<div class="hero-signal"><p class="countdown-label">Event ends in</p><div class="countdown" id="countdown"><div><strong>00</strong><span>Days</span></div><div><strong>00</strong><span>Hours</span></div><div><strong>00</strong><span>Mins</span></div><div><strong>00</strong><span>Secs</span></div></div><p class="deadline">Ends Sep 30, 2026 · 11:59 PM ET</p></div>`
        : `<div class="hero-signal clearance-signal"><strong>Final markdowns</strong><span>Marked products are not planned for replenishment. Availability varies by SKU.</span><span>Standard returns unless a product is clearly marked Final Sale.</span></div>`;
    return `<div class="page-width breadcrumb"><a href="./index.html">Home</a><span>/</span><strong>${config.label}</strong></div>
      <section class="collection-hero hero-${page === "best" ? "best" : page === "flash" ? "flash" : "clearance"} page-width">
        <div class="hero-copy"><p class="eyebrow">${config.eyebrow}</p><h1>${config.title}</h1><p>${config.description}</p><button class="method-link" type="button" data-scroll-method>How this page works →</button></div>${signal}
      </section>`;
  }

  function categoriesHtml() {
    const all = ["All", ...categories].map((category) => `<button class="category-chip${state.category === category ? " is-active" : ""}" type="button" data-category="${escape(category)}"><span>${escape(category)}</span><small>${countForCategory(category)}</small></button>`).join("");
    return `<section class="category-block page-width"><div class="section-top"><h2>Shop by category</h2><p>All categories · one row</p></div><div class="category-rail">${all}</div></section>
      <section class="quick-area page-width"><div class="quick-rail">${config.quicks.map(([key,label]) => `<button class="quick-chip${state.quick.has(key) ? " is-active" : ""}" type="button" data-quick="${key}">${label}</button>`).join("")}</div></section>`;
  }

  const filterGroups = [
    ["price", "Price", [["under100", "Under $100"], ["100to300", "$100–$300"], ["300to700", "$300–$700"], ["700plus", "$700+"]]],
    ["rating", "Customer rating", [["4.5", "4.5★ & Up"], ["4", "4★ & Up"], ["reviewed", "Has reviews"]]],
    ["availability", "Availability", [["stock", "In stock"], ["last", "Last units (≤ 20)"]]],
    ...page === "best" ? [] : [["discount", "Discount", [["10", "10%+ Off"], ["30", "30%+ Off"], ["40", "40%+ Off"], ["50", "50%+ Off"]]]],
    ...page === "flash" ? [["urgency", "Ending", [["2", "Within 2 hours"], ["12", "Within 12 hours"], ["24", "Within 24 hours"]]]] : [],
  ];

  function optionCount(group, value) {
    return eligible.filter((product) => matchSingle(product, group, value)).length;
  }

  function filtersHtml() {
    const groups = filterGroups.map(([group,label,options], index) => `<details class="filter-group" ${index < 3 ? "open" : ""}><summary>${label}</summary><div class="filter-options">${options.map(([value,text]) => `<label class="filter-option"><input type="checkbox" data-filter="${group}" value="${value}" ${state[group].has(value) ? "checked" : ""}/><span>${text}</span><small>${optionCount(group,value)}</small></label>`).join("")}</div></details>`).join("");
    return `<aside class="filters" id="filters"><div class="filters-head"><h2>Filters</h2><button class="clear-all" type="button" data-clear>Clear all</button></div><div class="filters-scroll">${groups}</div><div class="drawer-actions"><button type="button" data-clear>Clear</button><button type="button" data-close-filter>View products</button></div></aside><button class="drawer-backdrop" id="drawerBackdrop" type="button" aria-label="Close filters"></button>`;
  }

  function shell() {
    const sortOptions = config.sorts.map(([value,label]) => `<option value="${value}">${label}</option>`).join("");
    document.querySelector("#collectionApp").innerHTML = `${nav()}<main>${hero()}${categoriesHtml()}<section class="catalog-shell"><div class="mobile-toolbar"><button type="button" id="mobileFilter">Filter <span id="mobileFilterCount"></span></button><button type="button" id="mobileSort">Sort</button></div><div class="catalog-layout page-width">${filtersHtml()}<div class="catalog-main"><div class="catalog-top"><div class="result-meta"><h2>${config.resultsTitle}</h2><p id="resultCount"></p></div><label class="sort-wrap">Sort by <select id="sortSelect">${sortOptions}</select></label></div><div class="applied" id="applied"></div><div class="top-ranked" id="topRanked" ${page === "best" ? "" : "hidden"}></div><div class="product-grid" id="productGrid"></div><div class="empty" id="empty" hidden><h3>No products match</h3><p>Remove a filter or choose another category.</p><button type="button" data-clear>Reset filters</button></div><div class="more-wrap" id="moreWrap"><p id="showing"></p><button class="view-more" id="viewMore" type="button">View more</button></div></div></div></section><section class="methodology" id="methodology"><div class="page-width"><h2>Transparent by design.</h2><p>${config.method} Product data comes from a fixed public GARVEE catalog snapshot; sales, urgency, lifecycle, and ranking fields are deterministic prototype values—not live business claims.</p></div></section></main><footer class="footer"><div><span>© 2026 GARVEE · Offline concept</span><span>Prototype · Not a live storefront</span></div></footer><div class="toast" id="toast" role="status"></div>`;
  }

  function matchSingle(product, group, value) {
    if (group === "price") return value === "under100" ? product.price < 100 : value === "100to300" ? product.price >= 100 && product.price < 300 : value === "300to700" ? product.price >= 300 && product.price < 700 : product.price >= 700;
    if (group === "rating") return value === "4.5" ? product.rating >= 4.5 : value === "4" ? product.rating >= 4 : product.reviews > 0;
    if (group === "availability") return value === "stock" ? product.inventory > 0 : product.inventory <= 20;
    if (group === "discount") return product.discount >= Number(value);
    if (group === "urgency") return product.hoursLeft <= Number(value);
    return true;
  }

  function matchesSet(product, group) {
    const values = state[group];
    return values.size === 0 || [...values].some((value) => matchSingle(product, group, value));
  }

  function matchesQuick(product) {
    return [...state.quick].every((quick) => {
      if (quick === "rating4") return product.rating >= 4;
      if (quick === "under100") return product.price < 100;
      if (quick === "inStock") return product.inventory > 0;
      if (quick === "fast") return product.originalIndex % 3 !== 0;
      if (quick === "ending2") return product.hoursLeft <= 2;
      if (quick === "discount40") return product.discount >= 40;
      if (quick === "discount50") return product.discount >= 50;
      if (quick === "save100") return product.saving >= 100;
      if (quick === "lowStock") return product.inventory <= 20;
      return true;
    });
  }

  function filteredProducts() {
    const query = state.query.trim().toLowerCase();
    const result = eligible.filter((product) => (state.category === "All" || product.category === state.category) && (!query || `${product.name} ${product.category} ${product.subcategory}`.toLowerCase().includes(query)) && filterGroups.every(([group]) => matchesSet(product, group)) && matchesQuick(product));
    return result.sort((a,b) => {
      if (state.sort === "rating") return b.rating - a.rating || b.reviews - a.reviews;
      if (state.sort === "reviews") return b.reviews - a.reviews;
      if (state.sort === "priceAsc") return a.price - b.price;
      if (state.sort === "priceDesc") return b.price - a.price;
      if (state.sort === "discount") return b.discount - a.discount;
      if (state.sort === "saving") return b.saving - a.saving;
      if (state.sort === "ending") return a.hoursLeft - b.hoursLeft;
      if (state.sort === "stock") return a.inventory - b.inventory;
      if (state.sort === "clearance") return (b.discount * 2 + Math.max(0,30-b.inventory)) - (a.discount * 2 + Math.max(0,30-a.inventory));
      return a.rank - b.rank;
    });
  }

  function specFor(product) {
    const rules = {
      "Air Conditioners": "Smart control · Energy efficient",
      "Automotive": "Heavy-duty · Weather resistant",
      "Home & Furniture": "Indoor use · Easy assembly",
      "Rugs": "Washable · Non-slip",
      "Lawn & Garden": "Outdoor ready · Durable",
      "Agriculture & Forestry": "Heavy-duty · Universal fit",
      "Restaurant & Food Service": "Commercial-grade · Easy clean",
      "Sports & Outdoors": "Portable · Built to last",
    };
    return rules[product.category] || `${product.subcategory} · Ready to ship`;
  }

  function stockText(product) {
    if (product.inventory <= 10) return [`Only ${product.inventory} left${page === "clearance" ? " · No restock" : ""}`, "low"];
    if (product.inventory <= 20) return [page === "clearance" ? "Almost gone · No restock" : "Almost gone", "low"];
    return [`In stock · Delivery ${product.delivery}`, "good"];
  }

  function card(product) {
    const [stock, stockClass] = stockText(product);
    const badge = page === "best" ? `<span class="rank-badge">#${product.rank}</span>` : `<span class="status-badge ${page}">${page === "flash" ? "Flash Deal" : "Clearance"}</span>`;
    const context = page === "best" ? `#${product.rank} in ${escape(product.category)}` : page === "flash" ? (product.hoursLeft <= 2 ? "Ends in under 2 hours" : product.hoursLeft <= 24 ? "Ends today" : "Limited-time offer") : (product.inventory <= 20 ? "Final units" : "Final markdown");
    const dealLine = page === "flash" ? `<p class="deal-line">${context}</p>` : page === "clearance" ? `<p class="deal-line">${product.inventory <= 20 ? "No restock planned" : "While supplies last"}</p>` : "";
    return `<article class="product-card" data-id="${escape(product.id)}"><div class="product-media">${badge}${product.discount ? `<span class="save-badge">${product.discount}% OFF</span>` : ""}<img src="${escape(product.image)}" alt="${escape(product.name)}" loading="lazy" /></div><div class="product-info"><p class="product-context">${context}</p><h3 class="product-title">${escape(product.name)}</h3><p class="product-spec">${escape(specFor(product))}</p><div class="rating">${product.reviews ? `<b>★★★★★</b> ${product.rating.toFixed(1)} (${product.reviews})` : "New · No reviews yet"}</div><div class="prices"><span class="price">${money(product.price)}</span>${product.saving ? `<span class="compare">${money(product.compareAt)}</span><span class="saving">Save ${money(product.saving)}</span>` : ""}</div>${dealLine}<p class="stock-line ${stockClass}">${stock}</p><div class="card-actions"><button class="add-cart" type="button" data-add="${escape(product.id)}">Add to cart</button><a class="view-product" href="${escape(product.url)}" target="_blank" rel="noreferrer" aria-label="View product">↗</a></div></div></article>`;
  }

  function renderApplied() {
    const entries = [];
    if (state.category !== "All") entries.push(["category", state.category]);
    for (const [group,label,options] of filterGroups) {
      for (const value of state[group]) entries.push([`${group}:${value}`, `${label}: ${options.find((item) => item[0] === value)?.[1] || value}`]);
    }
    for (const quick of state.quick) entries.push([`quick:${quick}`, config.quicks.find((item) => item[0] === quick)?.[1] || quick]);
    document.querySelector("#applied").innerHTML = entries.map(([key,label]) => `<button type="button" data-remove="${escape(key)}">${escape(label)} <span>×</span></button>`).join("");
    document.querySelector("#mobileFilterCount").textContent = entries.length ? `(${entries.length})` : "";
  }

  function render() {
    const products = filteredProducts();
    const gridProducts = page === "best" && state.category === "All" && state.sort === "rank" ? products.slice(3) : products;
    const visible = gridProducts.slice(0,state.visible);
    document.querySelector("#resultCount").textContent = `${products.length} products · ${state.category}`;
    document.querySelector("#productGrid").innerHTML = visible.map(card).join("");
    document.querySelector("#empty").hidden = products.length > 0;
    document.querySelector("#productGrid").hidden = products.length === 0;
    document.querySelector("#moreWrap").hidden = products.length === 0;
    document.querySelector("#showing").textContent = `Showing ${Math.min(visible.length + (page === "best" && state.category === "All" && state.sort === "rank" ? 3 : 0), products.length)} of ${products.length}`;
    document.querySelector("#viewMore").hidden = visible.length >= gridProducts.length;
    const top = document.querySelector("#topRanked");
    top.hidden = !(page === "best" && state.category === "All" && state.sort === "rank" && products.length >= 3);
    if (!top.hidden) top.innerHTML = products.slice(0,3).map((product) => `<article class="top-rank-card"><img src="${escape(product.image)}" alt="" /><div><span class="rank">#${product.rank} overall</span><h3>${escape(product.name)}</h3><strong>${money(product.price)}</strong></div></article>`).join("");
    renderApplied();
  }

  function reset() {
    state.category = "All"; state.query = ""; state.visible = 12; state.quick.clear();
    for (const [group] of filterGroups) state[group].clear();
    document.querySelectorAll('[data-filter]').forEach((input) => { input.checked = false; });
    document.querySelectorAll('[data-quick]').forEach((button) => button.classList.remove("is-active"));
    document.querySelectorAll('[data-category]').forEach((button) => button.classList.toggle("is-active", button.dataset.category === "All"));
    document.querySelector("#searchInput").value = "";
    render();
  }

  function toast(message) {
    const element = document.querySelector("#toast");
    window.clearTimeout(toast.timer); element.textContent = message; element.classList.add("is-visible");
    toast.timer = window.setTimeout(() => element.classList.remove("is-visible"),2000);
  }

  function openFilters(open) {
    document.querySelector("#filters").classList.toggle("is-open",open);
    document.querySelector("#drawerBackdrop").classList.toggle("is-open",open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function events() {
    document.addEventListener("click", (event) => {
      const category = event.target.closest("[data-category]");
      if (category) { state.category = category.dataset.category; state.visible = 12; document.querySelectorAll("[data-category]").forEach((button) => button.classList.toggle("is-active",button === category)); render(); }
      const quick = event.target.closest("[data-quick]");
      if (quick) { state.quick.has(quick.dataset.quick) ? state.quick.delete(quick.dataset.quick) : state.quick.add(quick.dataset.quick); quick.classList.toggle("is-active"); state.visible = 12; render(); }
      const clear = event.target.closest("[data-clear]"); if (clear) reset();
      const remove = event.target.closest("[data-remove]");
      if (remove) { const [group,value] = remove.dataset.remove.split(":"); if (group === "category") state.category = "All"; else if (group === "quick") { state.quick.delete(value); document.querySelector(`[data-quick="${CSS.escape(value)}"]`)?.classList.remove("is-active"); } else { state[group].delete(value); const input = document.querySelector(`[data-filter="${CSS.escape(group)}"][value="${CSS.escape(value)}"]`); if (input) input.checked = false; } render(); }
      const add = event.target.closest("[data-add]"); if (add) { state.cart += 1; document.querySelector("#cartCount").textContent = state.cart; toast("Added to prototype cart"); }
      const message = event.target.closest("[data-toast]"); if (message) toast(message.dataset.toast);
      if (event.target.closest("[data-scroll-method]")) document.querySelector("#methodology").scrollIntoView({behavior:"smooth"});
      if (event.target.closest("#mobileFilter")) openFilters(true);
      if (event.target.closest("[data-close-filter],#drawerBackdrop")) openFilters(false);
      if (event.target.closest("#mobileSort")) { document.querySelector("#sortSelect").focus(); document.querySelector("#sortSelect").click(); }
    });
    document.addEventListener("change", (event) => {
      if (event.target.matches("[data-filter]")) { const { filter } = event.target.dataset; event.target.checked ? state[filter].add(event.target.value) : state[filter].delete(event.target.value); state.visible = 12; render(); }
      if (event.target.matches("#sortSelect")) { state.sort = event.target.value; state.visible = 12; render(); }
    });
    document.querySelector("#viewMore").addEventListener("click", () => { state.visible += 12; render(); });
    document.querySelector("#searchForm").addEventListener("submit", (event) => { event.preventDefault(); state.query = document.querySelector("#searchInput").value; state.visible = 12; render(); });
  }

  function startCountdown() {
    if (page !== "flash") return;
    const deadline = new Date("2026-10-01T03:59:00Z").getTime();
    const update = () => {
      const remaining = Math.max(0,deadline - Date.now());
      const values = [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
      document.querySelectorAll("#countdown strong").forEach((node,index) => { node.textContent = String(values[index]).padStart(2,"0"); });
    };
    update(); window.setInterval(update,1000);
  }

  shell(); events(); render(); startCountdown();
})();
