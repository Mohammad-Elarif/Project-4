// Simulate user login status using localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check if the user is logged in on page load
let userFirstName = localStorage.getItem("userFirstName"); // Assume the user's first name is stored in localStorage
let userLastName = localStorage.getItem("userLastName"); // Assume the user's last name is stored in localStorage

// Product data with unique IDs starting from 0
const products = [
    { id: 0, name: "bag 1", price: 10, category: "Apparel", image: "images/p1.jpg" },
    { id: 1, name: "bag 2", price: 20, category: "Apparel", image: "images/p2.jpg" },
    { id: 2, name: "shoes", price: 30, category: "Apparel", image: "images/p3.jpg" },
    { id: 3, name: "earpods", price: 40, category: "Electronics", image: "images/p4.jpg" },
    { id: 4, name: "cap", price: 50, category: "Apparel", image: "images/p5.jpg" },
    { id: 5, name: "jacket", price: 60, category: "Apparel", image: "images/p6.jpg" },
    { id: 6, name: "sunglasses", price: 70, category: "Apparel", image: "images/p7.jpg" },
    { id: 7, name: "T-Shirt", price: 80, category: "Apparel", image: "images/p8.jpg" },
    { id: 8, name: "shoes 2", price: 90, category: "Apparel", image: "images/p9.jpg" }
];

// Initialize cart and favorites (stored in localStorage)
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Render products dynamically on the homepage
function renderProducts(products) {
    const productGrid = document.querySelector(".features.row.mt-5");

    if (!productGrid) {
        console.error("Product grid container not found");
        return;
    }

    productGrid.innerHTML = "";

    if (products.length === 0) {
        productGrid.innerHTML = "<p>No products found</p>";
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("feature", "col-sm-6", "col-md-4", "text-center", "mb-4");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="img-fluid mb-3 product-image">
            <h2>${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <div class="d-flex justify-content-between">
                <button class="btn btn-primary add-to-cart-btn">${cart.some(item => item.id === product.id) ? "In Cart" : "Add to Cart"}</button>
                <button class="btn btn-outline-secondary favorite-btn">
                    <i class="${favorites.includes(product.id) ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart"}"></i>
                </button>
            </div>
        `;
        productGrid.appendChild(productDiv);

        productDiv.querySelector(".add-to-cart-btn").addEventListener("click", () => handleAddToCart(product.id));
        productDiv.querySelector(".favorite-btn").addEventListener("click", () => handleFavorite(product.id));
    });
}

// Handle Add to Cart functionality with login check
function handleAddToCart(productId) {
    if (!isLoggedIn) {
        window.location = "register.html"; // Redirect to register page if not logged in
        return;
    }
    toggleCart(productId); // Pass productId
}

// Handle Favorite functionality with login check
function handleFavorite(index) {
    if (!isLoggedIn) {
        window.location = "register.html"; // Redirect to register page if not logged in
        return;
    }
    toggleFavorite(index);
}

// Handle Add to Cart toggle and update cart
function toggleCart(productId) {
    const product = products.find(p => p.id === productId); // Find the product by its unique ID
    const existingProductIndex = cart.findIndex(item => item.id === productId); // Use productId to check if it’s already in the cart

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: productId, name: product.name, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Store cart in localStorage
    renderProducts(products); // Re-render products to update "In Cart" button
    updateCartPage();
}


// Handle Favorite toggle
function toggleFavorite(index) {
    if (favorites.includes(index)) {
        favorites = favorites.filter(item => item !== index);
    } else {
        favorites.push(index);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Store favorites in localStorage
    renderProducts(products);
}

// Update Cart Page content
function updateCartPage() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartItemsContainer || !totalPriceElement) return;

    cartItemsContainer.innerHTML = ""; // Clear the container
    let totalPrice = 0;

    if (cart.length === 0) {
        // Show an empty cart message
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty.";
        cartItemsContainer.appendChild(emptyMessage);
        totalPriceElement.textContent = "0";
        return; // Exit early if the cart is empty
    }

    // Populate the cart with items
    cart.forEach(item => {
        const product = products[item.id];
        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item", "d-flex", "justify-content-between", "align-items-center", "mb-3");

        cartItemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="img-fluid" width="50" />
            <div class="cart-item-details">
                <h4>${product.name}</h4>
                <p>Price: $${product.price}</p>
                <p>Quantity: 
                    <button class="btn btn-sm btn-outline-secondary minus-btn" data-id="${item.id}">-</button>
                    ${item.quantity}
                    <button class="btn btn-sm btn-outline-secondary plus-btn" data-id="${item.id}">+</button>
                </p>
            </div>
            <button class="btn btn-danger remove-item-btn" data-id="${item.id}">Remove</button>
        `;

        cartItemsContainer.appendChild(cartItemDiv);

        totalPrice += product.price * item.quantity;

        // Add event listener to the "Remove" button
        cartItemDiv.querySelector(".remove-item-btn").addEventListener("click", () => removeCartItem(item.id));

        // Add event listeners to plus and minus buttons
        cartItemDiv.querySelector(".plus-btn").addEventListener("click", () => changeQuantity(item.id, 1));
        cartItemDiv.querySelector(".minus-btn").addEventListener("click", () => changeQuantity(item.id, -1));
    });

    // Update the total price
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Change the quantity of the item in the cart
function changeQuantity(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;

        // Ensure the quantity doesn't go below 1
        if (cart[itemIndex].quantity <= 0) {
            cart[itemIndex].quantity = 1;
        }

        localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
        updateCartPage(); // Re-render the cart with updated quantities
    }
}


