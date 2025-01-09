// Simulate user login status using localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check if the user is logged in on page load
let userName = localStorage.getItem("userName"); // Assume the user's name is stored in localStorage after login

// Product data with unique IDs
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

// Store the filtered products
let filteredProducts = [...products];

// Function to handle search by category or name
function handleSearchOrFilter() {
    const searchBy = document.getElementById("searchBy").value;  // Get selected search criteria (name or category)
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();  // Get the search input

    // Filter products based on the selected criteria and the search input
    if (searchBy === "name") {
        filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchInput));
    } else if (searchBy === "category") {
        filteredProducts = products.filter(product => product.category.toLowerCase().includes(searchInput));
    }

    drawItems();  // Re-render the products after filtering
}

// Attach the search handler to the input field
document.getElementById("searchInput").addEventListener("input", handleSearchOrFilter);

// Function to render products dynamically
function drawItems() {
    const productGrid = document.querySelector("#productGrid");  // Update to match the correct container

    // Clear the existing product grid
    productGrid.innerHTML = "";

    // If no products are found, show a message
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = "<p>No products found</p>";
        return;
    }

    // Dynamically adjust the grid layout
    const columnCount = Math.min(filteredProducts.length, 3); // Max 3 columns
    productGrid.style.display = "grid";
    productGrid.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`; // Set equal column widths
    productGrid.style.gap = "1rem"; // Add spacing between grid items

    // Render each product
    filteredProducts.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("feature", "text-center", "mb-4");
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

        // Add event listener for Add to Cart
        productDiv.querySelector(".add-to-cart-btn").addEventListener("click", () => handleAddToCart(product.id));

        // Add event listener for Favorite
        productDiv.querySelector(".favorite-btn").addEventListener("click", () => handleFavorite(product.id));
    });
}

// Initialize the page with the rendered products
drawItems();  // Call the function to render products

// Handle Add to Cart functionality
function handleAddToCart(index) {
    if (!isLoggedIn) {
        window.location = "register.html"; // Redirect to register page if not logged in
        return;
    }
    toggleCart(index);
}

// Handle Favorite functionality
function handleFavorite(index) {
    if (!isLoggedIn) {
        window.location = "register.html"; // Redirect to register page if not logged in
        return;
    }
    toggleFavorite(index);
}

// Handle Add to Cart toggle and update cart
function toggleCart(id) {
    const product = filteredProducts.find(product => product.id === id);
    const existingProductIndex = cart.findIndex(item => item.id === id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({ id: id, name: product.name, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Store cart in localStorage
    drawItems(); // Re-render products to update "In Cart" button
    updateCartDropdown(); // Update cart in dropdown
}

// Handle Favorite toggle
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Store favorites in localStorage
    drawItems(); // Re-render products to update favorites button
}

// Update header with welcome message
function updateHeader() {
    const welcomeMessage = document.getElementById("welcome-message");
    const usernameSpan = document.getElementById("username");
    const cartLink = document.getElementById("cart-link");
    const logoutLink = document.getElementById("logout-link");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const logoutBtn = document.getElementById("logout-btn");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Check login status
    const userFirstName = localStorage.getItem("userFirstName");
    const userLastName = localStorage.getItem("userLastName");

    if (isLoggedIn) {
        welcomeMessage.style.display = "block";
        usernameSpan.textContent = `${userFirstName} ${userLastName}`;
        cartLink.style.display = "block";
        logoutLink.style.display = "block";
        logoutBtn.style.display = "block";
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        
        // Logout functionality when logout button is clicked
        logoutBtn.addEventListener("click", function () {
            localStorage.clear();  // Clear user data from localStorage
            window.location = "login.html";  // Redirect to login page
        });

    } else {
        welcomeMessage.style.display = "none";
        cartLink.style.display = "none";
        logoutLink.style.display = "none";
        logoutBtn.style.display = "none";
        loginLink.style.display = "block";
        registerLink.style.display = "block";
    }
}

// Toggle Cart dropdown visibility
function toggleCartDropdown() {
    const cartDropdownMenu = document.getElementById("cart-dropdown-menu");
    const isVisible = cartDropdownMenu.style.display === "block";
    cartDropdownMenu.style.display = isVisible ? "none" : "block"; // Toggle visibility
}

// Add event listener to the cart button
const cartLink = document.getElementById("cartDropdown");
if (cartLink) {
    cartLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior
        toggleCartDropdown();  // Toggle dropdown visibility
    });
}

// Function to update cart items in the dropdown
function updateCartDropdown() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear existing items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>No items in the cart</p>";
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("cart-item");
            itemDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <p class="product-name">${item.name}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary increase-quantity">+</button>
                        <span class="mx-2 cart-quantity">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity">-</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);

            // Event listeners for increasing and decreasing quantity
            itemDiv.querySelector(".increase-quantity").addEventListener("click", () => {
                increaseQuantity(item.id);
            });

            itemDiv.querySelector(".decrease-quantity").addEventListener("click", () => {
                decreaseQuantity(item.id);
            });
        });
    }
}

// Function to increase the quantity of an item in the cart
function increaseQuantity(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
        updateCartDropdown(); // Re-render the cart dropdown
    }
}

// Function to decrease the quantity of an item in the cart
function decreaseQuantity(itemId) {
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
    } else if (item && item.quantity === 1) {
        // Remove the item from cart if the quantity is 1 and it is decreased
        cart = cart.filter(cartItem => cartItem.id !== itemId);
        localStorage.setItem("cart", JSON.stringify(cart)); // Update cart in localStorage
    }

    updateCartDropdown(); // Re-render the cart dropdown
    drawItems(); // Re-render products to update "In Cart" button
}

// Initialize page
window.onload = function() {
    updateHeader(); // Update header with login info
    updateCartDropdown(); // Ensure cart items are updated in the dropdown on load
    document.getElementById("cart-dropdown-menu").style.display = "none";
};