# प्रतीक कविता संग्रह 📖

> नेपाली कविताहरूको एक डिजिटल संग्रह — प्रतीक पौडेलद्वारा रचित

## 🌐 Live Website
[pratik-kavita-sangrah.github.io](https://YOUR_USERNAME.github.io/pratik-kavita-sangrah)

## ✨ Features
- 🌙 **Night Mode / Dark Mode** — एक क्लिकमा Dark/Light थिम
- 🔍 **Real-time Search** — कविता शीर्षक, भाव वा विषयले खोज्नुहोस्
- 📰 **Scrolling News Ticker** — नयाँ कविता र घोषणाहरू
- 🎨 **Beautiful Typography** — देवनागरी फन्टसहित सुन्दर डिजाइन
- 📱 **Responsive** — मोबाइल र डेस्कटप दुवैमा राम्रो
- ✨ **Smooth Animations** — Card hover, page load animations

## 📁 Project Structure
```
pratik-kavita-sangrah/
├── index.html              ← मुख्य पेज (homepage)
├── css/
│   └── style.css           ← सबै styling + dark mode
├── js/
│   └── main.js             ← search, dark mode, animations
├── kavitaharu/
│   ├── raat-ko-aakash.html
│   ├── mato-ko-sugandha.html
│   └── ... (थप कविताहरू थप्नुहोस्)
└── README.md
```

## ➕ नयाँ कविता कसरी थप्ने?

### Step 1: नयाँ HTML file बनाउनुहोस्
`kavitaharu/` फोल्डरमा नयाँ file बनाउनुहोस्, जस्तै `mero-kavita.html`।
`kavitaharu/raat-ko-aakash.html` लाई template को रूपमा copy गरेर प्रयोग गर्नुहोस्।

### Step 2: `js/main.js` मा data थप्नुहोस्
`kavitaData` array मा नयाँ object थप्नुहोस्:
```js
{
  id: 7,
  title: "मेरो कविता",
  preview: "पहिलो दुई लाइन यहाँ...",
  tag: "भावना",
  date: "२०८१ बैशाख",
  file: "kavitaharu/mero-kavita.html"
}
```

## 🚀 GitHub Pages मा Deploy गर्ने तरिका
(तलको README मा विस्तृत steps छन्)

---
*शब्दमा बाँधिएको माया* 🌸
