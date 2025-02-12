chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['prompts'], (data) => {
        if (!data.prompts || data.prompts.length === 0) {
            const defaultPrompts = [
                "Please explain this in simple terms.",
                "What are the pros and cons of this?",
                "Can you provide some examples?"
            ];
            chrome.storage.local.set({ prompts: defaultPrompts });
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PROMPTS') {
        chrome.storage.local.get(['prompts'], (result) => {
            sendResponse({ prompts: result.prompts || [] });
        });
        return true;
    }
});
