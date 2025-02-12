function waitForElement(selector) {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) {
            return resolve(element);
        }
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function initializePromptSaver(retryCount = 0) {
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 1000;
    try {
        // Try to get the currently focused element, and check if it's a textarea
        let targetInput = document.activeElement;
        if (!targetInput || targetInput.tagName.toLowerCase() !== 'textarea') {
            targetInput = await waitForElement('textarea');
        }

        if (!targetInput && retryCount < MAX_RETRIES) {
            console.log(`Retry ${retryCount + 1}/${MAX_RETRIES} to find a target input field`);
            setTimeout(() => initializePromptSaver(retryCount + 1), RETRY_DELAY);
            return;
        }

        if (!targetInput) {
            console.error('Failed to find a target input field');
            alert('Prompt Saver could not find a text area to insert the prompt. Please reload the page and try again.');
            return;
        }

        console.log('Target input field found');

        // Add the insert button to the parent element of the text area
        const container = targetInput.parentElement;
        const insertBtn = document.createElement('button');
        insertBtn.textContent = '📝 Insert Prompt';
        insertBtn.className = 'prompt-saver-button';
        container.appendChild(insertBtn);

        insertBtn.addEventListener('click', function () {
            chrome.storage.local.get({ prompts: [] }, function (data) {
                if (data.prompts.length === 0) {
                    alert('No saved prompts found. Please save some prompts first.');
                    return;
                }

                const selectorContainer = document.createElement('div');
                selectorContainer.className = 'prompt-selector';

                const select = document.createElement('select');
                select.innerHTML = `
                    <option value="" disabled selected>Select a prompt...</option>
                    ${data.prompts.map((prompt, index) => `
                        <option value="${index}">${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}</option>
                    `).join('')}
                `;

                select.addEventListener('change', function() {
                    const selectedPrompt = data.prompts[this.value];
                    if (selectedPrompt) {
                        targetInput.value = selectedPrompt;
                        targetInput.style.height = 'auto';
                        targetInput.style.height = targetInput.scrollHeight + 'px';
                        targetInput.focus();
                        targetInput.dispatchEvent(new Event('input', { bubbles: true }));
                        selectorContainer.remove();
                    }
                });

                selectorContainer.appendChild(select);
                container.appendChild(selectorContainer);
            });
        });
    } catch (error) {
        console.error('Error initializing Prompt Saver:', error);
        if (retryCount < MAX_RETRIES) {
            setTimeout(() => initializePromptSaver(retryCount + 1), RETRY_DELAY);
        }
    }
}

initializePromptSaver();
