document.getElementById("send-btn").addEventListener("click", sendMessage);
const userInputField = document.getElementById("user-input");

// Listen for Enter key to send message
userInputField.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // Prevents newline insertion
        sendMessage();
    }
});

userInputField.addEventListener("input", autoResize);

function sendMessage() {
    const userInput = userInputField.value;
    if (userInput.trim() === "") return;

    // Add user's message to chat
    addUserMessage(userInput);
    userInputField.value = "";
    autoResize(); // Reset the height of the textarea after clearing it

    // Show loading spinner
    showLoadingSpinner();

    // Send input to Flask backend
    fetch('/get_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: userInput })
    })
    .then(response => response.json())
    .then(data => {
        addBotMessage(data.response); // Add bot's response to chat
        hideLoadingSpinner();        // Hide loading spinner
    })
    .catch(error => {
        addBotMessage("An error occurred. Please try again later.");
        hideLoadingSpinner();
    });
}

function addUserMessage(message) {
    const chatBox = document.querySelector(".chat-box");
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "chat-message user-message";
    userMsgDiv.innerText = message;
    chatBox.appendChild(userMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(message) {
    const chatBox = document.querySelector(".chat-box");
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "chat-message bot-message";
    botMsgDiv.innerText = message;
    chatBox.appendChild(botMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Show loading spinner
function showLoadingSpinner() {
    const modalHTML = `
        <div class="modal fade" id="loadingModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Processing your request...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Append the modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show the modal using Bootstrap's Modal API
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'), {
        backdrop: 'static',
        keyboard: false
    });
    loadingModal.show();

    // Store the modal instance globally for later use
    window.loadingModalInstance = loadingModal;
}

// Hide loading spinner
function hideLoadingSpinner() {
    const loadingModalEl = document.getElementById('loadingModal');
    if (loadingModalEl && window.loadingModalInstance) {
        // Hide and dispose of the modal instance
        window.loadingModalInstance.hide();
        window.loadingModalInstance.dispose();
        delete window.loadingModalInstance; // Clean up the global reference

        // Remove the modal from the DOM
        loadingModalEl.remove();
    }
}

// Auto-resize the textarea
function autoResize() {
    userInputField.style.height = 'auto';
    userInputField.style.height = userInputField.scrollHeight + 'px';
}
