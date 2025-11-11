// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('BMI AI Extension installed');
    
    // Initialize storage
    chrome.storage.local.get(['bmiHistory', 'chatHistory', 'theme'], (result) => {
        if (!result.bmiHistory) {
            chrome.storage.local.set({ bmiHistory: [] });
        }
        if (!result.chatHistory) {
            chrome.storage.local.set({ chatHistory: [] });
        }
        if (!result.theme) {
            chrome.storage.local.set({ theme: 'dark' });
        }
    });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getHistory') {
        chrome.storage.local.get('bmiHistory', (result) => {
            sendResponse({ history: result.bmiHistory || [] });
        });
        return true;
    }
});
