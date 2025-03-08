// Authentication related functionality

// Helper functions for local storage
function saveToLocalStorage(key, value) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error("Error saving to local storage:", error)
    }
  }
  
  function getFromLocalStorage(key) {
    try {
      const serializedValue = localStorage.getItem(key)
      if (serializedValue === null) {
        return undefined
      }
      return JSON.parse(serializedValue)
    } catch (error) {
      console.error("Error getting from local storage:", error)
      return undefined
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Sign In Form
    const signinForm = document.getElementById("signinForm")
    const signinButton = document.getElementById("signinButton")
    const googleSignin = document.getElementById("googleSignin")
    const anonymousAccess = document.getElementById("anonymousAccess")
  
    if (signinForm) {
      signinForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
  
        // Disable button and show loading state
        signinButton.disabled = true
        signinButton.textContent = "Signing in..."
  
        // Simulate authentication
        setTimeout(() => {
          // In a real app, you would make an API call to authenticate
          const user = {
            email,
            name: email.split("@")[0],
            isAuthenticated: true,
          }
  
          // Save user to local storage
          saveToLocalStorage("user", user)
  
          // Redirect to home page
          window.location.href = "index.html"
        }, 1500)
      })
    }
  
    // Sign Up Form
    const signupForm = document.getElementById("signupForm")
    const signupButton = document.getElementById("signupButton")
    const googleSignup = document.getElementById("googleSignup")
  
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault()
  
        const username = document.getElementById("username").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
  
        // Disable button and show loading state
        signupButton.disabled = true
        signupButton.textContent = "Creating account..."
  
        // Simulate registration
        setTimeout(() => {
          // In a real app, you would make an API call to register
          const user = {
            email,
            name: username,
            isAuthenticated: true,
          }
  
          // Save user to local storage
          saveToLocalStorage("user", user)
  
          // Redirect to home page
          window.location.href = "index.html"
        }, 1500)
      })
    }
  
    // Google Authentication
    if (googleSignin) {
      googleSignin.addEventListener("click", function () {
        // Disable button and show loading state
        this.disabled = true
  
        // Simulate Google authentication
        setTimeout(() => {
          // In a real app, you would use Google OAuth
          const user = {
            email: "user@example.com",
            name: "Google User",
            isAuthenticated: true,
          }
  
          // Save user to local storage
          saveToLocalStorage("user", user)
  
          // Redirect to home page
          window.location.href = "index.html"
        }, 1500)
      })
    }
  
    if (googleSignup) {
      googleSignup.addEventListener("click", function () {
        // Disable button and show loading state
        this.disabled = true
  
        // Simulate Google authentication
        setTimeout(() => {
          // In a real app, you would use Google OAuth
          const user = {
            email: "user@example.com",
            name: "Google User",
            isAuthenticated: true,
          }
  
          // Save user to local storage
          saveToLocalStorage("user", user)
  
          // Redirect to home page
          window.location.href = "index.html"
        }, 1500)
      })
    }
  
    // Anonymous Access
    if (anonymousAccess) {
      anonymousAccess.addEventListener("click", () => {
        // Save anonymous user to local storage
        const anonymousUser = {
          isAnonymous: true,
          name: "Anonymous",
          isAuthenticated: false,
        }
  
        saveToLocalStorage("user", anonymousUser)
  
        // Redirect to confessions page
        window.location.href = "confessions.html"
      })
    }
  
    // Check if user is logged in
    function checkAuth() {
      const user = getFromLocalStorage("user")
  
      if (user && (user.isAuthenticated || user.isAnonymous)) {
        // Update UI for logged in user
        const authButtons = document.querySelector(".auth-buttons")
  
        if (authButtons) {
          authButtons.innerHTML = `
            <span class="nav-link">Hello, ${user.name}</span>
            <button id="logoutButton" class="btn btn-ghost">Logout</button>
          `
  
          // Add logout functionality
          document.getElementById("logoutButton").addEventListener("click", () => {
            localStorage.removeItem("user")
            window.location.reload()
          })
        }
      }
    }
  
    // Check authentication status on page load
    checkAuth()
  })
  document.getElementById("signupForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Store user in local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Signup successful!");
        window.location.href = "index.html"; // Redirect to home page
    } else {
        alert(data.message || "Signup failed. Please try again.");
    }
});

// Handle login similarly
document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert(data.message || "Login failed. Please try again.");
    }
});