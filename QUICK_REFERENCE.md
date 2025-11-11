# BMI AI Chrome Extension - Quick Reference

## 🚀 Get Started in 3 Steps

### Step 1: Load Extension
```
1. Open chrome://extensions/
2. Enable Developer mode (top right)
3. Click "Load unpacked"
4. Select this folder
```

### Step 2: Start Using
- Click the BMI AI icon in your toolbar
- Enter your height, weight, age, gender
- Click "Calculate BMI"

### Step 3: Explore Features
- **Calculator** - Get your BMI instantly
- **Analysis** - Get AI health insights
- **Chat** - Ask health questions
- **History** - Track your progress

## 📁 File Guide

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration |
| `popup.html` | Main UI (4 tabs) |
| `popup.js` | Core logic & Pollination API |
| `styles.css` | Neon glow styling |
| `background.js` | Service worker |
| `README.md` | Full documentation |
| `SETUP_GUIDE.md` | Installation guide |
| `DEPLOYMENT.md` | Deployment instructions |
| `PROJECT_SUMMARY.md` | Project overview |
| `docs/` | Landing page & legal |

## 🎨 Key Features

- ✅ Instant BMI calculation
- ✅ AI-powered analysis (Pollination AI)
- ✅ Chat interface for questions
- ✅ History tracking (local storage)
- ✅ Dark/light mode toggle
- ✅ Neon glow aesthetic
- ✅ Privacy-first (no external logging)
- ✅ Zero dependencies

## 🔧 Configuration

### Change Theme Color
Edit `styles.css`:
```css
--primary: #00ff88;  /* Change this */
```

### Adjust AI Creativity
Edit `popup.js`:
```javascript
const TEMPERATURE = 1;  /* 0-3 range */
```

### Use Your API Key
Edit `popup.js` in `callPollinationAPI()`:
```javascript
'Authorization': 'Bearer YOUR_TOKEN'
```

## 📊 BMI Categories

| Category | BMI Range | Color |
|----------|-----------|-------|
| Underweight | < 18.5 | Blue |
| Normal | 18.5-24.9 | Green |
| Overweight | 25-29.9 | Yellow |
| Obese | ≥ 30 | Orange |

## 💾 Data Storage

- **Location**: Chrome Storage API (local only)
- **What's Stored**: BMI history, chat history, theme preference
- **Privacy**: No external transmission
- **Clear**: Use "Clear History" button anytime

## 🔗 Important Links

- **GitHub**: https://github.com/kreggscode/BMI-Ai-chrome
- **Landing Page**: docs/index.html
- **Privacy Policy**: docs/privacy.html
- **Terms**: docs/terms.html
- **Pollination AI**: https://pollinations.ai

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension not showing | Refresh in chrome://extensions/ |
| AI not responding | Check internet connection |
| History not saving | Clear extension data & reinstall |
| Dark mode not working | Check browser storage permissions |

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Edge
- ✅ Brave
- ✅ Other Chromium-based browsers

## 🎯 Next Steps

1. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

2. **Deploy Landing Page**
   - Settings → GitHub Pages
   - Select `/docs` folder
   - Live at: `https://kreggscode.github.io/BMI-Ai-chrome/`

3. **Publish to Chrome Web Store** (Optional)
   - Create developer account
   - Upload extension
   - Submit for review

## 📞 Support

- **Issues**: GitHub Issues
- **Docs**: README.md, SETUP_GUIDE.md
- **Questions**: Check PROJECT_SUMMARY.md

## ⚠️ Important

- Not medical advice - consult healthcare professionals
- API rate limits apply to free tier
- All data stored locally on your device
- Open source - MIT licensed

---

**Version**: 1.0.0 | **Status**: Production Ready | **License**: MIT

Built with ❤️ using Pollination AI
