// ============================
// Configuration
// ============================

// Toggle logging on or off
const ENABLE_LOGGING = false;

// Default tags for conversation formatting
const DEFAULT_TAGS = {
  userOpen: '<User>',
  userClose: '</User>',
  aiOpen: '<Copilot>',
  aiClose: '</Copilot>'
};

// ============================
// Utility Functions
// ============================

/**
 * Logs messages to the console if logging is enabled.
 * @param  {...any} args - Messages or data to log.
 */
function log(...args) {
  if (ENABLE_LOGGING) {
    console.log(...args);
  }
}

/**
 * Retrieves an element by its ID.
 * @param {string} id - The ID of the element.
 * @returns {HTMLElement} - The DOM element with the specified ID.
 */
function getElement(id) {
  return document.getElementById(id);
}

/**
 * Displays a status message to the user.
 * @param {string} message - The message to display.
 * @param {number} [duration=2000] - Duration in milliseconds to display the message.
 */
function displayStatus(message, duration = 2000) {
  const statusElement = getElement('status');
  if (statusElement) {
    statusElement.textContent = message;
    if (duration > 0) {
      setTimeout(() => {
        statusElement.textContent = '';
      }, duration);
    }
  }
}

// ============================
// Tag Management
// ============================

/**
 * Loads saved tags from localStorage or uses default tags.
 * Also updates the input fields in the popup UI.
 * @returns {Object} - The loaded or default tags.
 */
function loadTags() {
  const tags = {};
  Object.keys(DEFAULT_TAGS).forEach(key => {
    tags[key] = localStorage.getItem(key) || DEFAULT_TAGS[key];
    const inputElement = getElement(key);
    if (inputElement) {
      inputElement.value = tags[key];
    }
  });
  log('Tags loaded:', tags);
  return tags;
}

/**
 * Saves the current tags from input fields to localStorage.
 */
function saveTags() {
  const tags = {};
  Object.keys(DEFAULT_TAGS).forEach(key => {
    const inputElement = getElement(key);
    if (inputElement) {
      tags[key] = inputElement.value;
      localStorage.setItem(key, inputElement.value);
    }
  });
  log('Tags saved:', tags);
}

/**
 * Resets all tags to their default values and updates the UI.
 */
function resetTags() {
  Object.keys(DEFAULT_TAGS).forEach(key => {
    const inputElement = getElement(key);
    if (inputElement) {
      inputElement.value = DEFAULT_TAGS[key];
      localStorage.setItem(key, DEFAULT_TAGS[key]);
    }
  });
  log('Tags reset to defaults:', DEFAULT_TAGS);
  displayStatus('Tags reset to defaults!', 2000);
}

// ============================
// Event Handlers
// ============================

/**
 * Handles the copy button click event.
 * Sends a message to the active tab to copy the conversation with current tags.
 */
async function handleCopyButtonClick() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) {
    displayStatus('Error: No active tab found.');
    return;
  }

  const tags = {};
  Object.keys(DEFAULT_TAGS).forEach(key => {
    const inputElement = getElement(key);
    tags[key] = inputElement ? inputElement.value : DEFAULT_TAGS[key];
  });

  try {
    // First focus the tab
    await chrome.tabs.update(tab.id, { active: true });
    
    // Then send the copy message
    chrome.tabs.sendMessage(tab.id, { 
      action: "copyConversation",
      tags: tags
    }, (response) => {
      if (chrome.runtime.lastError) {
        log('Runtime error:', chrome.runtime.lastError);
        displayStatus('Error: Unable to communicate with the tab.');
        return;
      }

      if (response && response.success) {
        displayStatus('Conversation copied!');
      } else {
        displayStatus(response?.error || 'Error: Could not copy conversation');
      }
    });
  } catch (err) {
    log('Error sending message:', err);
    displayStatus('Error: Could not copy conversation');
  }
}

// ============================
// Initialization
// ============================

/**
 * Initializes the popup by loading tags and setting up event listeners.
 */
function initializePopup() {
  loadTags();

  // Save tags when inputs change
  Object.keys(DEFAULT_TAGS).forEach(key => {
    const inputElement = getElement(key);
    if (inputElement) {
      inputElement.addEventListener('change', saveTags);
    }
  });

  // Reset tags button
  const resetButton = getElement('resetTags');
  if (resetButton) {
    resetButton.addEventListener('click', (e) => {
      e.preventDefault();
      resetTags();
    });
  }

  // Copy conversation button
  const copyButton = getElement('copyButton');
  if (copyButton) {
    copyButton.addEventListener('click', handleCopyButtonClick);
  }

  log('Popup initialized.');
}

// Execute initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePopup);
