document.addEventListener("DOMContentLoaded", () => {
  const categoriesEl = document.getElementById('categories');
  const priceRange = document.getElementById('priceRange');
  const priceMaxEl = document.getElementById('priceMax');
  const sortBy = document.getElementById('sortBy');
  const productsGrid = document.getElementById('productsGrid');
  const search = document.getElementById('search');
  const resultsSummary = document.getElementById('resultsSummary');
  const clearFilters = document.getElementById('clearFilters');

  // ✅ Local JSON data (no fetch needed)
  const products = [
    { name: "Wireless Headphones", category: "Electronics", price: 99, rating: 4.5, popularity: 8, image: "wireless-headphones-icon-realistic-illustration-wireless-headphones-vector-icon-web-design-isolated-white-background_98396-10065.jpg" },
    { name: "Smartwatch", category: "Electronics", price: 149, rating: 4.2, popularity: 9, image: "modern-sport-smartwatch-fitness-bracelet-gym-workouts_1323048-60721.jpg" },
    { name: "Leather Jacket", category: "Fashion", price: 199, rating: 4.7, popularity: 10, image: "realistic-jacket-leather-black-brown-collection-white-background-vector-illustration_33869-2339.jpg" },
    { name: "Sofa Set", category: "Home", price: 499, rating: 4.0, popularity: 7, image: "modern-interior-with-yellow-sofa_1441-3957.jpg" },
    { name: "Sneakers", category: "Fashion", price: 89, rating: 4.3, popularity: 6, image: "color-sport-sneaker_98292-3191.jpg" },
    { name: "Coffee Maker", category: "Home", price: 129, rating: 4.1, popularity: 5, image: "coffee-machine-realistic-composition-with-stylish-red-model-brewing-hot-drinks-with-cup-reflection-vector-illustration_1284-68520.jpg" },
    { name: "Bluetooth Speaker", category: "Electronics", price: 59, rating: 4.6, popularity: 9, image: "realistic-black-bluetooth-speaker-with-power-blue-lead_62391-99.jpg" },
    { name: "Handbag", category: "Fashion", price: 79, rating: 4.4, popularity: 8, image: "ladies-bag-cartoon-vector_889056-145043.jpg" },
    { name: "Table Lamp", category: "Home", price: 39, rating: 4.0, popularity: 4, image: "vector-house-interior-with-white-armchair-black-floor-lamp-red-book-violet-wall-front-view_1284-48469.jpg" },
    { name: "Gaming Keyboard", category: "Electronics", price: 119, rating: 4.8, popularity: 10, image: "gaming-rgb-mechanical-keyboard-isometric-view_648778-552.jpg" }
  ];

  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)) / 10) * 10;
  priceRange.max = maxPrice;
  priceRange.value = maxPrice;
  priceMaxEl.textContent = maxPrice;

  function renderCategories() {
    categoriesEl.innerHTML = '';
    categories.forEach(cat => {
      const label = document.createElement('label');
      label.className = 'checkbox';
      label.innerHTML = `<input type="checkbox" value="${cat}" checked> ${cat}`;
      categoriesEl.appendChild(label);
    });
  }

  function getActiveCategories() {
    return Array.from(categoriesEl.querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
  }

  function applyFilters() {
    const q = search.value.toLowerCase();
    const activeCats = getActiveCategories();
    const maxP = +priceRange.value;

    let filtered = products.filter(p =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!activeCats.length || activeCats.includes(p.category)) &&
      p.price <= maxP
    );

    const s = sortBy.value;
    if (s === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (s === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (s === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);
    else if (s === 'popularity-desc') filtered.sort((a, b) => b.popularity - a.popularity);

    renderProducts(filtered);
  }

  function renderProducts(filtered) {
    productsGrid.innerHTML = '';
    if (!filtered.length) {
      productsGrid.innerHTML = '<div class="empty">No products found.</div>';
      resultsSummary.textContent = '0 results';
      return;
    }
    resultsSummary.textContent = `${filtered.length} products`;
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="title">${p.name}</div>
        <div class="meta"><span class="badge">${p.category}</span><span class="price">$${p.price}</span></div>
        <div class="rating">${'★'.repeat(Math.round(p.rating))}<span style="color:#999"> (${p.rating})</span></div>
        <div class="actions">
          <button class="action view">View</button>
          <button class="action add">Add to cart</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  search.addEventListener('input', debounce(applyFilters, 200));
  categoriesEl.addEventListener('change', applyFilters);
  priceRange.addEventListener('input', () => {
    priceMaxEl.textContent = priceRange.value;
    applyFilters();
  });
  sortBy.addEventListener('change', applyFilters);
  clearFilters.addEventListener('click', () => {
    categoriesEl.querySelectorAll('input[type=checkbox]').forEach(i => i.checked = true);
    search.value = '';
    priceRange.value = priceRange.max;
    priceMaxEl.textContent = priceRange.max;
    sortBy.value = 'default';
    applyFilters();
  });

  function debounce(fn, ms) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  }

  renderCategories();
  applyFilters();
});
