# BolBharat (Voice for Bharat) - Design Document

## System Architecture Overview

BolBharat follows a serverless, cloud-native architecture built entirely on AWS services, designed for scalability, reliability, and cost-effectiveness.

### High-Level Architecture

```
[Mobile App (React Native)] 
    ↓ HTTPS/WebSocket
[API Gateway] 
    ↓
[Lambda Functions] 
    ↓
[AWS AI/ML Services] + [Data Storage]
```

## Component Design

### 1. Frontend - Mobile Application

**Technology**: React Native
**Platforms**: Android 8.0+, iOS 12.0+

#### Key Components:
- **VoiceInterface**: Handles voice input/output using device microphone and speakers
- **CameraModule**: Captures document images for OCR processing
- **OfflineManager**: Manages cached data and offline functionality
- **LanguageSelector**: Allows users to choose their preferred language
- **SchemeDisplay**: Shows government schemes in user-friendly format

#### State Management:
- Redux Toolkit for global state management
- AsyncStorage for local data persistence
- React Query for server state management

### 2. API Layer

**Technology**: Amazon API Gateway
**Protocol**: REST API with WebSocket support for real-time voice streaming

#### Endpoints:
- `POST /voice/transcribe` - Convert speech to text
- `POST /voice/synthesize` - Convert text to speech
- `POST /schemes/match` - Find relevant government schemes
- `POST /documents/process` - OCR and document analysis
- `POST /forms/assist` - Agentic form filling
- `GET /schemes/search` - Search government schemes
- `POST /users/profile` - User profile management

### 3. Backend Services

**Technology**: AWS Lambda (Node.js 18.x)
**Architecture**: Microservices with serverless functions

#### Core Services:

##### VoiceProcessingService
- **Function**: `transcribe-audio`
  - Integrates with Amazon Transcribe
  - Handles multiple Indian languages
  - Returns structured text with confidence scores

- **Function**: `synthesize-speech`
  - Integrates with Amazon Polly
  - Supports Indian voice models
  - Optimizes audio for low bandwidth

##### SchemeMatchingService
- **Function**: `analyze-user-input`
  - Uses AWS Bedrock (Claude 3 Sonnet) for intent classification
  - Extracts user demographics and needs
  - Returns structured user profile

- **Function**: `find-relevant-schemes`
  - Queries Amazon OpenSearch Serverless vector database
  - Implements RAG (Retrieval Augmented Generation)
  - Ranks schemes by relevance score

##### DocumentProcessingService
- **Function**: `extract-document-text`
  - Integrates with Amazon Textract for OCR
  - Handles government document formats
  - Returns structured document data

- **Function**: `simplify-document`
  - Uses AWS Bedrock for text simplification
  - Translates complex legal language
  - Generates audio-friendly summaries

##### FormAssistantService
- **Function**: `decompose-form`
  - Analyzes government forms
  - Creates conversational question flow
  - Maps form fields to simple questions

- **Function**: `process-user-responses`
  - Validates user inputs
  - Maps responses to form fields
  - Handles form submission

### 4. AI/ML Services

#### Amazon Transcribe
- **Configuration**: Custom vocabulary for Indian English and regional terms
- **Languages**: Hindi, Tamil, Telugu, English (Indian accent)
- **Features**: Real-time streaming, speaker identification

#### AWS Bedrock (Claude 3 Sonnet)
- **Use Cases**: 
  - Intent classification and entity extraction
  - Document simplification and summarization
  - Conversational form assistance
  - Scheme recommendation logic

#### Amazon OpenSearch Serverless
- **Purpose**: Vector database for government schemes
- **Features**: 
  - Semantic search using embeddings
  - Real-time indexing of new schemes
  - Faceted search by categories

#### Amazon Polly
- **Voices**: Indian English (Aditi, Raveena), Hindi (Aditi)
- **Features**: SSML support, neural voices, audio optimization

### 5. Data Storage

#### Amazon DynamoDB
**Tables**:
- `Users`: User profiles, preferences, and session data
- `Schemes`: Government scheme metadata and eligibility criteria
- `Applications`: User application history and status
- `Sessions`: Voice interaction logs and analytics

**Design Patterns**:
- Single-table design for related entities
- GSI for query patterns
- TTL for temporary session data

