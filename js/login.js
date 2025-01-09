document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    // Get the values from the form fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Get the stored user details from localStorage
    const storedUsername = localStorage.getItem("userEmail"); // You might use email as the "username"
    const storedPassword = localStorage.getItem("userPassword");

    // Check if the entered credentials match the stored data
    if ((username === storedUsername || username === localStorage.getItem("userFirstName")) && password === storedPassword) {
        // Set the user as logged in
        localStorage.setItem("isLoggedIn", "true");

        // Provide feedback and redirect to the homepage (or another page)
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to the homepage or another page after successful login
    } else {
        // Provide error feedback if credentials don't match
        alert("wrong info. Please try again.");
    }
});
