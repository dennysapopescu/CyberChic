# CyberChic 95 👗✨

> **What if Cher Horowitz's computerized closet from _Clueless_ (1995) actually existed?**

**CyberChic 95** is a retro-inspired digital wardrobe and outfit-matching app built around the iconic computerized closet from _Clueless_.

The project combines a playful **Windows 95-inspired interface** with a deterministic, rule-based fashion matching engine that evaluates colors, patterns, styles, seasons, and outfit compatibility.

It is built as a **cross-platform application** using React Native and Expo, with support for iOS, Android, and Web.

> 💿 _It's giving 1995 — but the code is very much 2026._

---

## ✨ Features

### 👗 Digital Wardrobe

- Browse and manage your personal wardrobe
- Add custom garments
- Organize clothing by category
- Use your own garment photos
- View garment details and attributes
- Create and save complete outfits to your **Lookbook**

### 💅 Outfit Matching Engine

CyberChic 95 includes a deterministic, rule-based matching engine implemented in [`matchEngine.ts`](src/services/matchEngine.ts).

Instead of relying on a fixed set of predefined outfits, the engine evaluates **compatible garments added to the wardrobe** using multiple fashion-oriented heuristics:

- HSL-based color analysis
- Neutral-color detection
- Monochromatic and analogous color relationships
- Complementary color relationships
- Pattern compatibility
- Style compatibility
- Season compatibility
- Formality balance
- Statement-piece vs. neutral-piece combinations
- Special _Clueless_-inspired outfit rules

The result is a match evaluation accompanied by a playful **MATCH / MIS-MATCH verdict** and Cher-inspired feedback.

> **Note:** The matching engine is a deterministic rule-based system designed for the application's experience. Its scores represent the application's internal heuristics rather than objective measurements of fashion compatibility.

---

### 🎰 DRESS ME

Don't know what to wear?

Press **DRESS ME** and let CyberChic generate a compatible outfit from your wardrobe.

The outfit generator uses the same matching logic as the manual matcher to search for suitable combinations rather than simply selecting two random garments.

---

### 📖 Lookbook

Save your favorite combinations to your personal **Lookbook**.

You can:

- Save outfits
- Browse saved looks
- Equip a saved outfit
- Delete looks
- Keep your wardrobe and lookbook separated between local profiles

---

### 👤 Multiple Local Profiles

CyberChic 95 supports multiple profiles on the same device.

Each profile has its own:

- Wardrobe
- Lookbook
- Display name
- Avatar

User-specific wardrobe and lookbook data are stored under isolated `AsyncStorage` keys.

This makes it possible for multiple people to use the same installation without sharing their wardrobe data.

---

### 📸 Personal Avatars

Create your own retro profile avatar using:

- 📸 **SNAP SELFIE** — take a photo using the device camera
- 🖼️ **FROM GALLERY** — select an existing image
- ＋ **EMOJI** — choose a custom emoji avatar

---

### 🖥️ Retro 90s Interface

The visual design is intentionally inspired by the aesthetics of:

- Windows 95
- Early personal-computer interfaces
- _Clueless_ (1995)
- 90s fashion
- Retro desktop applications

The interface includes:

- Leopard-print background
- Beveled Windows-style controls
- Retro title bars
- CRT scanline effect
- Pixel-inspired visual details
- Retro sound effects
- Cher-inspired messages and easter eggs

The retro aesthetic is not a limitation of the application — **it is the concept.**

---

## 🎬 _Clueless_ Inspiration

The project is directly inspired by the fictional computerized wardrobe used by **Cher Horowitz**, played by Alicia Silverstone, in _Clueless_ (1995).

The goal was not to recreate the movie interface pixel-for-pixel, but to turn the idea behind it into a real interactive application.

Some details intentionally reference the film, including:

- Cher-inspired fashion feedback
- The iconic yellow plaid outfit
- The red Alaïa dress
- Retro computerized-closet interactions
- 90s visual language

These references are included as part of the project's creative concept and are not affiliated with or endorsed by the film or its rights holders.

---

