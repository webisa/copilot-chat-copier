// ============================
// Configuration
// ============================

// Toggle logging on or off
const ENABLE_LOGGING = false;

// SVG Icons
const COPY_SVG = `
<svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg" class="w-3.5">
    <g id="Group 130">
        <path id="Vector" d="M11.3727 4.91772L6.50783 4.93405C5.91077 4.93606 5.42838 5.4217 5.43039 6.01876L5.44672 10.8836C5.44872 11.4807 5.93436 11.963 6.53142 11.961L11.3963 11.9447C11.9933 11.9427 12.4757 11.4571 12.4737 10.86L12.4574 5.99517C12.4554 5.39811 11.9697 4.91572 11.3727 4.91772Z" fill="currentColor"></path>
        <path id="Vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M6.51001 5.47462C6.21148 5.47562 5.97028 5.71844 5.97128 6.01697L5.98762 10.8818C5.98862 11.1803 6.23144 11.4215 6.52997 11.4205L11.3948 11.4042C11.6933 11.4032 11.9345 11.1604 11.9335 10.8618L11.9172 5.99701C11.9162 5.69848 11.6734 5.45728 11.3748 5.45829L6.51001 5.47462ZM4.89021 6.0206C4.8872 5.12501 5.61079 4.39655 6.50638 4.39354L11.3712 4.37721C12.2668 4.3742 12.9953 5.09779 12.9983 5.99338L13.0146 10.8582C13.0176 11.7538 12.294 12.4823 11.3984 12.4853L6.5336 12.5016C5.63801 12.5046 4.90955 11.781 4.90654 10.8854L4.89021 6.0206Z" fill="currentColor"></path>
        <path id="Vector (Stroke)_2" fill-rule="evenodd" clip-rule="evenodd" d="M2.71357 1.81169C2.59888 1.81207 2.48904 1.858 2.40822 1.93937C2.32739 2.02074 2.2822 2.13088 2.28259 2.24557L2.29892 7.11041C2.29931 7.22509 2.34523 7.33493 2.4266 7.41575C2.50797 7.49658 2.61811 7.54177 2.7328 7.54138L3.27334 7.53957C3.63158 7.53837 3.92296 7.8278 3.92416 8.18604C3.92536 8.54427 3.63593 8.83566 3.27769 8.83686L2.73716 8.83867C2.27841 8.84021 1.83783 8.65945 1.51236 8.33616C1.18689 8.01286 1.00317 7.57351 1.00163 7.11476L0.985299 2.24992C0.983759 1.79117 1.16452 1.3506 1.48782 1.02513C1.81111 0.699651 2.25046 0.515936 2.70921 0.514396L7.57405 0.498064C8.0328 0.496524 8.47337 0.677285 8.79885 1.00058C9.12432 1.32388 9.30804 1.76323 9.30958 2.22198L9.31139 2.76251C9.31259 3.12075 9.02316 3.41213 8.66492 3.41334C8.30669 3.41454 8.0153 3.12511 8.0141 2.76687L8.01229 2.22633C8.0119 2.11165 7.96597 2.00181 7.8846 1.92098C7.80323 1.84016 7.69309 1.79497 7.5784 1.79535L2.71357 1.81169Z" fill="currentColor"></path>
    </g>
</svg>
`;

const CHECK_SVG = `
<svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg" class="w-3.5">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6927 0.292787C14.0833 0.683314 14.0833 1.31648 13.6927 1.70701L5.69275 9.70701C5.30223 10.0975 4.66906 10.0975 4.27854 9.70701L0.278539 5.70701C-0.111986 5.31648 -0.111986 4.68331 0.278539 4.29279C0.669064 3.90226 1.30223 3.90226 1.69275 4.29279L4.98565 7.58568L12.2785 0.292787C12.6691 -0.0977379 13.3022 -0.0977379 13.6927 0.292787Z" fill="currentColor"/>
</svg>
`;

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
 * Creates a button element with specified properties.
 * @param {string} className - CSS classes for the button.
 * @param {string} title - Tooltip text for the button.
 * @param {string} svgContent - SVG icon as innerHTML.
 * @param {Function} onClick - Click event handler.
 * @returns {HTMLButtonElement} - The created button element.
 */
function createButton(className, title, svgContent, onClick) {
    const button = document.createElement('button');
    button.className = className;
    button.type = 'button';
    button.title = title;
    button.innerHTML = svgContent;
    button.onclick = onClick;
    return button;
}

