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

  // Load message from backend
  function loadMessage() {
    // Show loading state
    loadingCard.classList.remove("hidden");
    errorCard.classList.add("hidden");
    messageCard.classList.add("hidden");

    // Fetch message data from backend
    fetch(`https://disappeardude.onrender.com/api/messages/private/${messageId}`) // Fix endpoint here
      .then((response) => {
        // Check for 410 status - resource is gone
        if (response.status === 410) {
          errorMessage.textContent =
            "This message has been permanently deleted.";
          errorCard.classList.remove("hidden");
          return; // Exit if the message is gone
        }

        return response.json();
      })
      .then((data) => {
        // Hide loading state
        loadingCard.classList.add("hidden");

        if (!data || !data.message) {
          // Show error if message not found
          errorCard.classList.remove("hidden");
          errorMessage.textContent = "Message not found.";
          return;
        }

        const message = data.message;

        // Check if message has expired
        const expiryDate = new Date(message.expiresAt);
        if (expiryDate < new Date()) {
          // Message has expired
          errorMessage.textContent = "This message has expired.";
          errorCard.classList.remove("hidden");

          // Optionally, delete expired message from backend (if supported)
          // Remove this part if you do not want auto deletion
          // fetch(`http://localhost:5000/api/messages/delete/${messageId}`, {
          //   method: "DELETE",
          // });

          return;
        }

        // Check if message has been viewed
        if (message.viewed) {
          // Message has already been viewed
          errorMessage.textContent = "This message has already been viewed.";
          errorCard.classList.remove("hidden");
          return;
        }

        // Show message card
        messageCard.classList.remove("hidden");

        // Set up countdown timer
        initCountdown(expiryDate);
      })
      .catch((error) => {
        console.error("Error loading message:", error);
        // Show error message
        loadingCard.classList.add("hidden");
        errorMessage.textContent = "Failed to load the message.";
        errorCard.classList.remove("hidden");
      });
  }

  // Initialize countdown timer
  function initCountdown(targetDate) {
    function updateCountdown() {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        // Timer has expired
        countdown.innerHTML = "Expired";
        return;
      }

      // Calculate time units
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Format time units
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      // Update countdown HTML
      countdown.innerHTML = `
          <div class="countdown-unit">
            <div class="countdown-value">${formattedHours}</div>
            <div class="countdown-label">Hours</div>
          </div>
          <div class="countdown-separator">:</div>
          <div class="countdown-unit">
            <div class="countdown-value">${formattedMinutes}</div>
            <div class="countdown-label">Minutes</div>
          </div>
          <div class="countdown-separator">:</div>
          <div class="countdown-unit">
            <div class="countdown-value">${formattedSeconds}</div>
            <div class="countdown-label">Seconds</div>
          </div>
        `;
    }

    // Update immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Store interval ID to clear it later
    window.countdownInterval = countdownInterval;
  }

  // Handle view message button click
  if (viewMessageButton) {
    viewMessageButton.addEventListener("click", () => {
      // Fetch the message data again
      fetch(`https://disappeardude.onrender.com/api/messages/private/${messageId}`) // Fix endpoint here
        .then((response) => response.json())
        .then((data) => {
          const message = data.message;
          if (message) {
            // If message is gone, do not try to mark as viewed
            if (message.status === 410) {
              errorMessage.textContent =
                "This message has been permanently deleted.";
              errorCard.classList.remove("hidden");
              return;
            }

            // Mark message as viewed
            fetch(`https://disappeardude.onrender.com/api/messages/private/${messageId}`, {
              method: "PATCH",
            });

            // Show message content
            lockedMessage.classList.add("hidden");
            countdownContainer.classList.add("hidden");
            messageContent.classList.remove("hidden");
            messageContent.textContent = message.content;

            // Update title and description
            messageTitle.textContent = "Secret Message";
            messageDescription.textContent =
              "This message has been deleted from our servers and can't be viewed again.";

            // Hide view button, show return home button
            viewMessageButton.classList.add("hidden");
            returnHomeButton.classList.remove("hidden");

            // Clear countdown interval
            if (window.countdownInterval) {
              clearInterval(window.countdownInterval);
            }
          }
        })
        .catch((error) => {
          console.error("Error viewing message:", error);
          // Handle errors (e.g., network failure)
        });
    });
  }

  // Load message on page load
  if (messageId) {
    loadMessage();
  } else {
    // No message ID provided
    loadingCard.classList.add("hidden");
    errorCard.classList.remove("hidden");
    errorMessage.textContent = "No message ID provided.";
  }
});
