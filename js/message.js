document.addEventListener("DOMContentLoaded", async () => {
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

  // Load message from API
  async function loadMessage() {
    if (!messageId) {
      showError("No message ID provided.");
      return;
    }

    loadingCard.classList.remove("hidden");
    errorCard.classList.add("hidden");
    messageCard.classList.add("hidden");

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${messageId}`
      );
      if (!response.ok) throw new Error("Message not found.");

      const message = await response.json();
      loadingCard.classList.add("hidden");

      if (new Date(message.expiresAt) < new Date()) {
        showError("This message has expired.");
        return;
      }

      if (message.viewed) {
        showError("This message has already been viewed.");
        return;
      }

      messageCard.classList.remove("hidden");
      initCountdown(new Date(message.expiresAt));
    } catch (error) {
      showError(error.message);
    }
  }

  // Show error message
  function showError(msg) {
    loadingCard.classList.add("hidden");
    errorCard.classList.remove("hidden");
    errorMessage.textContent = msg;
  }

  // Countdown Timer
  function initCountdown(targetDate) {
    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        countdown.innerHTML = "Expired";
        return;
      }

      const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(
        2,
        "0"
      );
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      countdown.innerHTML = `${hours}:${minutes}:${seconds}`;
    }

    updateCountdown();
    window.countdownInterval = setInterval(updateCountdown, 1000);
  }

  // View Message Button
  if (viewMessageButton) {
    viewMessageButton.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/messages/view/${messageId}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) throw new Error("Failed to mark as viewed.");

        const message = await response.json();

        lockedMessage.classList.add("hidden");
        countdownContainer.classList.add("hidden");
        messageContent.classList.remove("hidden");
        messageContent.textContent = message.content;
        messageTitle.textContent = "Secret Message";
        messageDescription.textContent =
          "This message has been deleted from our servers.";
        viewMessageButton.classList.add("hidden");
        returnHomeButton.classList.remove("hidden");

        if (window.countdownInterval) clearInterval(window.countdownInterval);
      } catch (error) {
        showError(error.message);
      }
    });
  }

  // Load message on page load
  loadMessage();
});
