document
  .getElementById("publicConfessionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("public-message").value.trim();
    const isAnonymous = document.getElementById("anonymous-mode").checked;
    const postPublicButton = document.getElementById("postPublicButton");

    if (!message) {
      alert("Message cannot be empty");
      return;
    }

    postPublicButton.disabled = true;
    postPublicButton.innerHTML = "Posting...";

    const startTime = performance.now(); // Start time

    try {
      const response = await fetch(
        "https://disappeardude.onrender.com/api/messages/public",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: message, // Change 'message' to 'content'
            author: isAnonymous ? "Anonymous" : "User", // Backend expects 'author'
            type: "public", // Ensure 'type' is provided
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      alert("Confession posted successfully!");

      const endTime = performance.now(); // End time
      console.log(
        `Public confession posted in ${(endTime - startTime).toFixed(2)}ms`
      );

      window.location.href = "confessions.html";
    } catch (error) {
      console.error("Error posting confession:", error);
      alert("Failed to post confession. Please try again.");
    } finally {
      postPublicButton.disabled = false;
      postPublicButton.innerHTML = "Post";
    }
  });

// Private Message Form
const privateMessageForm = document.getElementById("privateMessageForm");
const createPrivateButton = document.getElementById("createPrivateButton");
const privateMessageFormContainer = document.getElementById(
  "private-message-form-container"
);
const shareableLinkContainer = document.getElementById(
  "shareable-link-container"
);
const shareableLinkInput = document.getElementById("shareable-link");
const copyLinkButton = document.getElementById("copyLinkButton");
const createAnotherButton = document.getElementById("createAnotherButton");
const expiryTimeDisplay = document.getElementById("expiryTimeDisplay");

if (privateMessageForm) {
  privateMessageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("private-message").value;
    const expiryTime = document.getElementById("expiry-time").value;

    if (!message.trim()) return;

    // Disable button and show loading state
    createPrivateButton.disabled = true;
    createPrivateButton.innerHTML = "Creating...";

    try {
      // Send data to the backend (corrected keys)
      const response = await fetch(
        "https://disappeardude.onrender.com/api/messages/private",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message, // Corrected key: 'content'
            expiryHours: expiryTime, // Corrected key: 'expiryHours'
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Get the generated message ID from the response
        const messageId = data.messageId; // Corrected key: 'messageId'

        // Show shareable link
        privateMessageFormContainer.classList.add("hidden");
        shareableLinkContainer.classList.remove("hidden");

        // Set link in input
        const shareableLink = `${window.location.origin}/message.html?id=${messageId}`;
        shareableLinkInput.value = shareableLink;

        // Update expiry time display
        expiryTimeDisplay.textContent = expiryTime;

        // Reset form
        privateMessageForm.reset();
        createPrivateButton.disabled = false;
        createPrivateButton.innerHTML =
          '<i class="fas fa-paper-plane"></i> Create Secret Message';
      } else {
        throw new Error(data.error || "Failed to create the message.");
      }
    } catch (error) {
      console.error("Error creating private message:", error);
      // Show error message
      createPrivateButton.disabled = false;
      createPrivateButton.innerHTML =
        '<i class="fas fa-paper-plane"></i> Create Secret Message';
      alert("Error creating the message. Please try again.");
    }
  });
}

// Copy link to clipboard
if (copyLinkButton) {
  copyLinkButton.addEventListener("click", () => {
    shareableLinkInput.select();
    document.execCommand("copy");

    // Show copied feedback
    const originalText = copyLinkButton.innerHTML;
    copyLinkButton.innerHTML = '<i class="fas fa-check"></i>';

    setTimeout(() => {
      copyLinkButton.innerHTML = originalText;
    }, 2000);
  });
}

// Create another message
if (createAnotherButton) {
  createAnotherButton.addEventListener("click", () => {
    shareableLinkContainer.classList.add("hidden");
    privateMessageFormContainer.classList.remove("hidden");
  });
}
