# Mobile API Contracts & Client SDK Generation (Phase 11)

This package contains the decoupled OpenAPI 3.0 contract specification for the **Ausbildung Preparation Portal**.
It enables cross-platform mobile apps (**Flutter / Dart** and **React Native / TypeScript**) to automatically generate fully-typed API clients without rebuilding or duplicating any backend business logic.

---

## 1. Specification File
- **Source:** [`openapi.json`](./openapi.json) (73 distinct REST API endpoints across Auth, Learning, Jobs, Courses, DIN 5008 Toolkit, WebRTC Speaking, Coins, and Dashboards).
- **Regenerate Contract:**
  ```bash
  cd apps/api
  npm run export:openapi
  ```

---

## 2. Generating the Flutter Client (Dart)

### Prerequisites
Install the OpenAPI Generator CLI:
```bash
npm install -g @openapitools/openapi-generator-cli
```

### Code Generation Command
From `packages/mobile-contracts`:
```bash
openapi-generator-cli generate \
  -i openapi.json \
  -g dart-dio \
  -o ./clients/flutter_client \
  --additional-properties=pubName=ausbildung_api,pubAuthor="Ausbildung Portal Team",pubVersion=1.0.0
```

### Flutter Integration Example
Add the generated package to your Flutter project's `pubspec.yaml`:
```yaml
dependencies:
  flutter:
    sdk: flutter
  ausbildung_api:
    path: ../packages/mobile-contracts/clients/flutter_client
```

Usage in Dart:
```dart
import 'package:ausbildung_api/api.dart';

final client = AusbildungApi(
  basePathOverride: 'https://api.ausbildung-portal.de/api/v1',
);

// Authenticate candidate
final authResponse = await client.getAuthApi().login(
  loginDto: LoginDto((b) => b
    ..email = 'candidate@example.de'
    ..password = 'SecurePassword123!'),
);

// Set bearer token for subsequent calls
client.setBearerAuth('bearer', authResponse.data!.tokens.accessToken);

// Query Bundesagentur live jobs
final jobs = await client.getJobsApi().searchJobs(
  query: 'Pflegefachkraft',
  city: 'München',
);
```

---

## 3. Generating the React Native Client (TypeScript / Axios)

### Code Generation Command
```bash
openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./clients/react_native_client \
  --additional-properties=npmName=@ausbildung/mobile-sdk,npmVersion=1.0.0,supportsES6=true
```

### React Native Integration Example
```typescript
import { Configuration, AuthApi, JobsApi } from '@ausbildung/mobile-sdk';

const config = new Configuration({
  basePath: 'https://api.ausbildung-portal.de/api/v1',
  accessToken: async () => await SecureStore.getItemAsync('accessToken'),
});

const jobsApi = new JobsApi(config);
const response = await jobsApi.searchJobs('Informatiker', 'Berlin');
console.log(response.data.data.items);
```

---

## 4. Mobile API Guarantees
1. **Decoupled Architecture:** All business rules (quiz scoring, coin balance validation, double-entry ledger transactions, WebRTC room generation) are strictly server-enforced.
2. **Offline-Safe Caching:** Endpoints include `ETag` and standard caching headers to support mobile offline storage.
3. **Double-Spend & Token Theft Protection:** Mobile apps receive short-lived JWT access tokens (15m) and single-use refresh token rotation with immediate session revocation upon token theft detection.
