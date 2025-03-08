// Main JavaScript file for shared functionality

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle")
    const navLinks = document.getElementById("navLinks")
  
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active")
  
        // Toggle icon between bars and X
        const icon = menuToggle.querySelector("i")
        if (icon.classList.contains("fa-bars")) {
          icon.classList.remove("fa-bars")
          icon.classList.add("fa-times")
        } else {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      })
    }
  
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll(".password-toggle")
  
    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", function () {
        const passwordInput = this.parentElement.querySelector("input")
        const icon = this.querySelector("i")
  
        if (passwordInput.type === "password") {
          passwordInput.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          passwordInput.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  
    // Tab functionality
    const tabButtons = document.querySelectorAll(".tab-button")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab")
  
        // Remove active class from all tabs and content
        document.querySelectorAll(".tab-button").forEach((btn) => {
          btn.classList.remove("active")
        })
  
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })
  
        // Add active class to clicked tab and corresponding content
        this.classList.add("active")
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  })
  
  // Helper functions
  function formatDate(date) {
    const now = new Date()
    const diff = Math.floor((now - new Date(date)) / 1000) // Difference in seconds
  
    if (diff < 60) {
      return "just now"
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diff < 604800) {
      const days = Math.floor(diff / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else {
      const options = { year: "numeric", month: "short", day: "numeric" }
      return new Date(date).toLocaleDateString(undefined, options)
    }
  }
  
  // Local storage helpers
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  
  function getFromLocalStorage(key) {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  
  // Generate a random ID
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  // Get URL parameters
  function getUrlParameter(name) {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]")
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    const results = regex.exec(location.search)
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
  }
  document.addEventListener("DOMContentLoaded", function () {
    const authButtons = document.querySelector(".auth-buttons");
    const logoutButton = document.createElement("a");
    logoutButton.href = "#";
    logoutButton.classList.add("btn", "btn-danger");
    logoutButton.textContent = "Logout";

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        // User is logged in: Hide Sign In & Sign Up, Show Logout
        authButtons.innerHTML = "";
        authButtons.appendChild(logoutButton);
    }

    // Logout functionality
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("user"); // Remove user session
        window.location.href = "index.html"; // Redirect to home page
    });
});
  
