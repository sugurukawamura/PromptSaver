# Prompt Saver

Prompt Saver is a Chrome extension designed to help you save, manage, and quickly insert prompts into any text area on a web page. Whether you're writing emails, filling out forms, or composing messages, this tool allows you to keep your favorite prompts handy.

## Features

- **Prompt Management**  
  Easily add, view, and manage your saved prompts via the extension's popup.

- **Universal Text Area Insertion**  
  Automatically detects text areas on any website and adds an "Insert Prompt" button for quick prompt insertion.

- **Simple and Intuitive UI**  
  Designed for ease of use so you can access your saved prompts whenever you need them.

## File Structure

- `manifest.json`  
  The Chrome extension manifest file (Manifest V3 compliant).

- `background.js`  
  Handles the initial setup (saving default prompts) and listens for messages to retrieve prompts from storage.

- `content.js`  
  Detects text areas on the page and dynamically inserts a button and prompt selector UI for prompt insertion.

- `popup.html` & `popup.js`  
  The extension's popup interface for adding and listing saved prompts.

## Installation

1. Clone or download this repository:

    ```bash
    git clone https://github.com/your-username/Prompt-Saver.git
    ```

2. Open Chrome and go to [chrome://extensions](chrome://extensions).

3. Enable "Developer mode" using the toggle in the upper-right corner.

4. Click "Load unpacked" and select the cloned/downloaded folder.

5. Once installed, when you visit any website with a text area, an **"📝 Insert Prompt"** button will appear near the text area, allowing you to quickly insert your saved prompts.

## Usage

1. **Saving a Prompt**  
   Click the extension icon in the Chrome toolbar to open the popup. Enter your prompt in the input field and click the **Save** button to add it to your list.

2. **Inserting a Prompt**  
   Click the **"📝 Insert Prompt"** button that appears near a text area on any website. A dropdown menu will display your saved prompts—select one, and it will be inserted into the text area.

## Notes

- The extension targets any text area on a web page. Depending on the website structure, it might not always detect the intended text area.
- The UI is kept simple by design. Feel free to enhance it with custom CSS to better suit your needs.

## License

This project is licensed under the [MIT License](LICENSE).
