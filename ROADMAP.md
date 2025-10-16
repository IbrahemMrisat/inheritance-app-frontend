# 🧭 Inheritance GPT Web App — Two-Week Roadmap

**Cadence:** 3–4 hours per day, 3–4 days per week  
**Start time:** 10:00 AM  
**Goal:** Build and deploy a full MVP of the Inheritance GPT web app within 2 weeks — serverless, secure, and production-ready.

---

## ✅ Week 1 — MVP Foundations

### **Day 1 — GitHub & Frontend Scaffolding (10:00 – 13:30)**
- [ ] Install **Node 20+**, **Git**, and your preferred editor  
- [ ] Create project: `npm create vite@latest inheritance-app-frontend -- --template react-ts`  
- [ ] Add **TailwindCSS** and dependencies (`react-router-dom`, `react-hook-form`, etc.)  
- [ ] Replace starter files with provided app structure (routes, auth, API client)  
- [ ] Initialize Git: `git init`, commit, and push to GitHub  
- [ ] Write basic **README.md** with build/run instructions  

---

### **Day 2 — Cloudflare Pages + Cognito Setup (10:00 – 13:30)**
- [ ] Create **Cloudflare Pages** project and connect the GitHub repo  
- [ ] Configure build:  
  - [ ] Command → `npm run build`  
  - [ ] Output → `dist`  
- [ ] Add environment variables:  
  - [ ] `VITE_API_BASE`  
  - [ ] `VITE_COGNITO_DOMAIN`  
  - [ ] `VITE_COGNITO_CLIENT_ID`  
  - [ ] `VITE_COGNITO_REDIRECT_URI`  
- [ ] Create **Cognito User Pool** (email sign-in only)  
- [ ] Create **App Client** (public, implicit grant flow)  
- [ ] Add callback & sign-out URLs + Hosted UI domain  
- [ ] Deploy and verify login → callback → dashboard flow  

---

### **Day 3 — Backend Infra (SAM + API Gateway + S3 + JWT) (10:00 – 14:00)**
- [ ] Request **ACM certificate** for `api.yourdomain.com` (DNS validation via Cloudflare)  
- [ ] Deploy **AWS SAM stack** with:  
  - [ ] `DataBucketName`  
  - [ ] `AllowedOrigins`  
  - [ ] `CognitoUserPoolId`  
  - [ ] `CognitoAppClientId`  
- [ ] (Optional) Add `ApiCustomDomainName` + `ApiCertificateArn`  
- [ ] Verify S3 bucket and API Gateway endpoints  
- [ ] Test:  
  - [ ] 401 response without token  
  - [ ] 200 response with valid Cognito token  

---

### **Day 4 — Wire Frontend ↔ Backend & E2E Testing (10:00 – 13:30)**
- [ ] Update `VITE_API_BASE` to your deployed API domain  
- [ ] Redeploy Cloudflare Pages (auto-build from GitHub)  
- [ ] Log in → create new case → verify results (tables + pie chart)  
- [ ] Confirm `Authorization: Bearer` header in API calls  
- [ ] (Optional) Add **GitHub Actions CI** for automatic deploys  
- [ ] Document the full build/update process in README  

---

### 🏁 **End of Week 1 Milestone**
✅ Functional MVP online:
- Secure login via Cognito  
- Lambda + API Gateway + S3 backend  
- Frontend hosted on Cloudflare Pages  
- Inheritance case submission → GPT result table → chart  

---

## 🚀 Week 2 — Enhancements & Polish

### **Day 5 — User History (S3 Integration) (10:00 – 13:30)**
- [ ] Add logic to save each user’s case result in S3 (prefix = Cognito User ID)  
- [ ] Display previous cases in a “History” view (read from S3)  
- [ ] Add “Re-calculate” or “View again” action  

---

### **Day 6 — Charts & Data Exports (10:00 – 13:30)**
- [ ] Add bar and comparison charts (in addition to pie)  
- [ ] Enable CSV and PDF export of results  
- [ ] Add chart image download/share button  

---

### **Day 7 — Documentation & Testing (10:00 – 13:30)**
- [ ] Write complete setup guide (Cloudflare Pages, Cognito, SAM deploy)  
- [ ] Add sample inheritance cases for testing  
- [ ] Add simple unit tests for API and frontend forms  
- [ ] Create **CHANGELOG.md** and track known issues  

---

### **Day 8 — Polish & Stabilization (10:00 – 13:30)**
- [ ] Refine UI styling, spacing, and RTL layout  
- [ ] Add loading/error states  
- [ ] Test across desktop + mobile browsers  
- [ ] Final redeploy and validation  
- [ ] Backup environment variables and credentials  

---

### 🏁 **End of Week 2 Milestone**
✅ Polished MVP ready for early users:
- Case history saved per user  
- Exportable results and charts  
- Clear documentation + light tests  
- Stable deploy pipeline  

---

## 🕒 Weekly Rhythm
| Day | Focus | Goal |
|-----|--------|------|
| **Mon** | Frontend polish | UI forms & RTL support |
| **Wed** | Backend updates | S3 history + export |
| **Fri** | Testing & Docs | Verify flow + publish guide |

---

**Progress Tip:**  
Mark each `[ ]` as `[x]` when done — GitHub will automatically show a progress bar in PRs or issues that reference this roadmap.
