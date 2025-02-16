// popup.js

/**
 * popup.js
 * Handles UI interactions, prompt storage (chrome.storage.local), and search/filter functionalities.
 */

const titleInput = document.getElementById("title");
const tagsInput = document.getElementById("tags");
const contentInput = document.getElementById("content");

const savePromptBtn = document.getElementById("savePromptBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const promptList = document.getElementById("promptList");

// Event listener for saving a new prompt
savePromptBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const tags = tagsInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Title and content are required.");
    return;
  }

  // Create a new prompt object
  const newPrompt = {
    id: generateId(),
    title,
    tags: splitTags(tags),
    content,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  // Save to chrome.storage.local
  const storedPrompts = await getStoredPrompts();
  storedPrompts.push(newPrompt);
  await setStoredPrompts(storedPrompts);

  // Clear input fields
  titleInput.value = "";
  tagsInput.value = "";
  contentInput.value = "";

  // Refresh the list
  displayPrompts(storedPrompts);
});

/**
 * Event listener for searching prompts by title or content.
 */
searchBtn.addEventListener("click", async () => {
  const keyword = searchInput.value.trim().toLowerCase();
  const storedPrompts = await getStoredPrompts();
  if (!keyword) {
    displayPrompts(storedPrompts);
    return;
  }

  // Filter prompts by keyword (in title or content)
  const filtered = storedPrompts.filter((p) => {
    return (
      p.title.toLowerCase().includes(keyword) ||
      p.content.toLowerCase().includes(keyword)
    );
  });
  displayPrompts(filtered);
});

/**
 * Clear search input and display all prompts
 */
clearSearchBtn.addEventListener("click", async () => {
  searchInput.value = "";
  const storedPrompts = await getStoredPrompts();
  displayPrompts(storedPrompts);
});

/**
 * Fetch stored prompts from chrome.storage.local
 */
async function getStoredPrompts() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["prompts"], (result) => {
      resolve(result.prompts || []);
    });
  });
}

/**
 * Store the updated list of prompts to chrome.storage.local
 */
async function setStoredPrompts(prompts) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ prompts }, () => {
      resolve();
    });
  });
}

/**
 * Generate a simple unique ID (for demonstration purposes)
 */
function generateId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

/**
 * Split comma-separated tags into an array, trimming whitespace
 */
function splitTags(tagString) {
  if (!tagString) return [];
  return tagString.split(",").map((tag) => tag.trim()).filter(Boolean);
}

/**
 * Display the list of prompts in the popup
 */
function displayPrompts(prompts) {
  promptList.innerHTML = "";

  if (!prompts || prompts.length === 0) {
    promptList.innerHTML = "<p>No prompts found.</p>";
    return;
  }

  prompts.forEach((prompt) => {
    const container = document.createElement("div");
    container.className = "prompt-item";

    const titleEl = document.createElement("h3");
    titleEl.textContent = prompt.title;

    const tagContainer = document.createElement("div");
    if (prompt.tags && prompt.tags.length > 0) {
      prompt.tags.forEach((t) => {
        const tagEl = document.createElement("span");
        tagEl.className = "tag";
        tagEl.textContent = t;
        tagContainer.appendChild(tagEl);
      });
    }

    const contentEl = document.createElement("p");
    contentEl.textContent = prompt.content;

    // Edit form elements (initially hidden)
    const editContainer = document.createElement("div");
    editContainer.className = "hidden";

    const editTitleInput = document.createElement("input");
    editTitleInput.type = "text";
    editTitleInput.value = prompt.title;

    const editTagsInput = document.createElement("input");
    editTagsInput.type = "text";
    editTagsInput.value = prompt.tags.join(", ");

    const editContentTextarea = document.createElement("textarea");
    editContentTextarea.value = prompt.content;

    const saveChangesBtn = document.createElement("button");
    saveChangesBtn.textContent = "Save Changes";
    saveChangesBtn.addEventListener("click", async () => {
      // Update the prompt object
      prompt.title = editTitleInput.value.trim();
      prompt.tags = splitTags(editTagsInput.value.trim());
      prompt.content = editContentTextarea.value.trim();
      prompt.updatedAt = Date.now();

      const storedPrompts = await getStoredPrompts();
      const index = storedPrompts.findIndex((p) => p.id === prompt.id);
      if (index > -1) {
        storedPrompts[index] = prompt;
        await setStoredPrompts(storedPrompts);
        displayPrompts(storedPrompts);
      }
    });

    editContainer.appendChild(editTitleInput);
    editContainer.appendChild(document.createElement("br"));
    editContainer.appendChild(editTagsInput);
    editContainer.appendChild(document.createElement("br"));
    editContainer.appendChild(editContentTextarea);
    editContainer.appendChild(document.createElement("br"));
    editContainer.appendChild(saveChangesBtn);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      if (editContainer.classList.contains("hidden")) {
        editContainer.classList.remove("hidden");
      } else {
        editContainer.classList.add("hidden");
      }
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      const storedPrompts = await getStoredPrompts();
      const updatedPrompts = storedPrompts.filter((p) => p.id !== prompt.id);
      await setStoredPrompts(updatedPrompts);
      displayPrompts(updatedPrompts);
    });

    // Append elements to container
    container.appendChild(titleEl);
    container.appendChild(tagContainer);
    container.appendChild(contentEl);
    container.appendChild(editBtn);
    container.appendChild(deleteBtn);
    container.appendChild(editContainer);

    promptList.appendChild(container);
  });
}

/**
 * Initialize the popup by loading stored prompts
 */
async function init() {
  const storedPrompts = await getStoredPrompts();
  displayPrompts(storedPrompts);
}

// Run init when popup is opened
init();
