document.addEventListener("DOMContentLoaded", function () {
  enforceAccessControl();
});

function enforceAccessControl() {
  const isAdmin = localStorage.getItem("isAdmin") === "1"; // Admin role
  const token = localStorage.getItem("token"); // Check if user is logged in
  const currentPage = window.location.pathname.split("/").pop(); // Current page

  // Define accessible pages for each role
  const adminPages = ["Movies.html", "Genres.html", "Users.html", "Feedback.html"];
  const publicPages = ["index.html", "login.html", "signup.html"];

  // If the token is invalid or missing, redirect to the login page immediately
  if (!token || token.length < 10) {
    if (!publicPages.includes(currentPage)) {
      console.warn("Invalid token! Please log in.");
      window.location.href = "login.html"; // Redirect to login page
    }
    return; // Prevent further execution
  }

  // Restrict access for non-admin users to admin pages
  if (!isAdmin && adminPages.includes(currentPage)) {
    console.warn("Access denied! You do not have admin privileges.");
    window.location.href = "index.html"; // Redirect to public page
    return;
  }

  // Restrict access for logged-in users to public-only pages
  if (token && publicPages.includes(currentPage)) {
    console.warn("Access denied! You are already logged in.");
    window.location.href = "Movies.html"; // Default page for logged-in users
    return;
  }
}