// ============================
// Core Functionality
// ============================

/**
 * Adds copy buttons to all user and AI messages.
 */
function addCopyButtons() {
    log("Attempting to add copy buttons...");

    addCopyButtonsToUserMessages();
    addCopyButtonsToAIMessages();

    // Retry if no messages found
    if (
        document.querySelectorAll('div[data-content="user-message"]').length === 0 &&
        document.querySelectorAll('div[data-content="ai-message"]').length === 0
    ) {
        log("No messages found, retrying...");
        setTimeout(addCopyButtons, 1000);
    }
}

/**
 * Adds copy buttons to user messages.
 */
function addCopyButtonsToUserMessages() {
    const userMessages = document.querySelectorAll('div[data-content="user-message"]');
    log(`Found ${userMessages.length} user messages.`);

    userMessages.forEach((message) => {
        if (!message.querySelector('.user-message-buttons')) {
            log("Adding copy button to user message...");

            const messageContent = message.querySelector('.whitespace-pre-wrap');
            if (!messageContent) return;

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'user-message-buttons';

            // Create copy button
            const copyButton = createButton(
                'relative flex items-center justify-center text-foreground-800 fill-foreground-800 active:text-foreground-600 active:fill-foreground-600 dark:active:text-foreground-650 dark:active:fill-foreground-650 bg-transparent text-xs size-9 rounded-xl before:rounded-xl before:absolute before:inset-0 before:pointer-events-none before:border before:border-transparent before:contrast-more:border-2 outline-2 outline-offset-1 focus-visible:z-[1] focus-visible:outline focus-visible:outline-stroke-900 copy-button',
                'Copy message',
                COPY_SVG,
                () => copyMessage(message, true)
            );

            // Append button to container
            buttonContainer.appendChild(copyButton);

            // Append container to message content
            messageContent.style.position = 'relative';
            messageContent.appendChild(buttonContainer);
            log("Copy button added to user message.");
        }
    });
}

/**
 * Adds copy buttons to AI messages.
 */
function addCopyButtonsToAIMessages() {
    const aiMessages = document.querySelectorAll('div[data-content="ai-message"]');
    log(`Found ${aiMessages.length} AI messages.`);

    aiMessages.forEach((message) => {
        const buttonGroups = message.querySelectorAll(':scope > .flex.gap-2, :scope > div > .flex.gap-2');
        const buttonGroup = buttonGroups[buttonGroups.length - 1];

        if (buttonGroup && !buttonGroup.querySelector('.copy-ai-button')) {
            log("Adding copy button to AI message button group...");

            // Create copy button
            const copyButton = createButton(
                'relative flex items-center justify-center text-foreground-800 fill-foreground-800 active:text-foreground-600 active:fill-foreground-600 dark:active:text-foreground-650 dark:active:fill-foreground-650 bg-transparent hover:bg-black/5 active:bg-black/3 dark:hover:bg-white/8 dark:active:bg-white/5 text-xs size-9 rounded-xl before:rounded-xl before:absolute before:inset-0 before:pointer-events-none before:border before:border-transparent before:contrast-more:border-2 outline-2 outline-offset-1 focus-visible:z-[1] focus-visible:outline focus-visible:outline-stroke-900 copy-ai-button',
                'Copy message',
                COPY_SVG,
                () => copyMessage(message, false)
            );

            // Append button to button group
            buttonGroup.appendChild(copyButton);
            log("Copy button added to AI message button group.");
        }
    });
}

/**
 * Copies the message content to the clipboard.
 * @param {HTMLElement} messageElement - The message element containing the content.
 * @param {boolean} isUserMessage - Flag indicating if the message is from the user.
 */
function copyMessage(messageElement, isUserMessage) {
    let messageText = isUserMessage
        ? getUserMessageText(messageElement)
        : getAIMessageText(messageElement);

    navigator.clipboard.writeText(messageText).then(() => {
        toggleButtonIcon(messageElement, isUserMessage, CHECK_SVG);
        setTimeout(() => {
            toggleButtonIcon(messageElement, isUserMessage, COPY_SVG);
        }, 2000);
    }).catch((error) => {
        log("Clipboard write failed:", error);
    });
}

/**
 * Retrieves the text content from a user message.
 * @param {HTMLElement} messageElement - The user message element.
 * @returns {string} - The text content of the user message.
 */
function getUserMessageText(messageElement) {
    return messageElement.querySelector('.whitespace-pre-wrap')?.textContent.trim() || '';
}