// Remove item from cart
function removeCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
    updateCartPage(); // Re-render the cart
}

// Initialize cart page with existing items
if (document.getElementById("cart-items")) {
    updateCartPage();
}

// Render products on homepage if container exists
if (document.querySelector(".features.row.mt-5")) {
    renderProducts(products);
}

// Update Favourites Section with Carousel
function updateFavouritesPage() {
    const favouritesItemsContainer = document.getElementById("favourites-items");

    if (!favouritesItemsContainer) {
        console.error("Favourites container not found.");
        return;
    }

    favouritesItemsContainer.innerHTML = ""; // Clear previous content

    if (favorites.length === 0) {
        favouritesItemsContainer.innerHTML = ` 
            <div class="carousel-item active">
                <div class="text-center">
                    <p>No favourites added yet.</p>
                </div>
            </div>
        `;
        return;
    }

    favorites.forEach((productId, index) => {
        const product = products[productId];
        const carouselItemDiv = document.createElement("div");
        carouselItemDiv.classList.add("carousel-item");
        if (index === 0) carouselItemDiv.classList.add("active");

        carouselItemDiv.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%;">
                <img src="${product.image}" alt="${product.name}" class="d-block w-100" />
                <div class="carousel-overlay">
                    <h5>${product.name}</h5>
                    <p>Price: $${product.price}</p>
                </div>
            </div>
        `;

        favouritesItemsContainer.appendChild(carouselItemDiv);
    });
}


// Initialize Favorites Carousel if container exists
if (document.getElementById("favourites-items")) {
    updateFavouritesPage();
}

// Update the header with the user's name if logged in
function updateHeader() {
    const welcomeMessage = document.getElementById("welcome-message");
    const usernameSpan = document.getElementById("username");
    const logoutBtn = document.getElementById("logout-btn");

    if (isLoggedIn) {
        welcomeMessage.style.display = "block";
        usernameSpan.textContent = `${userFirstName} ${userLastName}`;
        logoutBtn.style.display = "inline-block";
    } else {
        welcomeMessage.style.display = "none";
        logoutBtn.style.display = "none";
    }
}

// Logout functionality
document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.setItem("isLoggedIn", "false");
    window.location = "login.html"; // Redirect to login page
});

// Initialize the header
updateHeader();
