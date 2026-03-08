# AWS Completion + GitHub Secret Safety Checklist

## 1) Fix the current schemes error
Your app can reach the Lambda URL, but the backend returns `Unknown action` for schemes.
Implement these actions in the deployed Lambda handler:
- `searchSchemes`
- `getSchemeDetails`

Expected request from app:
```json
{
  "action": "searchSchemes",
  "data": {
    "query": "farmer",
    "category": "all",
    "filters": {},
    "userProfile": {}
  }
}
```

Minimal handler pattern:
```js
const body = JSON.parse(event.body || "{}");
const { action, data } = body;

switch (action) {
  case "searchSchemes":
    return ok({ success: true, schemes: [] });
  case "getSchemeDetails":
    return ok({ success: true, scheme: null });
  default:
    return bad({ success: false, error: "Unknown action" });
}
```

## 2) AWS resources required
- Lambda Function URL endpoint in `eu-north-1`
- DynamoDB table: `BolBharat-Schemes`
- IAM policy for Lambda role:
  - `dynamodb:Scan`
  - `dynamodb:GetItem`
  - `dynamodb:Query`

## 3) Lambda Function URL settings
- `AuthType`: `NONE` (or use API Gateway/Cognito if you need protected APIs)
- CORS:
  - Methods: `POST, OPTIONS`
  - Headers: `Content-Type, Authorization`
  - Origin: `*` (or strict origin list)

## 4) App config to keep
Use only env values, no hardcoded secrets.
- `BolBharatApp/.env` for local runtime
- `BolBharatApp/.env.example` for template sharing

## 5) Prevent secret leaks to GitHub
Already done in this repo:
- Added `BolBharatApp/.env` ignore rules in `BolBharatApp/.gitignore`
- Added safe template `BolBharatApp/.env.example`

Before every push, run:
```powershell
Set-Location D:\BolBharatIdea_aws
git status
git ls-files | Select-String -Pattern "\.env$|\.pem$|\.key$|\.p12$|\.jks$"
```

If a secret file is tracked, untrack it:
```powershell
git rm --cached <file>
```

## 6) If credentials were ever committed
1. Rotate compromised credentials immediately.
2. Invalidate old keys/tokens.
3. Rewrite git history only if required by policy.
4. Enable GitHub secret scanning and push protection.

## 7) Quick backend test
```powershell
$body = @{ action='searchSchemes'; data=@{ query='farmer'; category='all'; filters=@{}; userProfile=@{} } } | ConvertTo-Json -Depth 6
Invoke-RestMethod -Method Post -Uri "https://YOUR-LAMBDA-URL/" -ContentType "application/json" -Body $body
```

Success criteria:
- Returns HTTP 200
- JSON includes `success: true`
- Includes `schemes` array