/**
 * Retrieves and formats the text content from an AI message.
 * @param {HTMLElement} messageElement - The AI message element.
 * @returns {string} - The formatted text content of the AI message.
 */
function getAIMessageText(messageElement) {
    const contentDiv = messageElement.querySelector('.space-y-3.break-words');
    return contentDiv ? formatAIContent(contentDiv) : '';
}

/**
 * Toggles the button icon between COPY_SVG and CHECK_SVG.
 * @param {HTMLElement} messageElement - The message element containing the button.
 * @param {boolean} isUserMessage - Flag indicating if the message is from the user.
 * @param {string} svgContent - The SVG content to set as innerHTML.
 */
function toggleButtonIcon(messageElement, isUserMessage, svgContent) {
    const button = isUserMessage
        ? messageElement.querySelector('.copy-button')
        : messageElement.querySelector('.copy-ai-button');

    if (button) {
        button.innerHTML = svgContent;
    }
}

// ============================
// Formatting Functions
// ============================

/**
 * Handles inline formatting for text elements.
 * @param {HTMLElement} element - The element to process.
 * @returns {string} - The formatted text.
 */
function handleInlineFormatting(element) {
    let text = '';

    element.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            switch (node.tagName.toLowerCase()) {
                case 'code':
                    text += `\`${node.textContent.trim()}\``;
                    break;
                case 'strong':
                    text += `**${node.textContent.trim()}**`;
                    break;
                case 'em':
                    text += `*${node.textContent.trim()}*`;
                    break;
                case 'a':
                    const href = node.getAttribute('href');
                    const linkText = node.textContent.trim();
                    text += `[${linkText}](${href})`;
                    break;
                default:
                    text += handleInlineFormatting(node);
            }
        }
    });

    return text;
}

/**
 * Processes a code block element and formats it as a markdown code block.
 * @param {HTMLElement} element - The code block element.
 * @param {string} language - The programming language for syntax highlighting.
 * @returns {string} - The formatted markdown code block.
 */
function processCodeBlock(element, language = '') {
    const code = element.querySelector('code');
    if (code) {
        return language
            ? `\`\`\`${language}\n${code.textContent.trim()}\n\`\`\``
            : `\`\`\`\n${code.textContent.trim()}\n\`\`\``;
    }
    return '';
}

/**
 * Processes a table element and converts it to markdown format.
 * @param {HTMLElement} tableElement - The table element to process.
 * @returns {string} - The formatted markdown table.
 */
function processTable(tableElement) {
    const rows = tableElement.querySelectorAll('tr');
    let markdownTable = [];

    // Process header row
    const headerRow = rows[0];
    if (headerRow) {
        const headers = Array.from(headerRow.querySelectorAll('th'))
            .map(th => th.textContent.trim());
        markdownTable.push(`| ${headers.join(' | ')} |`);
        markdownTable.push(`| ${headers.map(() => '----------').join(' | ')} |`);
    }

    // Process data rows
    Array.from(rows).slice(1).forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'))
            .map(td => td.textContent.trim());
        markdownTable.push(`| ${cells.join(' | ')} |`);
    });

    return markdownTable.join('\n');
}

/**
 * Formats the content of an AI message into markdown.
 * @param {HTMLElement} contentDiv - The content div of the AI message.
 * @returns {string} - The formatted markdown text.
 */
function formatAIContent(contentDiv) {
    let formattedText = [];
    let language = '';

    contentDiv.childNodes.forEach(element => {
        if (element.nodeType === Node.TEXT_NODE) {
            const text = element.textContent.trim();
            if (text) formattedText.push(text);
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            switch (element.tagName.toLowerCase()) {
                case 'p':
                    formattedText.push(handleInlineFormatting(element));
                    break;
                case 'h1':
                    formattedText.push(`# ${element.textContent.trim()}`);
                    break;
                case 'h2':
                    formattedText.push(`## ${element.textContent.trim()}`);
                    break;
                case 'div':
                    if (element.querySelector('table.t-table')) {
                        formattedText.push(processTable(element.querySelector('table.t-table')));
                        break;
                    }

                    if (element.classList.contains('relative') &&
                        element.classList.contains('pb-6') &&
                        element.classList.contains('w-full') &&
                        element.classList.contains('after:border-b')) {
                        formattedText.push('---');
                        break;
                    }

                    const languageSpan = element.querySelector('span.capitalize');
                    if (languageSpan) {
                        language = languageSpan.textContent.trim().toLowerCase();
                    }

                    const pre = element.querySelector('pre');
                    if (pre) {
                        const codeBlock = processCodeBlock(pre, language);
                        if (codeBlock) {
                            formattedText.push(codeBlock);
                            language = '';
                        }
                    }
                    break;
                case 'ul':
                case 'ol':
                    element.querySelectorAll('li').forEach(li => {
                        const liText = handleInlineFormatting(li);
                        formattedText.push(`- ${liText.trim()}`);
                    });
                    break;
                default:
                    formattedText.push(handleInlineFormatting(element));
            }
        }
    });

    return formattedText.join('\n\n');
}