#### Amazon S3
**Buckets**:
- `audio-files`: Voice recordings and synthesized audio
- `documents`: Uploaded government documents and images
- `static-assets`: App resources and cached content

**Features**:
- Lifecycle policies for cost optimization
- Cross-region replication for disaster recovery
- CloudFront integration for global distribution

### 6. Security Architecture

#### Authentication & Authorization
- AWS Cognito for user authentication
- JWT tokens for API access
- Role-based access control (RBAC)

#### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- VPC endpoints for internal communication
- WAF for API protection

#### Privacy Compliance
- Data minimization principles
- User consent management
- Right to deletion implementation
- Audit logging with CloudTrail

## Data Flow Diagrams

### Voice Interaction Flow
```
User Voice Input → Mobile App → API Gateway → Lambda (Transcribe) 
→ Amazon Transcribe → Lambda (Process) → AWS Bedrock → Lambda (Response) 
→ Amazon Polly → Lambda (Synthesize) → API Gateway → Mobile App → Audio Output
```

### Scheme Matching Flow
```
User Query → Intent Analysis (Bedrock) → Profile Extraction → Vector Search (OpenSearch) 
→ Scheme Ranking → Response Generation (Bedrock) → Voice Synthesis (Polly) → User
```

### Document Processing Flow
```
Document Image → Mobile App → S3 Upload → Lambda Trigger → Amazon Textract 
→ Text Extraction → AWS Bedrock → Simplification → Translation → TTS → User
```

## Database Schema

### DynamoDB Table Structures

#### Users Table
```json
{
  "PK": "USER#<user_id>",
  "SK": "PROFILE",
  "user_id": "string",
  "phone_number": "string",
  "preferred_language": "string",
  "location": {
    "state": "string",
    "district": "string"
  },
  "demographics": {
    "occupation": "string",
    "income_range": "string",
    "family_size": "number"
  },
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Schemes Table
```json
{
  "PK": "SCHEME#<scheme_id>",
  "SK": "METADATA",
  "scheme_id": "string",
  "name": "string",
  "description": "string",
  "eligibility_criteria": ["string"],
  "benefits": ["string"],
  "application_process": "string",
  "documents_required": ["string"],
  "category": "string",
  "target_audience": ["string"],
  "embedding_vector": [number],
  "created_at": "timestamp"
}
```

### OpenSearch Index Structure
```json
{
  "mappings": {
    "properties": {
      "scheme_id": {"type": "keyword"},
      "name": {"type": "text", "analyzer": "multilingual"},
      "description": {"type": "text", "analyzer": "multilingual"},
      "category": {"type": "keyword"},
      "target_audience": {"type": "keyword"},
      "eligibility_vector": {"type": "dense_vector", "dims": 1536},
      "benefits_vector": {"type": "dense_vector", "dims": 1536}
    }
  }
}
```

## API Specifications

### Voice Transcription API
```yaml
POST /voice/transcribe
Content-Type: multipart/form-data

Request:
  audio_file: binary
  language: string (hi-IN, ta-IN, te-IN, en-IN)
  user_id: string

Response:
  transcript: string
  confidence: number
  language_detected: string
  processing_time: number
```

### Scheme Matching API
```yaml
POST /schemes/match
Content-Type: application/json

Request:
  user_query: string
  user_profile: object
  max_results: number (default: 5)

Response:
  schemes: [
    {
      scheme_id: string
      name: string
      relevance_score: number
      summary: string
      eligibility_match: boolean
    }
  ]
  processing_time: number
