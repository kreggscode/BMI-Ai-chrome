// Constants
const POLLINATION_API = 'https://text.pollinations.ai/openai';
const TEMPERATURE = 1; // Creative responses

// DOM Elements
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const calculateBtn = document.getElementById('calculateBtn');
const bmiResult = document.getElementById('bmiResult');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const getAnalysisBtn = document.getElementById('getAnalysisBtn');
const analysisContainer = document.getElementById('analysisContainer');
const analysisLoading = document.getElementById('analysisLoading');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatLoading = document.getElementById('chatLoading');
const historyContainer = document.getElementById('historyContainer');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const themeToggle = document.getElementById('themeToggle');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// State
let currentBMI = null;
let currentUserData = null;
let chatHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadHistory();
    setupEventListeners();
    loadChatHistory();
});

// Theme Management
function loadTheme() {
    chrome.storage.local.get('theme', (data) => {
        if (data.theme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }
    });
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    chrome.storage.local.set({ theme: isLight ? 'light' : 'dark' });
    themeToggle.querySelector('.theme-icon').textContent = isLight ? '☀️' : '🌙';
});

// Tab Navigation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
    });
});

// Event Listeners
function setupEventListeners() {
    calculateBtn.addEventListener('click', calculateBMI);
    getAnalysisBtn.addEventListener('click', getAIAnalysis);
    sendChatBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// BMI Calculation
function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const age = parseFloat(ageInput.value);
    const gender = genderSelect.value;

    if (!height || !weight || !age) {
        alert('Please fill in all fields');
        return;
    }

    // BMI Formula: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    currentBMI = bmi.toFixed(1);
    
    currentUserData = {
        height,
        weight,
        age,
        gender,
        bmi: currentBMI,
        timestamp: new Date().toLocaleString()
    };

    // Display result
    bmiResult.classList.remove('hidden');
    bmiValue.textContent = currentBMI;
    
    // Determine category
    let category = '';
    let categoryClass = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'normal';
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
    } else {
        category = 'Obese';
        categoryClass = 'obese';
    }
    
    bmiCategory.textContent = category;
    bmiCategory.className = `bmi-category ${categoryClass}`;
    
    // Show analysis button
    getAnalysisBtn.classList.remove('hidden');
    
    // Save to history
    saveToHistory(currentUserData);
}

// Get AI Analysis
async function getAIAnalysis() {
    if (!currentBMI || !currentUserData) {
        alert('Calculate BMI first');
        return;
    }

    analysisLoading.classList.remove('hidden');
    analysisContainer.innerHTML = '';

    try {
        const prompt = `You are a health and fitness AI assistant. Provide a detailed BMI analysis for the following person:
- Height: ${currentUserData.height} cm
- Weight: ${currentUserData.weight} kg
- Age: ${currentUserData.age} years
- Gender: ${currentUserData.gender}
- BMI: ${currentUserData.bmi}

Please provide:
1. Health assessment based on BMI
2. Personalized recommendations
3. Lifestyle tips
4. Dietary suggestions
5. Exercise recommendations

Be encouraging and supportive.`;

        const response = await callPollinationAPI(prompt);
        analysisContainer.innerHTML = `<p>${response}</p>`;
    } catch (error) {
        analysisContainer.innerHTML = `<p style="color: #ff4444;">Error: ${error.message}</p>`;
    } finally {
        analysisLoading.classList.add('hidden');
    }
}

// Chat Functionality
async function sendChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to UI
    addChatMessage(message, 'user');
    chatInput.value = '';
    chatHistory.push({ role: 'user', content: message });

    // Show loading
    chatLoading.classList.remove('hidden');

    try {
        // Build context with BMI data if available
        let systemPrompt = 'You are a helpful health and fitness AI assistant powered by Pollination AI. ';
        if (currentUserData) {
            systemPrompt += `The user has a BMI of ${currentUserData.bmi} (${currentUserData.height}cm, ${currentUserData.weight}kg). `;
        }
        systemPrompt += 'Provide helpful, accurate, and supportive responses.';

        const messages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory
        ];

        const response = await callPollinationAPI(message, messages);
        addChatMessage(response, 'assistant');
        chatHistory.push({ role: 'assistant', content: response });
        
        // Save chat history
        saveChatHistory();
    } catch (error) {
        addChatMessage(`Error: ${error.message}`, 'assistant');
    } finally {
        chatLoading.classList.add('hidden');
    }
}

function addChatMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Pollination API Call
async function callPollinationAPI(prompt, messages = null) {
    const payload = {
        model: 'openai',
        temperature: TEMPERATURE,
        messages: messages || [
            { role: 'user', content: prompt }
        ],
        max_tokens: 1000
    };

    const response = await fetch(POLLINATION_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// History Management
function saveToHistory(data) {
    chrome.storage.local.get('bmiHistory', (result) => {
        const history = result.bmiHistory || [];
        history.push(data);
        chrome.storage.local.set({ bmiHistory: history });
        loadHistory();
    });
}

function loadHistory() {
    chrome.storage.local.get('bmiHistory', (result) => {
        const history = result.bmiHistory || [];
        
        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="placeholder">No history yet</p>';
            clearHistoryBtn.classList.add('hidden');
            return;
        }

        historyContainer.innerHTML = '';
        clearHistoryBtn.classList.remove('hidden');

        history.slice().reverse().forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-date">${item.timestamp}</span>
                    <span class="history-item-bmi">BMI: ${item.bmi}</span>
                </div>
                <div class="history-item-details">
                    Height: ${item.height}cm | Weight: ${item.weight}kg | Age: ${item.age} | Gender: ${item.gender}
                </div>
            `;
            historyContainer.appendChild(historyItem);
        });
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        chrome.storage.local.set({ bmiHistory: [] });
        loadHistory();
    }
}

// Chat History Management
function saveChatHistory() {
    chrome.storage.local.set({ chatHistory: chatHistory });
}

function loadChatHistory() {
    chrome.storage.local.get('chatHistory', (result) => {
        chatHistory = result.chatHistory || [];
        chatMessages.innerHTML = '';
        chatHistory.forEach(msg => {
            addChatMessage(msg.content, msg.role);
        });
    });
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
