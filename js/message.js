document.addEventListener("DOMContentLoaded", () => {
  const loadingCard = document.getElementById("loadingCard");
  const errorCard = document.getElementById("errorCard");
  const messageCard = document.getElementById("messageCard");
  const lockedMessage = document.getElementById("lockedMessage");
  const messageContent = document.getElementById("messageContent");
  const viewMessageButton = document.getElementById("viewMessageButton");
  const returnHomeButton = document.getElementById("returnHomeButton");
  const messageTitle = document.getElementById("messageTitle");
  const messageDescription = document.getElementById("messageDescription");
  const errorMessage = document.getElementById("errorMessage");
  const countdownContainer = document.getElementById("countdownContainer");
  const countdown = document.getElementById("countdown");

  // Get message ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const messageId = urlParams.get("id");

  if (!messageId) {
    showError("No message ID provided.");
    return;
  }

  const API_URL = `https://disappeardude.onrender.com/api/messages/private/${messageId}`;

  function showError(message) {
    loadingCard.classList.add("hidden");
    errorCard.classList.remove("hidden");
    errorMessage.textContent = message;
  }

  function loadMessage() {
    loadingCard.classList.remove("hidden");
    errorCard.classList.add("hidden");
    messageCard.classList.add("hidden");

    fetch(API_URL)
      .then((response) => {
        console.log("Response status:", response.status);
        if (response.status === 410) {
          throw new Error("This message has been permanently deleted.");
        }
        return response.json();
      })
      .then((data) => {
        loadingCard.classList.add("hidden");

        if (!data?.message) {
          throw new Error("Message not found.");
        }

        const message = data.message;
        const expiryDate = new Date(message.expiresAt);

        if (expiryDate < new Date()) {
          throw new Error("This message has expired.");
        }

        if (message.viewed) {
          throw new Error("This message has already been viewed.");
        }

        messageCard.classList.remove("hidden");
        initCountdown(expiryDate);
      })
      .catch((error) => {
        console.error("Error loading message:", error.message);
        showError(error.message);
      });
  }

  function initCountdown(targetDate) {
    function updateCountdown() {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        countdown.innerHTML = "Expired";
        clearInterval(window.countdownInterval);
        return;
      }

      const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
      const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0");
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, "0");

      countdown.innerHTML = `
        <div class="countdown-unit"><div class="countdown-value">${hours}</div><div class="countdown-label">Hours</div></div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit"><div class="countdown-value">${minutes}</div><div class="countdown-label">Minutes</div></div>
        <div class="countdown-separator">:</div>
        <div class="countdown-unit"><div class="countdown-value">${seconds}</div><div class="countdown-label">Seconds</div></div>
      `;
    }

    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
  }

  function viewMessage() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (!data?.message) {
          throw new Error("Message not found.");
        }

        if (data.message.status === 410) {
          throw new Error("This message has been permanently deleted.");
        }

        fetch(API_URL, { method: "PATCH" });

        lockedMessage.classList.add("hidden");
        countdownContainer.classList.add("hidden");
        messageContent.classList.remove("hidden");
        messageContent.textContent = data.message.content;

        messageTitle.textContent = "Secret Message";
        messageDescription.textContent = "This message has been deleted from our servers and can't be viewed again.";

        viewMessageButton.classList.add("hidden");
        returnHomeButton.classList.remove("hidden");

        if (window.countdownInterval) {
          clearInterval(window.countdownInterval);
        }
      })
      .catch((error) => {
        console.error("Error viewing message:", error.message);
        showError(error.message);
      });
  }

  if (viewMessageButton) {
    viewMessageButton.addEventListener("click", viewMessage);
  }

  loadMessage();
});

