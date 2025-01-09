document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the values from the form fields
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Save the user details in localStorage
    localStorage.setItem("userFirstName", firstName);
    localStorage.setItem("userLastName", lastName);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    // Optionally, store "isLoggedIn" status in localStorage
    localStorage.setItem("isLoggedIn", "false");

    // Provide feedback and redirect to the login page
    alert("Registration successful! Please log in.");
    window.location.href = "login.html"; // Redirect to the login page
});