## 🧠 How the Matching Engine Works

The matching engine evaluates outfits using several independent rule groups.

### 1. Color Harmony

Garments are converted from hexadecimal color values into **HSL (Hue, Saturation, Lightness)** values.

The engine considers relationships such as:

- Neutral + vibrant color combinations
- Monochromatic combinations
- Analogous colors
- Complementary colors
- Saturation and lightness differences
- Potentially conflicting color combinations

Neutral garments can act as visual anchors for more saturated pieces.

---

### 2. Pattern Compatibility

The engine evaluates whether patterns work together or compete visually.

Examples include:

- Statement pattern + solid neutral
- Multiple compatible patterns
- Conflicting prints
- Plaid combinations
- Animal print combinations
- Floral patterns
- Texture-related bonuses

The goal is to prevent combinations where every garment competes for attention.

---

### 3. Style Compatibility

Garments are associated with style categories such as:

- `School`
- `Chic`
- `Party`
- `Casual`
- `Grunge`

A compatibility matrix determines how well different style categories work together.

The engine also considers formal vs. casual combinations to avoid severe mismatches.

---

### 4. Seasonal Compatibility

Each garment can be associated with a season.

The engine evaluates:

- Spring
- Summer
- Autumn
- Winter
- All-season garments

This adds another layer of compatibility on top of color, pattern, and style.

---

### 5. Iconic Outfit Rules

Certain combinations receive special treatment as _Clueless_-inspired easter eggs.

For example:

**Yellow Plaid + matching pieces → ICONIC MATCH 💛**

These rules are intentionally separate from the general matching heuristics so that recognizable movie-inspired combinations can trigger their own experience.

---

## 🏗️ Architecture

CyberChic 95 is structured as a React Native application with separate layers for UI, domain logic, local persistence, and authentication.

```text
┌─────────────────────────────────────────────┐
│                  React UI                   │
│                                             │
│  Wardrobe · Matcher · Lookbook · Profile   │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│              Application Logic              │
│                                             │
│  matchEngine.ts · dressMe.ts · UI state    │
└───────────────────┬─────────────────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
┌──────────────────┐  ┌──────────────────────┐
│ Local Persistence│  │ Authentication Layer │
│                  │  │                      │
│ AsyncStorage     │  │ Expo AuthSession     │
│ Wardrobe         │  │ WebBrowser           │
│ Lookbook         │  │ Google integration   │
│ Profiles         │  │                      │
└──────────────────┘  └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- **React Native**
- **Expo SDK 57**
- **TypeScript**
- **React Native Web**
- **Lucide React Native**
- **SVG**

### Data & Persistence

- **AsyncStorage**
- Browser Web Storage through the React Native Web environment

### Authentication / External Services

- **Expo AuthSession**
- **Expo WebBrowser**
- Google OAuth integration
- Avatar resolution utilities

### Device APIs

- Camera
- Image Picker
- Local image handling
- Audio / Web Audio-based sound effects

---

## 📁 Project Structure

```text
CyberChic/
├── App.tsx
├── app.json
├── package.json
├── .gitignore
│
└── src/
    ├── types/
    │   └── wardrobe.ts
    │
    ├── theme/
    │   └── retroTheme.ts
    │
    ├── services/
    │   ├── soundEffects.ts
    │   ├── storage.ts
    │   ├── matchEngine.ts
    │   ├── dressMe.ts
    │   └── googleAuth.ts
    │
    ├── data/
    │   └── starterPack.ts
    │
    └── components/
        ├── retro/
        │   ├── LeopardBackground.tsx
        │   ├── RetroWindow.tsx
        │   ├── BevelButton.tsx
        │   ├── VerdictBanner.tsx
        │   └── CRTOverlay.tsx
        │
        ├── matcher/
        │   ├── GarmentCarouselCard.tsx
        │   ├── GarmentIllustration.tsx
        │   └── CategoryBar.tsx
        │
        ├── wardrobe/
        │   ├── BrowseModal.tsx
        │   ├── AddGarmentModal.tsx
        │   ├── LookbookModal.tsx
        │   └── GarmentDetailModal.tsx
        │
        ├── profile/
        │   └── UserProfileModal.tsx
        │
        └── auth/
            └── LoginModal.tsx
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- Expo-compatible development environment

