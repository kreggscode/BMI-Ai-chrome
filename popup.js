// Constants
const POLLINATION_API = 'https://text.pollinations.ai/openai';
const TEMPERATURE = 1; // Creative responses

// DOM Elements
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const heightValue = document.getElementById('heightValue');
const weightValue = document.getElementById('weightValue');
const ageValue = document.getElementById('ageValue');
const calculateBtn = document.getElementById('calculateBtn');
const bmiResult = document.getElementById('bmiResult');
const bmiValueDisplay = document.getElementById('bmiValueDisplay');
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
const backToCalculatorBtn = document.getElementById('backToCalculatorBtn');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const viewBtns = document.querySelectorAll('.view-btn');
const circleProgress = document.querySelector('.circle-progress');

// State
let currentBMI = null;
let currentUserData = null;
let chatHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadHistory();
    setupEventListeners();
    setupSliderListeners();
    loadChatHistory();
    renderHistoryGraph();
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
    backToCalculatorBtn.addEventListener('click', () => {
        // Switch back to Calculator tab
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('[data-tab="calculator"]').classList.add('active');
        document.getElementById('calculator').classList.add('active');
        
        // Scroll to results if they exist
        if (currentBMI) {
            setTimeout(() => {
                bmiResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });

    // View toggle for history
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            toggleHistoryView(view);
        });
    });
}

// Slider Listeners
function setupSliderListeners() {
    heightInput.addEventListener('input', () => {
        heightValue.textContent = heightInput.value;
    });
    weightInput.addEventListener('input', () => {
        weightValue.textContent = weightInput.value;
    });
    ageInput.addEventListener('input', () => {
        ageValue.textContent = ageInput.value;
    });
}

// Progressive Circle Animation
function animateCircle(bmi) {
    // BMI ranges for circle animation
    const maxBMI = 40; // Max BMI for full circle
    const percentage = Math.min(bmi / maxBMI, 1);
    const circumference = 534; // 2 * π * 85
    const offset = circumference - (percentage * circumference);

    if (circleProgress) {
        circleProgress.style.strokeDashoffset = offset;
    }
}

// BMI Calculation
function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const age = parseFloat(ageInput.value);
    const gender = genderSelect.value;

    if (!height || !weight || !age) {
        alert('Please adjust all sliders');
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

    // Display result with progressive circle
    bmiResult.classList.remove('hidden');
    bmiValueDisplay.textContent = currentBMI;
    animateCircle(bmi);

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

    // Scroll to result area
    setTimeout(() => {
        bmiResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);

    // Save to history
    saveToHistory(currentUserData);
}

// Get AI Analysis
async function getAIAnalysis() {
    if (!currentBMI || !currentUserData) {
        alert('Calculate BMI first');
        return;
    }

    // Switch to Analysis tab
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="analysis"]').classList.add('active');
    document.getElementById('analysis').classList.add('active');

    analysisLoading.classList.remove('hidden');
    analysisContainer.innerHTML = '';

    try {
        const prompt = `You are a health and fitness AI assistant. Provide a detailed BMI analysis for the following person:
- Height: ${currentUserData.height} cm
- Weight: ${currentUserData.weight} kg
- Age: ${currentUserData.age} years
- Gender: ${currentUserData.gender}
- BMI: ${currentUserData.bmi}

Please provide a well-formatted analysis with these EXACT sections and headings:

## 📊 BMI Assessment
[Brief assessment of their BMI category and health status]

## 🎯 Personalized Recommendations
[Specific, actionable recommendations based on their profile]

## 🥗 Nutrition Guidelines
[Healthy eating advice tailored to their BMI and goals]

## 💪 Exercise Plan
[Recommended physical activities and workout suggestions]

## 🎯 Lifestyle Tips
[Additional healthy habits and daily routine improvements]

## 💡 Motivation
[Encouraging words and long-term health outlook]

Format with proper headings, bullet points, and clear sections. Keep it concise but comprehensive.`;

        const response = await callPollinationAPI(prompt);
        // Parse markdown-style response into proper HTML
        const formattedResponse = formatMarkdownResponse(response);
        analysisContainer.innerHTML = formattedResponse;
    } catch (error) {
        analysisContainer.innerHTML = `<p style="color: #ff4444;">Error: ${error.message}</p>`;
    } finally {
        analysisLoading.classList.add('hidden');
    }
}

