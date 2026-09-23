(() => {
  "use strict";

  const catalog = window.GARVEE_DEMO_DATA;
  if (!catalog || !Array.isArray(catalog.products)) {
    document.body.innerHTML = "<p style='padding:2rem;font-family:sans-serif'>Catalog data is unavailable.</p>";
    return;
  }

  const products = catalog.products;
  const categoryNames = [
    "Home & Furniture",
    "Toys & Games",
    "Rugs",
    "Agriculture & Forestry",
    "Automotive",
    "Restaurant & Food Service",
    "Air Conditioners",
    "Material Handling",
    "Sports & Outdoors",
    "Power & Hand Tools",
    "Lawn & Garden",
  ].sort((a, b) => (catalog.categorySales[b] || 0) - (catalog.categorySales[a] || 0));

  const modeCopy = {
    trending: {
      title: "Trending new arrivals",
      description: "Recently added products ranked by their last 30 days of demo sales.",
    },
    newest: {
      title: "The newest of the new",
      description: "Every available arrival ordered by its catalog launch date.",
    },
    deals: {
      title: "Fresh arrivals, better prices",
      description: "Recently added products ordered by the discount between current and compare-at price.",
    },
    reviews: {
      title: "New arrivals shoppers talk about",
      description: "Recently added products ordered by their visible lifetime review count.",
    },
  };

  const state = {
    category: "All",
    mode: "trending",
    days: 30,
    visible: 10,
    query: "",
    cart: 0,
  };

  const els = {
    heroShell: document.querySelector("#heroShell"),
    heroStage: document.querySelector("#heroStage"),
    heroDots: document.querySelector("#heroDots"),
    heroPrev: document.querySelector("#heroPrev"),
    heroNext: document.querySelector("#heroNext"),
    heroClose: document.querySelector("#heroClose"),
    heroRestore: document.querySelector("#heroRestore"),
    categoryRail: document.querySelector("#categoryRail"),
    categoryPrev: document.querySelector("#categoryPrev"),
    categoryNext: document.querySelector("#categoryNext"),
    rankingTabs: document.querySelector("#rankingTabs"),
    timeFilter: document.querySelector("#timeFilter"),
    productGrid: document.querySelector("#productGrid"),
    resultEyebrow: document.querySelector("#resultEyebrow"),
    catalogTitle: document.querySelector("#catalogTitle"),
    catalogDescription: document.querySelector("#catalogDescription"),
    resultCount: document.querySelector("#resultCount"),
    showingCount: document.querySelector("#showingCount"),
    viewMore: document.querySelector("#viewMore"),
    endMessage: document.querySelector("#endMessage"),
    moreWrap: document.querySelector("#moreWrap"),
    emptyState: document.querySelector("#emptyState"),
    resetFilters: document.querySelector("#resetFilters"),
    searchForm: document.querySelector("#searchForm"),
    searchInput: document.querySelector("#searchInput"),
    mobileSearchInput: document.querySelector("#mobileSearchInput"),
    clearSearch: document.querySelector("#clearSearch"),
    cartButton: document.querySelector("#cartButton"),
    cartCount: document.querySelector("#cartCount"),
    dataNoteButton: document.querySelector("#dataNoteButton"),
    dataDialog: document.querySelector("#dataDialog"),
    dataDialogClose: document.querySelector("#dataDialogClose"),
    dataDialogDone: document.querySelector("#dataDialogDone"),
    dataDialogCopy: document.querySelector("#dataDialogCopy"),
    snapshotDate: document.querySelector("#snapshotDate"),
    newsletterForm: document.querySelector("#newsletterForm"),
    toast: document.querySelector("#toast"),
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function discountFor(product) {
    if (!product.compareAt || product.compareAt <= product.price) return 0;
    return Math.round(((product.compareAt - product.price) / product.compareAt) * 100);
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  }

  function launchDate(product) {
    const snapshot = new Date(`${catalog.snapshotDate}T12:00:00`);
    snapshot.setDate(snapshot.getDate() - product.addedDays);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(snapshot);
  }

  function showToast(message) {
    window.clearTimeout(showToast.timer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    showToast.timer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
  }

  function categoryImage(category) {
    const product = products.find((item) => item.category === category) || products[categoryNames.indexOf(category) % products.length];
    return product ? product.image : products[0].image;
  }

  function renderCategories() {
    const allCard = `
      <button class="category-card category-all${state.category === "All" ? " is-active" : ""}" type="button" role="tab" aria-selected="${state.category === "All"}" data-category="All">
        <span>All new arrivals</span>
      </button>`;
    const cards = categoryNames.map((category) => `
      <button class="category-card${state.category === category ? " is-active" : ""}" type="button" role="tab" aria-selected="${state.category === category}" data-category="${escapeHtml(category)}">
        <img src="${categoryImage(category)}" alt="" loading="lazy" />
        <span>${escapeHtml(category)}</span>
      </button>`).join("");
    els.categoryRail.innerHTML = allCard + cards;
  }

  function getFilteredProducts() {
    const query = state.query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const categoryMatch = state.category === "All" || product.category === state.category;
      const timeMatch = state.mode === "newest" || product.addedDays <= state.days;
      const queryMatch = !query || `${product.name} ${product.category} ${product.subcategory}`.toLowerCase().includes(query);
      return categoryMatch && timeMatch && queryMatch && product.inventory > 0;
    });

    return filtered.sort((a, b) => {
      if (state.mode === "newest") return a.addedDays - b.addedDays || b.reviews - a.reviews;
      if (state.mode === "deals") return discountFor(b) - discountFor(a) || b.sold30 - a.sold30;
      if (state.mode === "reviews") return b.reviews - a.reviews || b.rating - a.rating || a.addedDays - b.addedDays;
      return b.sold30 - a.sold30 || a.addedDays - b.addedDays;
    });
  }

  function reasonFor(product) {
    if (state.mode === "newest") return `Added ${launchDate(product)}`;
    if (state.mode === "deals") return discountFor(product) ? `Save ${discountFor(product)}%` : "New at current price";
    if (state.mode === "reviews") return product.reviews ? `${product.reviews.toLocaleString()} customer reviews` : "Be the first to review";
    return `${product.sold30.toLocaleString()} sold in the last 30 days`;
  }

  function ratingMarkup(product) {
    if (!product.reviews) return `<span class="new-rating">New · no reviews yet</span>`;
    return `<span class="stars" aria-hidden="true">★★★★★</span><strong>${product.rating.toFixed(1)}</strong><span>(${product.reviews})</span>`;
  }

  function productCard(product, index) {
    const discount = discountFor(product);
    const trendBadge = state.mode === "trending" && index < 3 ? `<span class="badge badge-hot">Trending #${index + 1}</span>` : "";
    const dealBadge = discount >= 30 ? `<span class="badge badge-deal">Deal</span>` : "";
    const newBadge = product.addedDays <= 7 ? `<span class="badge">Just added</span>` : "";
    const inventory = product.inventory <= 10
      ? `<strong class="low">Only ${product.inventory} left</strong>`
      : `<strong>In stock</strong>`;

    return `
      <article class="product-card" style="animation-delay:${Math.min(index, 9) * 24}ms">
        <div class="product-media">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="${index < 10 ? "eager" : "lazy"}" width="720" height="720" />
          <div class="badge-stack">${trendBadge}${dealBadge}${newBadge}</div>
        </div>
        <div class="product-meta">
          <p class="product-reason">${reasonFor(product)}</p>
          <h3 class="product-title"><button class="product-detail" type="button" data-product="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button></h3>
          <div class="rating-row" aria-label="${product.reviews ? `Rated ${product.rating} out of 5 from ${product.reviews} reviews` : "No reviews yet"}">${ratingMarkup(product)}</div>
          <div class="price-row">
            <span class="price">${formatMoney(product.price)}</span>
            ${discount ? `<span class="compare-price">${formatMoney(product.compareAt)}</span><span class="discount">-${discount}%</span>` : ""}
          </div>
          <div class="stock-row">${inventory}<br />Estimated delivery ${escapeHtml(product.delivery)}</div>
          <div class="card-actions">
            <button class="add-cart" type="button" data-add="${escapeHtml(product.id)}">Add to cart</button>
            <button class="product-link product-detail" type="button" data-product="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.name)}"><svg><use href="#icon-arrow"></use></svg></button>
          </div>
        </div>
      </article>`;
  }

  function updateControlStates() {
    els.rankingTabs.querySelectorAll("[data-mode]").forEach((button) => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const newest = state.mode === "newest";
    els.timeFilter.classList.toggle("is-disabled", newest);
    els.timeFilter.setAttribute("aria-disabled", String(newest));
    els.timeFilter.querySelectorAll("[data-days]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.days) === state.days);
      button.disabled = newest;
    });
  }

  function renderProducts() {
    const items = getFilteredProducts();
    const visible = items.slice(0, state.visible);
    const copy = modeCopy[state.mode];
    const categoryCopy = state.category === "All" ? "All categories" : state.category;
    const periodCopy = state.mode === "newest" ? "All launch dates" : `Within ${state.days} days`;

    els.resultEyebrow.textContent = `${categoryCopy} · ${periodCopy}`;
    els.catalogTitle.textContent = copy.title;
    els.catalogDescription.textContent = copy.description;
    els.resultCount.innerHTML = `<strong>${items.length}</strong> available product${items.length === 1 ? "" : "s"}${state.query ? ` matching “${escapeHtml(state.query)}”` : ""}`;
    els.productGrid.innerHTML = visible.map(productCard).join("");
    els.emptyState.hidden = items.length > 0;
    els.moreWrap.hidden = items.length === 0;
    els.showingCount.textContent = `Showing ${visible.length} of ${items.length} products`;
    els.viewMore.hidden = visible.length >= items.length;
    els.endMessage.hidden = !items.length || visible.length < items.length;
    els.clearSearch.hidden = !state.query;
    updateControlStates();
    renderCategories();
  }

  function resetVisible() {
    state.visible = 10;
  }

  function setQuery(value) {
    state.query = value;
    els.searchInput.value = value;
    els.mobileSearchInput.value = value;
    resetVisible();
    renderProducts();
  }

  const heroCandidates = [
    products.find((item) => item.category === "Lawn & Garden"),
    products.find((item) => item.category === "Home & Furniture"),
    products.find((item) => item.category === "Automotive"),
  ].filter(Boolean);

  const heroSlides = heroCandidates.map((product, index) => ({
    product,
    kicker: ["A fresh way to grow", "Room for better living", "Built for the next project"][index],
    title: ["New season. New reasons to get outside.", "Smart upgrades just landed.", "Fresh gear, ready when you are."][index],
    copy: ["Discover practical garden arrivals designed to make every weekend count.", "Bring home useful pieces with a little more function and a lot less fuss.", "Explore newly added automotive essentials for workdays and weekends."][index],
    background: ["#eee9df", "#f0e8e5", "#e7eceb"][index],
  }));

  let activeSlide = 0;
  let heroTimer = null;
  let touchStartX = 0;

  function renderHero() {
    els.heroStage.innerHTML = heroSlides.map((slide, index) => `
      <article class="hero-slide${index === activeSlide ? " is-active" : ""}" style="--slide-bg:${slide.background}" aria-hidden="${index !== activeSlide}">
        <div class="hero-copy">
          <p class="hero-kicker">${escapeHtml(slide.kicker)}</p>
          <h2 data-pretext>${escapeHtml(slide.title)}</h2>
          <p>${escapeHtml(slide.copy)}</p>
          <button class="hero-cta" type="button" data-hero-category="${escapeHtml(slide.product.category)}">Shop ${escapeHtml(slide.product.category)} <svg><use href="#icon-arrow"></use></svg></button>
        </div>
        <div class="hero-product"><img src="${slide.product.image}" alt="${escapeHtml(slide.product.name)}" /><span class="hero-price">${formatMoney(slide.product.price)}</span></div>
      </article>`).join("");
    els.heroDots.innerHTML = heroSlides.map((_, index) => `<button class="hero-dot${index === activeSlide ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === activeSlide}" data-slide="${index}" aria-label="Show featured slide ${index + 1}"></button>`).join("");
  }

  function showSlide(index) {
    activeSlide = (index + heroSlides.length) % heroSlides.length;
    renderHero();
  }

  function startHeroTimer() {
    window.clearInterval(heroTimer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || els.heroShell.hidden) return;
    heroTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
  }

  function isHeroSuppressed() {
    try {
      const closedAt = Number(localStorage.getItem("garvee-new-arrivals-hero-closed"));
      return closedAt && Date.now() - closedAt < 24 * 60 * 60 * 1000;
    } catch (_) {
      return false;
    }
  }

  function setHeroVisibility(visible) {
    els.heroShell.hidden = !visible;
    els.heroRestore.hidden = visible;
    if (visible) startHeroTimer();
    else window.clearInterval(heroTimer);
  }

  els.heroPrev.addEventListener("click", () => { showSlide(activeSlide - 1); startHeroTimer(); });
  els.heroNext.addEventListener("click", () => { showSlide(activeSlide + 1); startHeroTimer(); });
  els.heroDots.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slide]");
    if (!button) return;
    showSlide(Number(button.dataset.slide));
    startHeroTimer();
  });
  els.heroStage.addEventListener("click", (event) => {
    const button = event.target.closest("[data-hero-category]");
    if (!button) return;
    state.category = button.dataset.heroCategory;
    state.mode = "trending";
    resetVisible();
    renderProducts();
    document.querySelector(".filter-sticky").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.heroShell.addEventListener("mouseenter", () => window.clearInterval(heroTimer));
  els.heroShell.addEventListener("mouseleave", startHeroTimer);
  els.heroShell.addEventListener("focusin", () => window.clearInterval(heroTimer));
  els.heroShell.addEventListener("focusout", startHeroTimer);
  els.heroStage.addEventListener("touchstart", (event) => { touchStartX = event.touches[0].clientX; }, { passive: true });
  els.heroStage.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 45) showSlide(activeSlide + (distance < 0 ? 1 : -1));
    startHeroTimer();
  }, { passive: true });
  els.heroClose.addEventListener("click", () => {
    try { localStorage.setItem("garvee-new-arrivals-hero-closed", String(Date.now())); } catch (_) {}
    setHeroVisibility(false);
  });
  els.heroRestore.querySelector("button").addEventListener("click", () => {
    try { localStorage.removeItem("garvee-new-arrivals-hero-closed"); } catch (_) {}
    setHeroVisibility(true);
  });

  els.categoryRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    resetVisible();
    renderProducts();
  });
  els.categoryPrev.addEventListener("click", () => els.categoryRail.scrollBy({ left: -520, behavior: "smooth" }));
  els.categoryNext.addEventListener("click", () => els.categoryRail.scrollBy({ left: 520, behavior: "smooth" }));

  els.rankingTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    state.mode = button.dataset.mode;
    resetVisible();
    renderProducts();
  });
  els.timeFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-days]");
    if (!button || state.mode === "newest") return;
    state.days = Number(button.dataset.days);
    resetVisible();
    renderProducts();
  });

  els.productGrid.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      const product = products.find((item) => item.id === addButton.dataset.add);
      state.cart += 1;
      els.cartCount.textContent = state.cart;
      els.cartButton.setAttribute("aria-label", `Cart with ${state.cart} item${state.cart === 1 ? "" : "s"}`);
      showToast(`${product ? product.name.split(",")[0] : "Item"} added to the demo cart.`);
      return;
    }
    const detailButton = event.target.closest("[data-product]");
    if (detailButton) showToast("Product detail links are unavailable in this offline prototype.");
  });

  els.viewMore.addEventListener("click", () => {
    state.visible += 10;
    renderProducts();
  });
  els.resetFilters.addEventListener("click", () => {
    state.category = "All";
    state.mode = "trending";
    state.days = 30;
    setQuery("");
  });
  els.clearSearch.addEventListener("click", () => setQuery(""));
  els.searchForm.addEventListener("submit", (event) => { event.preventDefault(); setQuery(els.searchInput.value); document.querySelector(".catalog-heading").scrollIntoView({ behavior: "smooth" }); });
  els.searchInput.addEventListener("input", (event) => setQuery(event.target.value));
  els.mobileSearchInput.addEventListener("input", (event) => setQuery(event.target.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      (window.innerWidth < 768 ? els.mobileSearchInput : els.searchInput).focus();
    }
  });

  els.cartButton.addEventListener("click", () => showToast(state.cart ? `${state.cart} demo item${state.cart === 1 ? "" : "s"} in cart. Checkout is not included.` : "Your demo cart is empty."));
  document.querySelectorAll(".offline-link").forEach((button) => button.addEventListener("click", () => showToast("This navigation is visual only in the offline prototype.")));

  els.dataNoteButton.addEventListener("click", () => els.dataDialog.showModal());
  els.dataDialogClose.addEventListener("click", () => els.dataDialog.close());
  els.dataDialogDone.addEventListener("click", () => els.dataDialog.close());
  els.dataDialog.addEventListener("click", (event) => { if (event.target === els.dataDialog) els.dataDialog.close(); });
  els.dataDialogCopy.textContent = catalog.dataNote;
  els.snapshotDate.textContent = new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(`${catalog.snapshotDate}T12:00:00`));
  els.newsletterForm.addEventListener("submit", (event) => { event.preventDefault(); event.currentTarget.reset(); showToast("Thanks. Signup is simulated in this offline prototype."); });

  function setupPretext() {
    const api = window.Pretext;
    if (!api || typeof api.prepare !== "function" || typeof api.layout !== "function") return;
    const prepared = new Map();

    const prepareElement = (element) => {
      const style = getComputedStyle(element);
      prepared.set(element, api.prepare(element.textContent, style.font));
    };
    const relayout = () => {
      prepared.forEach((handle, element) => {
        const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
        api.layout(handle, element.clientWidth, Number.isFinite(lineHeight) ? lineHeight : 20);
      });
    };

    document.querySelectorAll("[data-pretext]").forEach((element) => {
      prepareElement(element);
      if (element.contentEditable === "true") {
        new MutationObserver(() => { prepareElement(element); relayout(); }).observe(element, { characterData: true, subtree: true, childList: true });
      }
    });
    new ResizeObserver(relayout).observe(document.body);
    relayout();
  }

  if (window.matchMedia("(max-width: 767px)").matches) {
    document.querySelectorAll(".footer-grid details").forEach((detail) => detail.removeAttribute("open"));
  }

  renderHero();
  renderProducts();
  setHeroVisibility(!isHeroSuppressed());
  document.fonts.ready.then(setupPretext);
})();
