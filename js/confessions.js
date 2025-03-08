document.addEventListener("DOMContentLoaded", () => {
  const confessionsLoading = document.getElementById("confessionsLoading");
  const confessionsFeed = document.getElementById("confessionsFeed");
  const noConfessionsFound = document.getElementById("noConfessionsFound");
  const searchInput = document.getElementById("searchConfessions");

  const API_URL = "https://disappeardude.onrender.com/api/messages/public";

  function formatDate(createdAt) {
    if (!createdAt) return "Unknown";

    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
    if (hours > 0) return hours === 1 ? "An hour ago" : `${hours} hours ago`;
    if (minutes > 0)
      return minutes === 1 ? "A minute ago" : `${minutes} minutes ago`;
    return "Just now";
  }

  function getInitials(name) {
    if (!name || typeof name !== "string") return "A";
    return name.charAt(0).toUpperCase();
  }

  async function loadConfessions(searchQuery = "") {
    try {
      confessionsLoading.classList.remove("hidden");
      confessionsFeed.classList.add("hidden");
      noConfessionsFound.classList.add("hidden");

      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("✅ API Response:", data);

      if (!data.success) throw new Error("API response was not successful");

      let confessions = data.messages;

      // Filter based on search input
      if (searchQuery) {
        confessions = confessions.filter((confession) =>
          confession.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      renderConfessions(confessions);
    } catch (error) {
      console.error("❌ Error fetching confessions:", error);
    } finally {
      confessionsLoading.classList.add("hidden");
    }
  }

  function renderConfessions(confessions) {
    confessionsFeed.innerHTML = "";

    if (confessions.length === 0) {
      noConfessionsFound.classList.remove("hidden");
      confessionsFeed.classList.add("hidden");
      return;
    }

    noConfessionsFound.classList.add("hidden");
    confessionsFeed.classList.remove("hidden");

    const template = document.getElementById("confessionCardTemplate");

    confessions.forEach((confession) => {
      const card = document.importNode(template.content, true);
      card.querySelector(".confession-content").textContent =
        confession.content;
      card.querySelector(".author-name").textContent =
        confession.author || "Anonymous";
      card.querySelector(".confession-time").textContent = formatDate(
        confession.createdAt
      ); // ✅ FIXED
      card.querySelector(".like-count").textContent = confession.likes || 0;
      card.querySelector(".comment-count").textContent = confession.comments
        ? confession.comments.length
        : 0;
      card.querySelector(".avatar-text").textContent = getInitials(
        confession.author
      );

      card
        .querySelector(".like-button")
        .addEventListener("click", () => handleLike(confession._id));
      card
        .querySelector(".share-button")
        .addEventListener("click", () => handleShare(confession._id));

      confessionsFeed.appendChild(card);
    });
  }

  async function handleLike(_id) {
    try {
      console.log("Liking message ID:", _id); // Debugging log

      const response = await fetch(
        `https://disappeardude.onrender.com/api/messages/${_id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();
      console.log("API Response:", result); // Debugging log

      if (!response.ok)
        throw new Error(result.message || "Failed to like the confession");

      loadConfessions(); // Refresh UI
    } catch (error) {
      console.error("❌ Error liking confession:", error);
    }
  }

  function handleShare(id) {
    const shareableLink = `${window.location.origin}/confessions.html?id=${id}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Could not copy text: ", err));
  }

  // Debounced Search Handling
  let debounceTimeout;
  searchInput.addEventListener("input", (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      loadConfessions(event.target.value);
    }, 300);
  });

  loadConfessions();
});
