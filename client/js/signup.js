import { BASE_AUTH_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  const inputFields = document.querySelectorAll(".form-control");

  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      document.getElementById("error-message").style.display = "none";
    });
  });

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const passwordError = validatePassword(password);
    if (passwordError) {
      displayError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      displayError("Passwords do not match.");
      return;
    }

    try {
      const response = await signupUser(firstName, lastName, email, password);

      if (!response.error) {
        window.location.href = `../client/login.html`;
      } else {
        displayError(response.message);
      }
    } catch (error) {
      displayError("An error occurred during signup. Please try again.");
      console.error(error);
    }
  });
});

function validatePassword(password) {
  if (password.length < 8) {
    return "Password should be at least 8 characters long.";
  }

  if (password.length > 25) {
    return "Password must not be more than 25 characters long.";
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  return null; // No errors
}

async function signupUser(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${BASE_AUTH_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      return { error: true, message: "Invalid response from server." };
    }

    if (response.ok) {
      return { error: false, ...data };
    } else {
      return { error: true, message: data.message || "Signup failed." };
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return { error: true, message: error.message };
  }
}

function displayError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.color = "red";
  errorMessage.style.display = "block";
  errorMessage.innerHTML = message;
}
