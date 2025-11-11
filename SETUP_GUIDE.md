# BMI AI Chrome Extension - Setup Guide

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/kreggscode/BMI-Ai-chrome.git
cd BMI-Ai-chrome
```

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top right corner)
3. Click **Load unpacked**
4. Select the extension folder
5. The extension will appear in your Chrome toolbar!

### Step 3: Start Using

1. Click the BMI AI icon in your Chrome toolbar
2. Enter your height, weight, age, and gender
3. Click "Calculate BMI"
4. Explore the Analysis, Chat, and History tabs

## 📁 Project Structure

```
BMI-Ai-chrome/
├── manifest.json           # Chrome extension configuration
├── popup.html             # Main extension UI
├── popup.js               # Extension logic & Pollination API calls
├── styles.css             # Extension styling (neon glow theme)
├── background.js          # Service worker for background tasks
├── README.md              # Main documentation
├── SETUP_GUIDE.md         # This file
├── .gitignore             # Git ignore rules
├── docs/                  # Landing page & documentation
│   ├── index.html         # Landing page
│   ├── privacy.html       # Privacy policy
│   ├── terms.html         # Terms & conditions
│   ├── styles.css         # Landing page styles
│   └── script.js          # Landing page interactions
└── pollination ai.md      # Pollination AI API documentation
```

## 🎨 Features Overview

### Calculator Tab
- Input height, weight, age, and gender
- Get instant BMI calculation
- View BMI category (Underweight, Normal, Overweight, Obese)

### Analysis Tab
- Get AI-powered health analysis
- Personalized recommendations
- Lifestyle and dietary suggestions
- Exercise recommendations

### Chat Tab
- Ask questions about BMI, health, and fitness
- AI-powered responses using Pollination AI
- Chat history saved locally
- Conversational interface

### History Tab
- View all past BMI calculations
- Track changes over time
- Clear history anytime

## 🔧 Configuration

### Pollination API Settings

The extension uses Pollination AI's free tier by default. The temperature is set to **1** for creative responses.

To modify the temperature:

1. Open `popup.js`
2. Find the line: `const TEMPERATURE = 1;`
3. Change the value (0 = deterministic, 3 = very creative)

### Using Your Own API Key

1. Get a token from [auth.pollinations.ai](https://auth.pollinations.ai)
2. In `popup.js`, modify the `callPollinationAPI` function:

```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
}
```

## 🎨 Customization

### Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary: #00ff88;      /* Main neon green */
    --secondary: #ff00ff;    /* Magenta */
    --accent: #00ffff;       /* Cyan */
    --dark-bg: #0a0e27;      /* Dark background */
    /* ... more variables ... */
}
```

### UI Styling

- **Extension popup**: `styles.css`
- **Landing page**: `docs/styles.css`
- Customize colors, fonts, and animations as needed

## 🔒 Privacy & Data

### Local Storage
- All BMI calculations stored locally on your device
- Chat history saved in Chrome storage
- Theme preference saved locally

### API Calls
- Only your prompts are sent to Pollination AI
- No personal data stored on external servers
- Review Pollination AI's privacy policy for their practices

### Clear Data
- Use the "Clear History" button in the History tab
- Or uninstall the extension to remove all stored data

## 🐛 Troubleshooting

### Extension Not Showing
- Ensure Developer mode is enabled
- Try refreshing the extension in `chrome://extensions/`
- Check for errors in the extension console

### AI Analysis Not Working
- Check your internet connection
- Verify Pollinations.AI is accessible
- Open DevTools (F12) and check the console for errors

### History Not Saving
- Ensure Chrome storage is enabled
- Try clearing extension data and reinstalling
- Check browser permissions for the extension

### Chat Not Responding
- Verify internet connection
- Check if Pollinations API is up
- Try refreshing the extension

## 📚 API Documentation

The extension uses Pollination AI's text generation API. For detailed API documentation, see `pollination ai.md` or visit [Pollinations.AI](https://pollinations.ai).

### Key Endpoints

- **Text Generation**: `https://text.pollinations.ai/openai`
- **Models**: `https://text.pollinations.ai/models`
- **No authentication required** for free tier

## 🌐 Landing Page

The landing page is located in the `docs/` folder:

- **index.html** - Main landing page with features and installation guide
- **privacy.html** - Privacy policy
- **terms.html** - Terms & conditions

To view locally:
1. Open `docs/index.html` in your browser
2. Or deploy to GitHub Pages

## 🚀 Deployment

### GitHub Pages

1. Push to GitHub
2. Go to repository Settings
3. Enable GitHub Pages for the `docs/` folder
4. Your landing page will be live at `https://kreggscode.github.io/BMI-Ai-chrome/`

### Chrome Web Store

To publish on the Chrome Web Store:

1. Create a developer account
2. Prepare extension package
3. Upload manifest and files
4. Add screenshots and description
5. Submit for review

## 📝 Development Tips

### Testing Locally

1. Make changes to files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Test the changes

### Debugging

1. Right-click the extension icon
2. Select "Inspect popup"
3. Use DevTools to debug JavaScript
4. Check the console for errors

### Adding Features

1. Modify `popup.html` for UI changes
2. Update `popup.js` for functionality
3. Edit `styles.css` for styling
4. Test thoroughly before committing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/kreggscode/BMI-Ai-chrome/issues)
- **Documentation**: See README.md and this guide
- **Landing Page**: Visit `docs/index.html`

## 📄 License

This project is open source and available under the MIT License.

## ⚠️ Important Notes

1. **Not Medical Advice**: This extension is for informational purposes only. Always consult a healthcare professional.
2. **API Rate Limits**: Free tier has rate limits. Consider upgrading for higher limits.
3. **Data Privacy**: Review Pollinations AI's privacy policy for their data handling.
4. **Browser Compatibility**: Works with Chrome and Chromium-based browsers.

---

**Happy coding! 🌸**

For more information, visit the [GitHub repository](https://github.com/kreggscode/BMI-Ai-chrome).
