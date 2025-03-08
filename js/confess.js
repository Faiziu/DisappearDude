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
        "http://localhost:5000/api/messages/public",
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

document
  .getElementById("privateMessageForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("private-message").value;
    const expiryTime = document.getElementById("expiry-time").value;

    if (!message.trim()) return alert("Message cannot be empty");

    const createPrivateButton = document.getElementById("createPrivateButton");
    createPrivateButton.disabled = true;
    createPrivateButton.innerHTML = "Creating...";

    const startTime = performance.now(); // Start time

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages/private",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: message, // ✅ Change `message` to `content`
            expiryHours: Number(expiryTime), // ✅ Change `expiryTime` to `expiryHours` and convert to Number
          }),
        }
      );
      const data = await response.json();
      alert("Private message created!");

      const endTime = performance.now(); // End time
      console.log(
        `Private message created in ${(endTime - startTime).toFixed(2)}ms`
      );

      // Show shareable link
      const shareableLink = `${window.location.origin}/message.html?id=${data.messageId}`;
      console.log(shareableLink);
      document.getElementById("shareable-link").value = shareableLink;
    } catch (error) {
      console.error("Error creating private message:", error);
    } finally {
      createPrivateButton.disabled = false;
      createPrivateButton.innerHTML = "Create Secret Message";
    }
  });
