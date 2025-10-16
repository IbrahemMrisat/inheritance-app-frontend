# Inheritance GPT Web App — Roadmap

**Cadence:** 3–4 hours per day, 3–4 days per week. **Start time:** 10:00.

## Week 1 — Setup & Foundations

### Day 1 — GitHub & Project Scaffolding (10:00–13:30)
- Install Node 20+, Git, and your editor.
- Scaffold React + Vite (TypeScript) project.
- Add Tailwind and required dependencies.
- Replace source with provided app skeleton (routes, auth, api client).
- Initialize Git repo and push to GitHub.
- Add README with build/run instructions.

### Day 2 — Cloudflare Pages + Cognito (10:00–13:30)
- Create Cloudflare Pages project; connect the GitHub repo.
- Build command: `npm run build`; Output dir: `dist`.
- Add env vars: `VITE_API_BASE`, `VITE_COGNITO_DOMAIN`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_REDIRECT_URI`.
- Create Cognito User Pool + App Client (public client, implicit flow).
- Configure callback/sign-out URLs and Hosted UI domain.
- Deploy Pages and test login round-trip.

### Day 3 — Backend (SAM, API Gateway, S3, Cognito JWT) (10:00–14:00)
- Request ACM certificate for `api.yourdomain.com` (DNS validate via Cloudflare).
- Deploy SAM stack with: DataBucketName, AllowedOrigins, CognitoUserPoolId, CognitoAppClientId.
- (Optional) Add ApiCustomDomainName + ApiCertificateArn.
- Verify S3 bucket and API endpoints; test 401 without token, 200 with token.

### Day 4 — Wire Frontend ↔ Backend & E2E Test (10:00–13:30)
- Set `VITE_API_BASE` to the real API domain; redeploy Pages.
- Login → create a new case → view results (tables + pie chart).
- Confirm Authorization header includes Bearer ID token.
- (Optional) Add CI for auto-deploy; document update flow in README.

## Week 2+ — Enhancements (pick 3–4h blocks at 10:00)
- Persist per-user case history to S3; add list pagination.
- Improve charts (bar/compare); add CSV/PDF exports.
- Write detailed setup docs; add sample cases and test users.
- Add CI/CD (GitHub Actions) and housekeeping jobs (EventBridge) later.
