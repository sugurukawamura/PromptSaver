document.addEventListener('DOMContentLoaded', function () {
    const promptInput = document.getElementById('promptInput');
    const saveButton = document.getElementById('savePrompt');
    const promptList = document.getElementById('promptList');

    function loadPrompts() {
        chrome.storage.local.get({ prompts: [] }, function (data) {
            promptList.innerHTML = '';
            data.prompts.forEach((prompt, index) => {
                const li = document.createElement('li');
                li.textContent = prompt;
                li.className = 'prompt-item';
                promptList.appendChild(li);
            });
        });
    }

    saveButton.addEventListener('click', function () {
        const newPrompt = promptInput.value;
        if (newPrompt) {
            chrome.storage.local.get({ prompts: [] }, function (data) {
                const updatedPrompts = [...data.prompts, newPrompt];
                chrome.storage.local.set({ prompts: updatedPrompts }, loadPrompts);
                promptInput.value = '';
            });
        }
    });

    loadPrompts();
});
