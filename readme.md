# BolBharat (Voice for Bharat)

> **Voice-First AI Assistant for Government Schemes in India**

[![AWS](https://img.shields.io/badge/AWS-Cloud%20Native-orange)](https://aws.amazon.com/)
[![React Native](https://img.shields.io/badge/React%20Native-Mobile-blue)](https://reactnative.dev/)
[![AI/ML](https://img.shields.io/badge/AI-AWS%20Bedrock-green)](https://aws.amazon.com/bedrock/)

BolBharat is a Generative AI-powered, voice-first mobile assistant designed to bridge the digital divide in India. It empowers rural and semi-literate citizens to access government schemes through natural voice commands in Hindi, Tamil, Telugu, and Hinglish.

## 🎯 Problem Statement

Millions of rural and semi-literate citizens cannot access critical government schemes (crop loans, healthcare, subsidies) because existing digital portals are:
- Text-heavy and complex
- English-dominant
- Require advanced digital literacy

## 💡 Our Solution

BolBharat acts as an intelligent intermediary that:
- **Understands Voice**: Natural language processing in local dialects
- **Simplifies Complexity**: Breaks down complex forms into simple conversations
- **Matches Schemes**: AI-powered recommendations based on user needs
- **Acts on Behalf**: Agentic AI that fills forms and checks status autonomously

## ✨ Key Features

### 🎤 Multilingual Voice Interface
- Real-time speech-to-text in Hindi, Tamil, Telugu, and Hinglish
- Natural text-to-speech responses in regional languages
- Works in noisy environments with 85%+ accuracy

### 🎯 Scheme Matchmaker
- Describe your situation verbally
- Get personalized government scheme recommendations
- Understand eligibility in simple terms

### 📄 Document Simplifier
- Take a photo of government notices
- Get instant OCR and simplification
- Listen to explanations in your language

### 🤖 Agentic Form Filling
- Answer simple questions conversationally
- AI fills complex government forms automatically
- Submit applications without navigation complexity

### 📱 Low-Bandwidth Mode
- Works efficiently on 2G/3G networks
- Offline mode for cached content
- Smart data synchronization

## 🏗️ Architecture

```
┌─────────────────────┐
│  React Native App   │
│  (Android/iOS)      │
└──────────┬──────────┘
           │ HTTPS
┌──────────▼──────────┐
│   API Gateway       │
│   (REST/WebSocket)  │
└──────────┬──────────┘
           │
┌──────────▼──────────────────────────────┐
│         AWS Lambda Functions            │
│  (Node.js Microservices)                │
└──────────┬──────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│         AWS AI/ML Services              │
│  • Amazon Transcribe (ASR)              │
│  • AWS Bedrock (Claude 3 Sonnet)        │
│  • Amazon OpenSearch (Vector DB)        │
│  • Amazon Polly (TTS)                   │
│  • Amazon Textract (OCR)                │
└─────────────────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│         Data Storage                    │
│  • DynamoDB (User Data)                 │
│  • S3 (Files & Audio)                   │
└─────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Redux Toolkit** - State management
- **React Query** - Server state management

### Backend
- **AWS Lambda** - Serverless compute
- **Amazon API Gateway** - API management
- **Node.js 18.x** - Runtime environment

### AI/ML Services
- **Amazon Transcribe** - Speech-to-text
- **AWS Bedrock (Claude 3 Sonnet)** - AI reasoning and generation
- **Amazon OpenSearch Serverless** - Vector search
- **Amazon Polly** - Text-to-speech
- **Amazon Textract** - OCR

### Data Storage
- **Amazon DynamoDB** - NoSQL database
- **Amazon S3** - Object storage
- **Amazon CloudFront** - CDN

### DevOps
- **AWS CDK** - Infrastructure as Code
- **GitHub Actions** - CI/CD
- **AWS CloudWatch** - Monitoring
- **AWS X-Ray** - Distributed tracing

## 📚 Documentation

Detailed documentation is available in the [`Docs/`](./Docs/) folder:

- **[Requirements Document](./Docs/requirements.md)** - Detailed functional and non-functional requirements
- **[Design Document](./Docs/design.md)** - System architecture and technical design
- **[TODO List](./todo.md)** - Project roadmap and task tracking

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **AWS Account** with appropriate permissions
- **React Native** development environment
- **AWS CLI** configured
- **Android Studio** or **Xcode** for mobile development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bolbharat.git
   cd bolbharat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS credentials**
   ```bash
   aws configure
   ```

4. **Deploy infrastructure**
   ```bash
   cd infrastructure
   npm install
   cdk deploy
   ```

5. **Run mobile app**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
AWS_REGION=ap-south-1
API_GATEWAY_URL=your-api-gateway-url
COGNITO_USER_POOL_ID=your-user-pool-id
COGNITO_CLIENT_ID=your-client-id
S3_BUCKET_NAME=your-s3-bucket
```

## 📊 Project Status

**Current Phase**: Planning and Design  
**Target Launch**: Q4 2026

See [todo.md](./todo.md) for detailed project roadmap.

## 🎯 Success Metrics

- **User Adoption**: 10,000+ active users within 6 months
- **Voice Accuracy**: 85%+ recognition accuracy
- **Form Completion**: 90%+ success rate
- **User Retention**: 70%+ after first month
- **User Satisfaction**: 4.0+ out of 5.0

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Built for the **AI for Bharat Hackathon**

## 🙏 Acknowledgments

- AWS for providing cloud infrastructure
- AI for Bharat initiative
- Government of India for open scheme data
- Open-source community

## 📧 Contact

For questions or support, please reach out to:
- **Email**: support@bolbharat.in
- **Twitter**: @BolBharat
- **Website**: https://bolbharat.in

---

**Made with ❤️ for Bharat**
***Made by Dharsan SP , Yuga Bharathi J**