```

## Performance Considerations

### Latency Optimization
- **Voice Processing**: < 3 seconds end-to-end
- **Scheme Search**: < 2 seconds for vector similarity search
- **Document OCR**: < 10 seconds for standard documents

### Caching Strategy
- **Client-side**: Frequently accessed schemes, user preferences
- **CDN**: Static assets, audio files
- **Database**: Query result caching with 5-minute TTL

### Bandwidth Optimization
- **Audio Compression**: Opus codec at 16kbps for voice
- **Image Compression**: JPEG with 70% quality for documents
- **API Responses**: GZIP compression enabled

## Scalability Design

### Auto-scaling Configuration
- **Lambda**: Concurrent execution limit of 1000
- **DynamoDB**: On-demand billing with burst capacity
- **OpenSearch**: Auto-scaling based on CPU and memory usage

### Load Distribution
- **Geographic**: Multi-region deployment (Mumbai, Delhi)
- **Temporal**: Queue-based processing for non-real-time tasks
- **Service**: Microservices architecture for independent scaling

## Error Handling & Resilience

### Retry Mechanisms
- **Exponential Backoff**: For transient failures
- **Circuit Breaker**: For downstream service failures
- **Fallback Responses**: Cached or default responses

### Monitoring & Alerting
- **CloudWatch**: Custom metrics for voice processing accuracy
- **X-Ray**: Distributed tracing for performance analysis
- **SNS**: Real-time alerts for critical failures

## Correctness Properties

### Property 1: Voice Recognition Accuracy
**Description**: The system shall maintain voice recognition accuracy above 85% for supported languages.
**Test Strategy**: Property-based testing with diverse audio samples across different accents and noise levels.

### Property 2: Scheme Relevance
**Description**: Recommended schemes shall match user eligibility criteria with 90% accuracy.
**Test Strategy**: Generate user profiles and verify scheme recommendations against known eligibility rules.

### Property 3: Data Consistency
**Description**: User data shall remain consistent across all services and storage systems.
**Test Strategy**: Property-based testing of CRUD operations with concurrent access patterns.

### Property 4: Response Time Bounds
**Description**: Voice processing shall complete within 3 seconds for 95% of requests.
**Test Strategy**: Load testing with various audio lengths and network conditions.

### Property 5: Offline Functionality
**Description**: Core features shall work offline when cached data is available.
**Test Strategy**: Network partition testing with various offline scenarios.

## Testing Strategy

### Unit Testing
- **Coverage Target**: 80% code coverage
- **Framework**: Jest for JavaScript/TypeScript
- **Focus**: Individual function correctness

### Integration Testing
- **AWS Services**: LocalStack for local AWS service emulation
- **API Testing**: Postman/Newman for automated API testing
- **Database**: DynamoDB Local for integration tests

### Property-Based Testing
- **Framework**: fast-check for JavaScript
- **Properties**: Voice accuracy, scheme matching, data consistency
- **Generators**: Custom generators for Indian names, addresses, audio patterns

### End-to-End Testing
- **Framework**: Detox for React Native
- **Scenarios**: Complete user journeys from voice input to scheme application
- **Devices**: Testing on various Android/iOS devices

### Performance Testing
- **Load Testing**: Artillery.js for API load testing
- **Voice Processing**: Synthetic audio generation for scale testing
- **Database**: DynamoDB performance testing with realistic data volumes

## Deployment Architecture

### Environment Strategy
- **Development**: Single region, minimal resources
- **Staging**: Production-like setup for final testing
- **Production**: Multi-region with full monitoring

### CI/CD Pipeline
```yaml
Stages:
  1. Code Quality: ESLint, Prettier, TypeScript checks
  2. Unit Tests: Jest test execution
  3. Integration Tests: AWS service integration
  4. Security Scan: SAST/DAST security analysis
  5. Build: React Native and Lambda function builds
  6. Deploy: Staged deployment with health checks
  7. E2E Tests: Automated user journey testing
  8. Production Deploy: Blue-green deployment
```

### Infrastructure as Code
- **AWS CDK**: TypeScript-based infrastructure definition
- **Version Control**: Git-based infrastructure versioning
- **Environment Parity**: Consistent environments across stages

## Monitoring & Observability

### Application Metrics
- Voice processing accuracy and latency
- Scheme matching relevance scores
- User engagement and retention rates
- Error rates and failure patterns

### Infrastructure Metrics
- Lambda function performance and errors
- DynamoDB read/write capacity utilization
- API Gateway request rates and latencies
- S3 storage usage and transfer rates

### Business Metrics
- Daily/monthly active users
- Scheme application completion rates
- User satisfaction scores
- Cost per user acquisition

### Alerting Strategy
- **Critical**: Service outages, data corruption
- **Warning**: Performance degradation, high error rates
- **Info**: Capacity thresholds, usage patterns

This design document provides a comprehensive blueprint for implementing BolBharat as a scalable, reliable, and user-friendly voice-first government scheme assistant.