# CyberChic 95 (Clueless Wardrobe) 👗✨

O aplicație universală de modă cross-platform (**iOS, Android, Tabletă, Web & Desktop**) inspirată din celebrul sistem digital de garderobă folosit de **Cher Horowitz** în filmul cult **Clueless (1995)**.

Construită cu **Expo SDK 57 (React Native + Expo Web)** și **TypeScript**, aplicația include:
- Motor inteligent de matching bazat pe teoria culorilor (HSL), armonie de tipare și compatibilitate stilistică pentru **orice haine adăugate de utilizator**.
- Sistem multi-utilizator cu persistență locală complet izolată per cont (`AsyncStorage`).
- Autentificare reală **Google OAuth 2.0** și rezoluție live a avatarelor prin Google/Gravatar.
- Avatare foto personalizate prin cameră (`📸 SNAP SELFIE`) sau galerie (`🖼️ FROM GALLERY`), plus selector liber de emoji (`＋`).
- Zero costuri de găzduire, 100% confidențialitate pe dispozitiv.

---

## 🚀 Cum Se Rulează Aplicația (Quick Start)

### Pasul 1: Instalare Dependențe (la prima clonare)
```bash
npm install
```

---

### Pasul 2: Pornire Aplicație

#### 💻 Opțiunea A: În Browser (Recomandat pentru Desktop / Portofoliu)
```bash
npm run web
```
*sau:*
```bash
npx expo start --web
```
🌐 Aplicația se deschide automat în browser la: **`http://localhost:8081`** recreând estetica unui monitor retro Windows 95 pe fundal leopard.

---