### 1. Clone the repository

```bash
git clone https://github.com/dennysapopescu/CyberChic.git
cd CyberChic
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

### Run on the web

For the easiest way to explore the application:

```bash
npm run web
```

or:

```bash
npx expo start --web
```

The application will be available at:

```text
http://localhost:8081
```

### Run on a mobile device

Install **Expo Go** on your iPhone or Android device and scan the QR code displayed by Expo.

---

## 🔐 Authentication

CyberChic includes an authentication layer designed around **Expo AuthSession** and Google OAuth.

The repository currently contains the OAuth integration structure and configuration placeholders required for connecting Google authentication to a specific development environment.

To enable Google authentication for your own setup, you will need to configure the appropriate OAuth client IDs and redirect settings.

The application also supports local profiles, allowing the core wardrobe experience to be used without requiring a remote backend.

---

## 💾 Data & Privacy

CyberChic 95 is intentionally designed without a dedicated application backend.

Wardrobe, lookbook, profile, and application settings are persisted locally using **AsyncStorage** and, on web, the corresponding browser storage mechanism.

This means there is no CyberChic database storing your wardrobe on a remote server.

However, local storage should not be interpreted as absolute security or anonymity: data stored on a device is subject to that device's operating system, browser, backups, and other local security mechanisms.

---

## 📱 Platform Support

The project is built with React Native and Expo and targets:

- iOS
- Android
- Web

Tablet and desktop experiences are supported through the responsive UI, although the project is primarily designed as a cross-platform application rather than a native desktop application.

---

## 🧪 Development Notes

The project intentionally keeps the outfit matching logic separate from the presentation layer.

This makes it possible to evolve the fashion engine independently from the UI.

For example:

```text
Garment
   ↓
Color analysis
   ↓
Pattern analysis
   ↓
Style compatibility
   ↓
Season compatibility
   ↓
Match score
   ↓
Verdict + feedback
```

The same matching logic can then be reused by both:

- the manual outfit matcher
- the **DRESS ME** generator

---

## 🔮 Future Improvements

- [ ] Complete production Google OAuth configuration
- [ ] Add automated tests for the matching engine
- [ ] Add automated tests for wardrobe and profile persistence
- [ ] Improve outfit generation with more advanced search strategies
- [ ] Add personalized matching based on user preferences
- [ ] Add wardrobe statistics and insights
- [ ] Improve image management for custom garments
- [ ] Add cloud synchronization as an optional feature
- [ ] Add more _Clueless_-inspired easter eggs
- [ ] Prepare production builds for mobile distribution

---

## 🎯 Why I Built It

CyberChic 95 started with a simple question:

> **What if Cher Horowitz's computerized closet wasn't just a movie prop?**

I wanted to take that fictional idea and turn it into a real application — while deliberately keeping the playful, slightly ridiculous 90s computer aesthetic.

Technically, the project gave me an opportunity to work with:

- React Native
- Expo
- TypeScript
- Local persistence
- Device APIs
- Authentication flows
- Rule-based recommendation logic
- Responsive cross-platform UI
- Component-based architecture

But most importantly, it was an excuse to build something **fun**.

---

## 📌 Project Status

**CyberChic 95 is a personal portfolio project.**

It is currently intended for development and demonstration purposes and is **not published on the App Store or Google Play**.

The source code is publicly available on GitHub for anyone interested in exploring the implementation.

---

## 📄 License

This project is provided for educational and portfolio purposes.

See [`LICENSE`](LICENSE) for the applicable license.

---

## 🖤 Credits & Inspiration

Inspired by:

- _Clueless_ (1995)
- Cher Horowitz
- 90s fashion
- Windows 95-era interfaces
- The idea of a computerized wardrobe

**CyberChic 95 is an independent personal project and is not affiliated with, sponsored by, or endorsed by the creators or rights holders of _Clueless_.**
