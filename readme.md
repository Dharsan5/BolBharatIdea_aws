# BolBharat (बोलभारत) — Voice for Bharat

> **Voice-First AI Assistant for Government Schemes in India**

[![AWS](https://img.shields.io/badge/AWS-Cloud%20Native-orange)](https://aws.amazon.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.83-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2055-purple)](https://expo.dev/)
[![AI/ML](https://img.shields.io/badge/AI-AWS%20Bedrock-green)](https://aws.amazon.com/bedrock/)
[![License](https://img.shields.io/badge/License-Private-lightgrey)]()

BolBharat is a **Generative AI-powered, voice-first mobile assistant** designed to bridge the digital divide in India. It empowers rural and semi-literate citizens to access government schemes through natural voice commands in **Hindi, Tamil, Telugu, and Hinglish**.

---

## 🎯 Problem Statement

Millions of rural and semi-literate citizens cannot access critical government schemes (crop loans, healthcare, subsidies) because existing digital portals are:
- 📝 Text-heavy and complex
- 🌐 English-dominant
- 🖥️ Require advanced digital literacy

## 💡 Our Solution

BolBharat acts as an intelligent intermediary that:
- **Understands Voice** — Natural language processing in local dialects
- **Simplifies Complexity** — Breaks down complex forms into simple conversations
- **Matches Schemes** — AI-powered recommendations based on user needs
- **Acts on Behalf** — Agentic AI that fills forms and checks status autonomously

---

## ✨ Key Features

### 🎤 Multi-Lingual Voice Interaction
- Supports continuous two-way conversation in local dialects (Hindi, Tamil, Telugu) and mixed languages (Hinglish)
- Real-time speech-to-text and text-to-speech
- Animated voice visualization with responsive blob animation
- Works in noisy environments with 85%+ accuracy target

### 🎯 Scheme Matchmaker
- Describe your situation verbally
- Get personalized government scheme recommendations
- Category-based browsing (Agriculture, Healthcare, Education, Social Welfare, Women Empowerment, Housing, Financial Services)
- Search and filter functionality

### 📄 Document Simplifier
- Camera integration and gallery picker for document capture
- OCR processing with simulated text extraction
- Get simplified explanations in your preferred language
- Recent documents history

### 🤖 Agentic Form Filling
- AI Form Assistant with conversational question flow
- Step-by-step guided form filling (Ration Card, Health Card, Crop Insurance)
- Input validation and progress tracking
- Form preview/summary before submission

### 📱 Offline Mode
- Toggle offline mode from profile settings
- Local data persistence with AsyncStorage
---

## 🏗️ Architecture

```
┌─────────────────────────┐
│   React Native App      │
│   (Expo SDK 55)         │
│   Android / iOS         │
└───────────┬─────────────┘
            │ HTTPS / WebSocket
┌───────────▼─────────────┐
│    Amazon API Gateway   │
│    (REST + WebSocket)   │
└───────────┬─────────────┘
            │
┌───────────▼─────────────────────────────┐
│          AWS Lambda Functions           │
│   (Node.js Microservices)               │
│   • VoiceProcessingService              │
│   • SchemeMatchingService               │
│   • DocumentProcessingService           │
│   • FormAssistantService                │
└───────────┬─────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│          AWS AI/ML Services             │
│   • Amazon Transcribe (Speech-to-Text)  │
│   • AWS Bedrock / Claude 3 Sonnet (LLM) │
│   • Amazon OpenSearch (Vector DB / RAG) │
│   • Amazon Polly (Text-to-Speech)       │
│   • Amazon Textract (OCR)               │
└─────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────┐
│          Data Storage                   │
│   • DynamoDB (Users, Schemes, Sessions) │
│   • S3 (Audio, Documents, Assets)       │
│   • CloudFront (CDN)                    │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile** | React Native 0.83 + Expo SDK 55 | Cross-platform mobile app |
| **Navigation** | React Navigation 7 (Bottom Tabs + Native Stack) | Screen navigation |
| **UI/Fonts** | ClashDisplay custom font family (6 weights) | Premium typography |
| **Icons** | @expo/vector-icons (Ionicons + MaterialCommunityIcons) | Icon system |
| **i18n** | Custom LanguageContext + translations | Multi-language support |
| **Storage** | AsyncStorage | Local persistence |
| **Camera** | expo-image-picker | Document capture |
| **Audio** | expo-av | Voice recording/playback |
| **Backend (Planned)** | AWS Lambda + API Gateway | Serverless compute |
| **AI (Planned)** | AWS Bedrock (Claude 3 Sonnet) | AI reasoning |
| **STT (Planned)** | Amazon Transcribe | Speech-to-text |
| **TTS (Planned)** | Amazon Polly | Text-to-speech |
| **OCR (Planned)** | Amazon Textract | Document OCR |
| **Search (Planned)** | Amazon OpenSearch Serverless | Vector search / RAG |

---

## 📁 Project Structure

```
BolBharatApp/
├── App.js                          # Root component (font loading, splash screen, providers)
├── index.js                        # Entry point
├── package.json                    # Dependencies & scripts
├── app.json                        # Expo configuration
│
├── assets/
│   └── Fonts/                      # ClashDisplay font family (7 files)
│       ├── ClashDisplay-Bold.ttf
│       ├── ClashDisplay-Semibold.ttf
│       ├── ClashDisplay-Medium.ttf
│       ├── ClashDisplay-Regular.ttf
│       ├── ClashDisplay-Light.ttf
│       ├── ClashDisplay-Extralight.ttf
│       └── ClashDisplay-Variable.ttf
│
└── src/
    ├── components/
    │   └── AnimatedBlob.js         # Voice visualization blob with pulse/scale/rotate animations
    │
    ├── i18n/
    │   ├── LanguageContext.js       # React Context for language state management
    │   └── translations.js         # Full translations: English, Hindi, Tamil, Telugu, Hinglish
    │
    ├── navigation/
    │   ├── index.js                # Root navigator (NavigationContainer)
    │   ├── BottomTabNavigator.js   # 5-tab navigation (Home, Schemes, Documents, Forms, Profile)
    │   └── HomeStackNavigator.js   # Stack navigator (Home → VoiceRecorder)
    │
    ├── screens/
    │   ├── HomeScreen.js           # Dashboard with voice interface & quick actions
    │   ├── VoiceRecorderScreen.js  # Full-screen voice interaction with simulated AI responses
    │   ├── SchemesScreen.js        # Government schemes browser with categories & search
    │   ├── DocumentsScreen.js      # Document scanner with camera/gallery & OCR simulation
    │   ├── FormsScreen.js          # AI form assistant with conversational Q&A flow
    │   └── ProfileScreen.js        # User profile, language/location settings, offline toggle
    │
    └── theme/
        ├── index.js                # Theme barrel export
        ├── colors.js               # Monochrome color palette (white/black/grays)
        ├── fonts.js                # ClashDisplay font configuration
        ├── spacing.js              # Spacing scale
        └── typography.js           # Typography styles
```

---

## ✅ What's Been Built So Far

### 🎨 Design System
- [x] **Monochrome color theme** — Clean white/black/gray palette
- [x] **Custom typography** — ClashDisplay font family with 6 weights (ExtraLight → Bold)
- [x] **Consistent spacing** — Reusable spacing scale
- [x] **Splash screen** — Loading state while fonts load

### 🧭 Navigation
- [x] **Bottom Tab Navigator** — 5 tabs: Home, Schemes, Documents, Forms, Profile
- [x] **Stack Navigator** — Home → Voice Recorder transition (slide-from-bottom animation)
- [x] **Tab icons** — Ionicons with filled/outline states for active/inactive

### 📱 Screens (6 Screens Implemented)

#### 1. Home Screen (`HomeScreen.js`)
- [x] Dashboard layout with voice assistant card
- [x] Mic button with animated scale effect
- [x] Real-time amplitude visualization
- [x] Transcript display area
- [x] Quick action navigation to Voice Recorder
- [x] Localized UI text

#### 2. Voice Recorder Screen (`VoiceRecorderScreen.js`)
- [x] Full-screen voice interaction interface
- [x] **AnimatedBlob component** — Animated visualization that responds to voice amplitude (scale, pulse, rotate)
- [x] Start/stop recording with animated button
- [x] **Simulated multilingual transcripts** — Demo responses in Hindi, Tamil, Telugu, Hinglish, English
- [x] **Simulated AI responses** — Language-appropriate AI responses about PMFBY (crop insurance)
- [x] Transcript + AI response display cards
- [x] Clear & retry functionality

#### 3. Schemes Screen (`SchemesScreen.js`)
- [x] Search bar for filtering schemes
- [x] Category tabs (All, Agriculture, Healthcare, Education, Social Welfare, Women Empowerment, Housing, Financial Services)
- [x] Scheme cards with details
- [x] "View Details" action
- [x] Fully localized category names and UI

#### 4. Documents Screen (`DocumentsScreen.js`)
- [x] Camera integration (take photo) with permission handling
- [x] Image gallery picker
- [x] OCR processing simulation with loading state
- [x] Simplified document result display
- [x] "How it works" guide (3-step explanation)
- [x] Recent documents section

#### 5. Forms Screen (`FormsScreen.js`)
- [x] AI Form Assistant with robot icon header
- [x] Available forms list (Ration Card, Health Card, Crop Insurance)
- [x] **Conversational form filling** — Step-by-step question flow
- [x] Text input with validation
- [x] Progress tracking (question X of Y)
- [x] Form summary/preview before submission
- [x] Success confirmation with animation
- [x] Saved drafts section

#### 6. Profile Screen (`ProfileScreen.js`)
- [x] User avatar and profile info (name, phone)
- [x] **Language selector modal** — Switch between English, Hindi, Tamil, Telugu, Hinglish
- [x] **Location selector modal** — Choose from Indian states
- [x] **Edit profile modal** — Update name and phone
- [x] Offline mode toggle with AsyncStorage persistence
- [x] Settings sections (My Applications, Privacy Settings, FAQs, Contact Support, About)
- [x] App version display

### 🌐 Internationalization (i18n)
- [x] **5 languages fully supported**: English, Hindi (हिंदी), Tamil (தமிழ்), Telugu (తెలుగు), Hinglish
- [x] **60+ translation keys** per language covering all screens
- [x] **LanguageContext provider** — React Context API for global language state
- [x] **Persistent language preference** — Saved to AsyncStorage, restored on app launch
- [x] **Dynamic UI updates** — All labels, buttons, and text update in real-time on language change

### 🎨 Custom Components
- [x] **AnimatedBlob** — SVG-like animated blob with:
  - Continuous rotation animation
  - Pulse effect when listening
  - Amplitude-responsive scaling
  - Smooth transitions using `Animated` API

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Expo Go** app on your Android/iOS device (for quick testing)
- Or **Android Studio** / **Xcode** (for emulator)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Dharsan5/BolBharatIdea_aws.git
cd BolBharatIdea_aws/BolBharatApp

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start

# 4. Run on device/emulator
# Press 'a' for Android or 'i' for iOS
# Or scan the QR code with Expo Go app
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run web` | Start web version |

---

## 📊 Project Status

**Current Phase**: Mobile App Frontend (UI Complete)  
**Next Phase**: AWS Backend Integration

| Component | Status |
|-----------|--------|
| Mobile App UI | ✅ Complete |
| Navigation | ✅ Complete |
| Multi-language Support | ✅ Complete (5 languages) |
| Voice UI (Frontend) | ✅ Complete |
| Document Scanner UI | ✅ Complete |
| Form Assistant UI | ✅ Complete |
| Profile & Settings | ✅ Complete |
| AWS Backend Services | 🔲 Planned |
| Real Speech-to-Text (Transcribe) | 🔲 Planned |
| Real Text-to-Speech (Polly) | 🔲 Planned |
| AI Reasoning (Bedrock) | 🔲 Planned |
| Document OCR (Textract) | 🔲 Planned |
| Vector Search / RAG (OpenSearch) | 🔲 Planned |
| User Authentication (Cognito) | 🔲 Planned |

---

## 📚 Documentation

- **[Requirements Document](./Docs/requirements.md)** — Functional & non-functional requirements
- **[Design Document](./Docs/design.md)** — System architecture & technical design
- **[TODO List](./todo.md)** — Full project roadmap & task tracking

---

## 👥 Team

Built for the **AI for Bharat Hackathon** by [Dharsan5](https://github.com/Dharsan5)

## 🙏 Acknowledgments

- AWS for cloud infrastructure
- AI for Bharat initiative
- Government of India for open scheme data
- Expo and React Native open-source community

For questions or support, please reach out to:
- **Email**: support@bolbharat.in
- **Twitter**: @BolBharat
- **Website**: https://bolbharat.in

---

**Made with ❤️ for Bharat**
***Made by Dharsan SP , Yuga Bharathi J**
