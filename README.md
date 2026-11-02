# 🛒 Standalone Shopping Cart App (Practical 5)

A complete, self-contained **Shopping Cart Application** powered by the **DummyJSON REST API**. Features live catalog browsing, category filtering, search, add/remove cart management, real-time total price calculation, simulated confetti checkout, mobile phone simulation, dark/light theme switching, and the full **React Native (Expo SDK 54)** college practical record book code.

---

## 🚀 Features

- 🌐 **DummyJSON API Integration**: Fetches real products with titles, prices, ratings, and thumbnails.
- 🛍️ **Cart Management**: Add items from catalog, remove items from cart, live cart counter badge.
- 💵 **Dynamic Grand Total**: Automatic price summation across all cart items.
- 🎉 **Simulated Checkout**: Interactive checkout celebration with confetti particle animation.
- 🔍 **Search & Category Filtering**: Filter catalog by text or category pills (beauty, fragrances, etc.).
- 📱 **Mobile Simulator & Clean UI**: Features a phone notch, responsive layout, and modern glassmorphism.
- 🌓 **Dark & Light Mode**: Built-in glassmorphism theme switch.
- 📖 **Practical 5 Lab Record**: Dedicated tab with Aim, Algorithm (10 steps), and copyable Expo React Native code.
- 📦 **100% Standalone**: Self-contained with its own `package.json`, `vite.config.js`, and installed dependencies.

---

## 📂 Project Structure

```text
cart-app/
├── expo-react-native/        # React Native / Expo SDK 54 code for mobile
│   ├── App.tsx               # Native mobile implementation
│   └── README.md             # How to run on phone with Expo Go
├── node_modules/             # Pre-installed dependencies
├── public/                   # Static assets
├── src/
│   ├── App.jsx               # Main Shopping Cart App & Record Book tab
│   ├── index.css             # Full styling with light & dark theme variables
│   └── main.jsx              # React DOM entry point
├── index.html                # HTML template
├── package.json              # Scripts & dependencies
├── package-lock.json         # Locked dependency tree
├── vite.config.js            # Vite configuration
├── start-app.bat             # One-click Windows launcher
└── README.md                 # Documentation
```

---

## 💻 How to Run the Web Application

All dependencies are already included in this folder.

### 1. Start Development Server
```bash
npm run dev
```
Open the provided URL (e.g. `http://localhost:5173/`) in your browser. Or double-click `start-app.bat`.

### 2. Build for Production
```bash
npm run build
```

### 3. Preview Production Build
```bash
npm run preview
```

---

## 📱 How to Run on Mobile with Expo (React Native)

1. Create a new Expo app:
   ```bash
   npx create-expo-app@latest CartApp --template default@sdk-54
   cd CartApp
   ```
2. Replace `app/index.tsx` (or `App.tsx`) with the file from `expo-react-native/App.tsx`.
3. Start Expo:
   ```bash
   npx expo start
   ```
4. Scan the QR code using the **Expo Go** app on your phone.