#### 📱 Opțiunea B: Pe Telefon (iPhone sau Android prin Expo Go — Gratuit)
1. Descarcă gratuit aplicația **Expo Go** din [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779) sau [Google Play (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent).
2. În terminalul din calculator, pornește serverul Expo:
   ```bash
   npx expo start
   ```
3. Scanează codul QR afișat în terminal:
   - **Pe iPhone:** Deschide aplicația **Camera** nativă și apasă notificarea galbenă *„Open in Expo Go”*.
   - **Pe Android:** Deschide aplicația **Expo Go** și apasă *„Scan QR code”*.

---

## 🧠 Motorul de Matching Inteligent & Dinamic

Spre deosebire de un sistem cu reguli rigide, [`matchEngine.ts`](src/services/matchEngine.ts) folosește un algoritm multi-dimensional de fashion theory care evaluează armonios **atât hainele predefinite, cât și orice piesă nouă adăugată de utilizator**:

1. **Teoria Culorilor & Armonie Cromatică (Pondere 35%):**
   - Conversie Hexadecimal $\rightarrow$ HSL (Hue, Saturation, Lightness).
   - **Detectare Neutre:** Negru, alb, fildeș, gri, cămilă/bej și denim. Orice piesă neutră ancorează o culoare vibrantă (scor $\ge 94\%$).
   - **Monocromie & Ton-pe-ton:** $\Delta H \le 25^\circ$ cu variație de luminozitate pentru profunzime elegantă ($\sim 93\%$).
   - **Armonie Analoagă:** Nuanțe vecine pe cercul culorilor ($25^\circ < \Delta H \le 65^\circ$) ($\sim 90\%$).
   - **Contrast Complementar:** Nuanțe opuse ($145^\circ - 215^\circ$) cu saturație controlată ($\sim 88\%$).
   - **Clash Primar Penalizat:** Roșu aprins + galben saturat fără ancoră neutră este penalizat drastic ($\le 25\%$).

2. **Echilibru de Tipare & Texturi (Pondere 30%):**
   - **Piesă Statement + Piesă Neutră:** Regula de aur în modă (carouri/animal print/floral + solid neted) $\rightarrow$ scor maxim ($\sim 95\%$).
   - **Clash de Printuri:** Două carouri diferite sau combinații conflictuale (ex: carouri + animal print) declanșează replica Cher de alertă ($\le 20\%$).
   - **Textură Luminate:** Piese metalice sau satinate evaluate cu bonus de textură.

3. **Compatibilitate Stilistică & Formalitate (Pondere 25%):**
   - Matrice de compatibilitate între stiluri (`School`, `Chic`, `Party`, `Casual`, `Grunge`).
   - Evită nepotrivirile severe de formalitate (ex: top couture de petrecere cu pantaloni de trening slouchy $\rightarrow$ scor $\le 35\%$).

4. **Compatibilitate Sezonieră (Pondere 10%):**
   - Piese din sezoane complementare sau piese pentru toate sezoanele (`All`).

5. **Easter Eggs Iconice Clueless (Prioritate 100%):**
   - Setul galben în carouri (*Yellow Plaid*) și rochia roșie Alaïa sunt recunoscute instant cu statutul **ICONIC MATCH** ($100\%$).

---

## 🔐 Autentificare & Stocare per Utilizator

- **Instalare Curată (Zero conturi hardcodate):** La prima lansare, aplicația întâmpină utilizatorul cu asistentul de configurare: `FIRST TIME SETUP WIZARD`.
- **Autentificare Google (Gmail):** Buton dedicat `🔴 SIGN IN WITH GOOGLE (GMAIL)` folosind standardul **OAuth 2.0** (`expo-auth-session` + `WebBrowser`). Include rezoluție dinamică prin `unavatar.io` pentru a prelua live poza publică a contului Google asociat.
- **Dulap Offline Privat:** Posibilitatea de a crea oricând un profil local 100% privat, fără internet.
- **Izolare Totală a Datelor:** Piesele vestimentare și lookbook-urile sunt izolate strict pe bază de chei unice (`@cyberchic_garments_user_${userId}` și `@cyberchic_lookbook_user_${userId}`).
- **Avatare Personalizate („Add Yours”):**
  - Buton `📸 SNAP SELFIE` pentru poză pe loc cu camera.
  - Buton `🖼️ FROM GALLERY` pentru orice fotografie din memoria dispozitivului.
  - Buton `＋` pentru a introduce liber orice emoji preferat (`🦄`, `🍒`, `🦋`, `🖤`, etc.).

---

## 📁 Structura Proiectului

```
CyberChic/
├── App.tsx                          # Componenta rădăcină (SafeAreaProvider, Carusele, Stări)
├── app.json                         # Configurație Expo (bundleIdentifier, permisiuni cameră)
├── package.json                     # Dependențe Expo SDK 57, React 19, TypeScript
├── .gitignore                       # Filtrare securizată fișiere pentru GitHub
├── src/
│   ├── types/
│   │   └── wardrobe.ts              # Interfețe TypeScript (Garment, Outfit, UserAccount)
│   ├── theme/
│   │   └── retroTheme.ts            # Culori pastelate anii '90, texturi și bevels Windows 95
│   ├── services/
│   │   ├── soundEffects.ts          # Sintetizator Web Audio retro (fără fișiere audio externe)
│   │   ├── storage.ts               # Persistență AsyncStorage partiționată per user
│   │   ├── matchEngine.ts           # Algoritm matematic de armonie cromatică HSL & replici Cher
│   │   ├── dressMe.ts               # Generatorul automat de ținute (slot machine)
│   │   └── googleAuth.ts            # Serviciu Google OAuth 2.0 & Unavatar profile resolver
│   ├── data/
│   │   └── starterPack.ts           # Hainele iconice din filmul Clueless
│   └── components/
│       ├── retro/
│       │   ├── LeopardBackground.tsx # Fundal vectorial imprimat leopard
│       │   ├── RetroWindow.tsx       # Fereastră retro Windows 95 cu bară de titlu și avatar
│       │   ├── BevelButton.tsx       # Butoane 3D reliefate cu feedback tactil & audio
│       │   ├── VerdictBanner.tsx     # Banner intermitent MATCH! vs. MIS-MATCH!
│       │   └── CRTOverlay.tsx        # Linii de scanare CRT opționale
│       ├── matcher/
│       │   ├── GarmentCarouselCard.tsx # Carusele sincronizate cu butoane << | >> și swipe
│       │   ├── GarmentIllustration.tsx # Ilustrații vectoriale de înaltă fidelitate
│       │   └── CategoryBar.tsx         # Bara inferioară de navigare și dock de comenzi
│       ├── wardrobe/
│       │   ├── BrowseModal.tsx       # Explorator inventar haine
│       │   ├── AddGarmentModal.tsx   # Adăugare haine prin cameră foto sau galerie
│       │   ├── LookbookModal.tsx     # Arhiva de ținute salvate cu echipare la un clic
│       │   └── GarmentDetailModal.tsx # Inspector detalii textile și materiale
│       ├── profile/
│       │   └── UserProfileModal.tsx  # Legitimație membru VIP, schimbare nume și selfie
│       └── auth/
│           └── LoginModal.tsx        # Login Google, creare conturi, cameră selfie și emoji +
```

---

## 📤 Publicare pe GitHub

Repository-ul este curățat și configurat cu un fișier [`.gitignore`](.gitignore) strict, care **blochează** automat:
- `node_modules/`
- `.env*` (chei secrete și variabile de mediu)
- `.expo/` (stări locale și cache de dezvoltator)
- `dist/` & `web-build/` (build-uri generate)
- `.claude/` și configurări interne de IDE
- `.DS_Store` și fișiere de sistem

### Comenzi pentru a urca proiectul pe contul tău de GitHub:

1. **Creează un repository nou** pe [GitHub.com](https://github.com/new) (ex: `CyberChic`).
2. **Rulează în terminalul proiectului:**
   ```bash
   git add .
   git commit -m "feat: CyberChic 95 Clueless Wardrobe initial release"
   git remote add origin https://github.com/USERNAME/CyberChic.git
   git branch -M main
   git push -u origin main
   ```
*(Înlocuiește `USERNAME` cu numele tău de utilizator de pe GitHub).*

---

## 💎 Zero Costuri de Găzduire & Confidențialitate
Toate datele, pozele și garderobele sunt stocate în siguranță pe dispozitiv prin `AsyncStorage` / Web Storage. Aplicația funcționează perfect offline, fără servere scumpe sau abonamente lunare.
