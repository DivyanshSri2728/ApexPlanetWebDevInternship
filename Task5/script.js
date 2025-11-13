// === PRODUCT DATA ===
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/main2_b66dce6b-710d-49cb-9d1c-2bc8c9c0ab15_1875x.png?v=1645698328"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 4999,
    image: "https://www.jiomart.com/images/product/original/rvc3uqboi7/savvy-bucket-t500-smart-watch-1-3-full-touch-men-women-smartwatch-black-strap-freesize-product-images-orvc3uqboi7-p599130187-0-202303081021.jpg?im=Resize=(420,420)"
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Fashion",
    price: 2999,
    image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/30577225/2025/2/5/a19c0276-3672-47cd-82a7-81ad6f8f22fb1738761642840-Puma-Unisex-Conduct-Pro-Running-Shoes-8321738761642558-1.jpg"
  },
  {
    id: 4,
    name: "Backpack",
    category: "Fashion",
    price: 1999,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwvdrl0Pw0IrIMpPXaR48ExMotUXZI4gr6A&s"
  },
  {
    id: 5,
    name: "Coffee Maker",
    category: "Home",
    price: 3499,
    image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1721863797-cuisinart-coffee-center-barista-bar-4-in-1-coffeemaker-wit-o.jpg?crop=1xw:1xh;center,top&resize=980:*"
  },
  {
    id: 6,
    name: "Desk Lamp",
    category: "Home",
    price: 1499,
    image: "https://m.media-amazon.com/images/I/71D2YNJoNNL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: 7,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 2799,
    image: "https://m.media-amazon.com/images/I/71hvGkBMFNL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: 8,
    name: "Sunglasses",
    category: "Fashion",
    price: 999,
    image: "https://eyejack.in/cdn/shop/files/17001pcl746-1.jpg?v=1745665948"
  }
];

// === ELEMENTS ===
const productGrid = document.getElementById("productGrid");
const categoriesList = document.getElementById("categories");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const themeToggle = document.getElementById("themeToggle");

let cart = [];
let currentCategory = "All";

// === RENDER PRODUCTS ===
function renderProducts(filteredProducts = products) {
  productGrid.innerHTML = "";
  filteredProducts.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product");
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="meta">
        <div class="title">${p.name}</div>
        <div class="price">₹${p.price}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// === RENDER CATEGORIES ===
function renderCategories() {
  const uniqueCats = ["All", ...new Set(products.map(p => p.category))];
  categoriesList.innerHTML = "";

  uniqueCats.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    if (cat === currentCategory) li.classList.add("active");

    li.addEventListener("click", () => {
      document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
      li.classList.add("active");

      currentCategory = cat;
      const filtered = cat === "All" ? products : products.filter(p => p.category === cat);
      renderProducts(filtered);
    });

    categoriesList.appendChild(li);
  });
}

// === SEARCH ===
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

// === SORT ===
sortSelect.addEventListener("change", () => {
  let sorted = [...products];
  if (sortSelect.value === "low") sorted.sort((a, b) => a.price - b.price);
  else if (sortSelect.value === "high") sorted.sort((a, b) => b.price - a.price);
  renderProducts(sorted);
});

// === CART SYSTEM ===
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        ₹${item.price} × ${item.qty}
      </div>
      <button onclick="changeQty(${item.id}, -1)">−</button>
      <button onclick="changeQty(${item.id}, 1)">+</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  cartTotal.textContent = total.toLocaleString();
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    updateCart();
  }
}

cartBtn.addEventListener("click", () => cartPanel.classList.add("open"));
closeCart.addEventListener("click", () => cartPanel.classList.remove("open"));
checkoutBtn.addEventListener("click", () => alert("Checkout successful!"));

// === THEME TOGGLE ===
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// === INITIALIZE ===
renderProducts();
renderCategories();