import { BASE_AUTH_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const inputFields = document.querySelectorAll(".form-control");
  const passwordField = document.getElementById("password");
  const eyeIcon = document.getElementById("togglePasswordVisibility");

  // Clear error message on input
  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      document.getElementById("error-message").style.display = "none";
    });
  });

  // Toggle password visibility
  if (eyeIcon) {
    eyeIcon.addEventListener("click", () => {
      if (passwordField.type === "password") {
        passwordField.type = "text";
        eyeIcon.style.color = "rgb(111, 0, 255)";
      } else {
        passwordField.type = "password";
        eyeIcon.style.color = "rgb(204, 204, 204)";
      }
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await loginUser(email, password);

        if (!response.error) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem(
            "username",
            `${response.data.firstName} ${response.data.lastName}`
          );
          localStorage.setItem("isAdmin", response.data.isAdmin);

          window.location.href = "../client/home.html";
        } else {
          displayError("Invalid email or password");
        }
      } catch (error) {
        displayError("An error occurred during login. Please try again.");
        console.error("Login error:", error);
      }
    });
  } else {
    console.error("Login form not found");
  }
});

async function loginUser(email, password) {
  try {
    const response = await fetch(`${BASE_AUTH_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return {
        error: true,
        message: "Invalid email or password",
      };
    }
  } catch (error) {
    return { error: true, message: "Invalid email or password" };
  }
}

function displayError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "block";
  errorMessage.innerHTML = message;
}