// ============================
// Observer and Initialization
// ============================

/**
 * Observes the chat container for new messages and adds copy buttons accordingly.
 */
function observeChatContainer() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasNewMessage = addedNodes.some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.getAttribute('data-content') === 'user-message' ||
                        node.getAttribute('data-content') === 'ai-message' ||
                        node.querySelector('[data-content="user-message"], [data-content="ai-message"]'))
                );

                if (hasNewMessage) {
                    log('New message detected');
                    setTimeout(addCopyButtons, 100);
                    break;
                }
            }
        }
    });

    const chatContainer = document.querySelector('#__next main');
    if (chatContainer) {
        observer.observe(chatContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-content']
        });
        log('Started observing chat container');
        return true;
    }

    log('Could not find chat container');
    return false;
}

/**
 * Initializes the script by setting up observers and periodic checks.
 */
function initialize() {
    let retryCount = 0;
    const maxRetries = 5;

    /**
     * Attempts to start observing the chat container with retries.
     */
    function tryInitialize() {
        if (!observeChatContainer() && retryCount < maxRetries) {
            retryCount++;
            log(`Retry attempt ${retryCount} of ${maxRetries}`);
            setTimeout(tryInitialize, 1000);
        }
    }

    tryInitialize();

    // Watch for URL changes to reinitialize observers
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            log('URL changed, reinitializing');
            setTimeout(tryInitialize, 1000);
        }
    });

    urlObserver.observe(document, { subtree: true, childList: true });
}

/**
 * Periodically checks for new messages and adds copy buttons.
 */
function periodicCheck() {
    const messages = document.querySelectorAll('div[data-content="user-message"], div[data-content="ai-message"]');
    if (messages.length > 0) {
        addCopyButtons();
    }
}

// ============================
// Message Listener
// ============================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copyConversation") {
        try {
            const tags = request.tags || {
                userOpen: '<UserQuery>',
                userClose: '</UserQuery>',
                aiOpen: '<AIAnswer>',
                aiClose: '</AIAnswer>'
            };

            const messages = document.querySelectorAll('div[data-content="user-message"], div[data-content="ai-message"]');
            let conversation = '';

            messages.forEach((message) => {
                const isUserMessage = message.getAttribute('data-content') === 'user-message';
                let messageText = isUserMessage
                    ? getUserMessageText(message)
                    : getAIMessageText(message);

                if (messageText) {
                    conversation += isUserMessage
                        ? `${tags.userOpen}\n${messageText}\n${tags.userClose}\n\n`
                        : `${tags.aiOpen}\n${messageText}\n${tags.aiClose}\n\n`;
                }
            });

            // Create and focus a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            textarea.value = conversation.trim();
            document.body.appendChild(textarea);
            textarea.focus();

            // Try the Clipboard API first
            navigator.clipboard.writeText(conversation.trim())
                .then(() => {
                    document.body.removeChild(textarea);
                    sendResponse({ success: true });
                })
                .catch((error) => {
                    // If Clipboard API fails, try the selection method
                    try {
                        textarea.select();
                        const success = document.execCommand('copy');
                        document.body.removeChild(textarea);
                        if (success) {
                            sendResponse({ success: true });
                        } else {
                            throw new Error('execCommand copy failed');
                        }
                    } catch (fallbackError) {
                        log("All copy methods failed:", error, fallbackError);
                        document.body.removeChild(textarea);
                        sendResponse({ 
                            success: false, 
                            error: "Could not copy to clipboard. Please try again."
                        });
                    }
                });

            return true; // Indicates that the response is sent asynchronously
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
});

// ============================
// Initialization Calls
// ============================

// Initial setup
addCopyButtons();

// Start observing for DOM changes
initialize();

// Set up periodic checking every 5 seconds
setInterval(periodicCheck, 5000);
