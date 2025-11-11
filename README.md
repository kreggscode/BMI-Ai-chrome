# BMI AI - Powered by Pollination 🌸

An AI-powered Chrome extension for BMI calculation, health analysis, and personalized fitness recommendations using Pollination AI.

## ✨ Features

- **Instant BMI Calculation** - Calculate your BMI with height, weight, age, and gender inputs
- **AI-Powered Analysis** - Get detailed health insights powered by Pollination AI (temperature: 1 for creative responses)
- **Chat Interface** - Ask questions about your health, fitness, and nutrition
- **History & Logging** - Track your BMI calculations over time with detailed logs
- **Beautiful UI** - Stunning neon glow aesthetic with dark/light mode toggle
- **Privacy First** - All data stored locally on your device, no external tracking
- **No Dependencies** - Pure vanilla JavaScript, no external libraries needed

## 🚀 Installation

### From Source

1. Clone or download this repository:
```bash
git clone https://github.com/kreggscode/BMI-Ai-chrome.git
cd BMI-Ai-chrome
```

2. Open Chrome and navigate to:
```
chrome://extensions/
```

3. Enable "Developer mode" (toggle in the top right corner)

4. Click "Load unpacked" and select the extension folder

5. The extension will appear in your Chrome toolbar!

## 📖 How to Use

### Calculator Tab
1. Enter your height (cm), weight (kg), age, and gender
2. Click "Calculate BMI"
3. View your BMI value and category

### Analysis Tab
1. Calculate your BMI first
2. Click "Get AI Analysis"
3. Receive personalized health recommendations

### Chat Tab
1. Ask any questions about BMI, health, or fitness
2. Get AI-powered responses in real-time
3. Chat history is saved locally

### History Tab
1. View all your past BMI calculations
2. Track changes over time
3. Clear history anytime

## 🎨 Features Breakdown

### BMI Categories
- **Underweight**: BMI < 18.5
- **Normal Weight**: BMI 18.5 - 24.9
- **Overweight**: BMI 25 - 29.9
- **Obese**: BMI ≥ 30

### AI Integration
- Uses Pollination AI's text generation API
- Temperature set to 1 for creative, personalized responses
- No API key required (uses free tier)
- Supports advanced reasoning and multi-turn conversations

### Data Storage
- All BMI calculations stored locally
- Chat history saved in Chrome storage
- Theme preference (dark/light mode) saved
- No data sent to external servers except for AI requests

## 🔒 Privacy & Security

- **Local Storage**: All personal health data stored locally on your device
- **No Tracking**: No analytics, no user tracking
- **No External Logging**: Your data never leaves your device (except AI requests)
- **Open Source**: Code is transparent and auditable

See [Privacy Policy](docs/privacy.html) for more details.

## 📋 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Chrome Storage API
- **AI**: Pollination AI (OpenAI compatible)
- **Styling**: Custom CSS with neon glow aesthetic

## 🌐 Landing Page

Visit the landing page at `docs/index.html` for:
- Feature showcase
- Installation guide
- How it works
- Privacy policy
- Terms & conditions

## 📚 Documentation

- [Privacy Policy](docs/privacy.html)
- [Terms & Conditions](docs/terms.html)
- [Landing Page](docs/index.html)

## 🔧 Configuration

### Pollination API
The extension uses Pollination AI's free tier. To use your own API key:

1. Get a token from [auth.pollinations.ai](https://auth.pollinations.ai)
2. Modify `popup.js` to add the Authorization header:
```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
}
```

### Temperature Setting
The temperature is set to 1 for creative responses. To adjust:
- Edit `popup.js` and change the `TEMPERATURE` constant
- Range: 0 (deterministic) to 3 (very creative)

## 🐛 Troubleshooting

### Extension not showing up
- Make sure Developer mode is enabled
- Try refreshing the extension in `chrome://extensions/`

### AI analysis not working
- Check your internet connection
- Ensure Pollination API is accessible
- Check browser console for errors (F12)

### History not saving
- Check if Chrome storage is enabled
- Try clearing extension data and reinstalling

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- Built with ❤️ by [kreggscode](https://github.com/kreggscode)
- Powered by [Pollination AI](https://pollinations.ai)
- Inspired by health and wellness technology

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/kreggscode/BMI-Ai-chrome/issues)
- Check the [Landing Page](docs/index.html) for FAQs

## ⚠️ Disclaimer

**Important**: BMI AI is a tool for informational purposes only. It should not be considered medical advice. Always consult with a qualified healthcare professional before making any health-related decisions.

---

**Made with 🌸 Pollination AI** | [Visit Pollinations.AI](https://pollinations.ai)