// Format markdown-style response into proper HTML
function formatMarkdownResponse(text) {
    let html = text;

    // Convert headers
    html = html.replace(/^## (.+)$/gm, '<h3 class="analysis-heading">$1</h3>');
    html = html.replace(/^### (.+)$/gm, '<h4 class="analysis-subheading">$1</h4>');

    // Convert bullet points
    html = html.replace(/^- (.+)$/gm, '<li class="analysis-item">$1</li>');

    // Convert numbered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="analysis-item">$1</li>');

    // Wrap consecutive list items
    html = html.replace(/(<li class="analysis-item">.+?<\/li>\s*)+/gs, '<ul class="analysis-list">$&</ul>');

    // Convert line breaks to paragraphs for regular text
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Wrap everything in a container
    html = '<div class="analysis-content"><p>' + html + '</p></div>';

    // Clean up any empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br><\/p>/g, '');

    return html;
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
        let systemPrompt = 'You are a helpful health and fitness AI assistant. ';
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

// History View Toggle
function toggleHistoryView(view) {
    const historyGraph = document.getElementById('historyGraph');
    const historyList = document.getElementById('historyList');

    // Update button states
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });

    // Toggle views
    if (view === 'graph') {
        historyGraph.classList.remove('hidden');
        historyList.classList.add('hidden');
        renderHistoryGraph();
    } else {
        historyGraph.classList.add('hidden');
        historyList.classList.remove('hidden');
        loadHistory();
    }
}

// History Graph Rendering
function renderHistoryGraph() {
    const canvas = document.getElementById('bmiChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    chrome.storage.local.get('bmiHistory', (result) => {
        const history = result.bmiHistory || [];
        if (history.length === 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Graph dimensions and margins - increased to prevent overflow
        const margin = { top: 60, right: 50, bottom: 80, left: 80 };
        const width = canvas.width - margin.left - margin.right;
        const height = canvas.height - margin.top - margin.bottom;

        // BMI range for Y-axis - dynamically calculated from actual values
        const bmiValues = history.map(item => parseFloat(item.bmi));
        const minBMI = Math.max(10, Math.floor(Math.min(...bmiValues) - 2)); // At least 10, with 2-point buffer
        const maxBMI = Math.ceil(Math.max(...bmiValues) + 2); // 2-point buffer above max
        const bmiRange = maxBMI - minBMI;

        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, margin.top, 0, canvas.height - margin.bottom);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(margin.left, margin.top, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = margin.top + (i * height) / 5;
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(canvas.width - margin.right, y);
            ctx.stroke();

            // Y-axis labels - adjusted for new margin
            const bmiValue = maxBMI - (i * bmiRange) / 5;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(bmiValue.toFixed(0), margin.left - 15, y + 4);
        }

        // Vertical grid lines
        const dataLength = Math.min(history.length, 10);
        for (let i = 0; i < dataLength; i++) {
            const x = margin.left + (i * width) / Math.max(dataLength - 1, 1);
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, canvas.height - margin.bottom);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;

        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, canvas.height - margin.bottom);
        ctx.lineTo(canvas.width - margin.right, canvas.height - margin.bottom);
        ctx.stroke();

        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, canvas.height - margin.bottom);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // X-axis label
        ctx.fillText('Recent Entries', canvas.width / 2, canvas.height - 20);

        // Y-axis label (rotated)
        ctx.save();
        ctx.translate(20, canvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('BMI Value', 0, 0);
        ctx.restore();

        // Plot data points and create gradient fills
        const last10Entries = history.slice(-10);

        // Create gradient fills for different BMI ranges
        const normalGradient = ctx.createLinearGradient(0, margin.top, 0, canvas.height - margin.bottom);
        normalGradient.addColorStop(0, 'rgba(39, 174, 96, 0.3)');
        normalGradient.addColorStop(1, 'rgba(39, 174, 96, 0.1)');

        const underweightGradient = ctx.createLinearGradient(0, margin.top, 0, canvas.height - margin.bottom);
        underweightGradient.addColorStop(0, 'rgba(52, 152, 219, 0.3)');
        underweightGradient.addColorStop(1, 'rgba(52, 152, 219, 0.1)');

        const overweightGradient = ctx.createLinearGradient(0, margin.top, 0, canvas.height - margin.bottom);
        overweightGradient.addColorStop(0, 'rgba(243, 156, 18, 0.3)');
        overweightGradient.addColorStop(1, 'rgba(243, 156, 18, 0.1)');

        const obeseGradient = ctx.createLinearGradient(0, margin.top, 0, canvas.height - margin.bottom);
        obeseGradient.addColorStop(0, 'rgba(231, 76, 60, 0.3)');
        obeseGradient.addColorStop(1, 'rgba(231, 76, 60, 0.1)');

        // Draw gradient fills
        last10Entries.forEach((item, index) => {
            if (index === 0) return; // Skip first point for fill

            const prevItem = last10Entries[index - 1];
            const x1 = margin.left + ((index - 1) * width) / Math.max(last10Entries.length - 1, 1);
            const y1 = margin.top + ((maxBMI - prevItem.bmi) / bmiRange) * height;
            const x2 = margin.left + (index * width) / Math.max(last10Entries.length - 1, 1);
            const y2 = margin.top + ((maxBMI - item.bmi) / bmiRange) * height;

            // Choose gradient based on BMI category
            let gradient;
            if (item.bmi < 18.5) gradient = underweightGradient;
            else if (item.bmi < 25) gradient = normalGradient;
            else if (item.bmi < 30) gradient = overweightGradient;
            else gradient = obeseGradient;

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(x1, canvas.height - margin.bottom);
            ctx.lineTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x2, canvas.height - margin.bottom);
            ctx.closePath();
            ctx.fill();
        });

        // Draw connecting line
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();

        last10Entries.forEach((item, index) => {
            const x = margin.left + (index * width) / Math.max(last10Entries.length - 1, 1);
            const y = margin.top + ((maxBMI - item.bmi) / bmiRange) * height;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw data points with glow effects
        last10Entries.forEach((item, index) => {
            const x = margin.left + (index * width) / Math.max(last10Entries.length - 1, 1);
            const y = margin.top + ((maxBMI - item.bmi) / bmiRange) * height;

            // Determine color based on BMI category
            let color = '#27ae60'; // normal
            if (item.bmi < 18.5) color = '#3498db'; // underweight
            else if (item.bmi >= 30) color = '#e74c3c'; // obese
            else if (item.bmi >= 25) color = '#f39c12'; // overweight

            // Draw glow effect
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Draw solid point
            ctx.shadowBlur = 0;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // White center
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Add BMI value label above point
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.bmi, x, y - 12);
        });
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

        history.slice().reverse().forEach((item, reversedIndex) => {
            const originalIndex = history.length - 1 - reversedIndex;

            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-content">
                    <div class="history-item-header">
                        <span class="history-item-date">${item.timestamp}</span>
                        <span class="history-item-bmi">BMI: ${item.bmi}</span>
                    </div>
                    <div class="history-item-details">
                        Height: ${item.height}cm | Weight: ${item.weight}kg | Age: ${item.age} | Gender: ${item.gender}
                    </div>
                </div>
                <button class="delete-btn" data-index="${originalIndex}" title="Delete this entry">×</button>
            `;
            historyContainer.appendChild(historyItem);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                deleteHistoryItem(index);
            });
        });
    });
}

function deleteHistoryItem(index) {
    chrome.storage.local.get('bmiHistory', (result) => {
        const history = result.bmiHistory || [];
        history.splice(index, 1);
        chrome.storage.local.set({ bmiHistory: history });
        loadHistory();
        renderHistoryGraph();
    });
}

// History Management
function saveToHistory(data) {
    chrome.storage.local.get('bmiHistory', (result) => {
        const history = result.bmiHistory || [];
        history.push(data);
        chrome.storage.local.set({ bmiHistory: history });
        loadHistory();
        renderHistoryGraph();
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        chrome.storage.local.set({ bmiHistory: [] });
        loadHistory();
        renderHistoryGraph();
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
