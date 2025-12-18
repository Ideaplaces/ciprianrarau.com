# Blog Article Analysis: 2025 Documentation Synthesis (Updated)

## Key Discoveries

### 1. Spec-Driven AI Development (Your Passion Project)
The workflow where **specs drive everything**:
- Specs → AI writes code
- Specs → Marketing content
- Specs → Help articles (stored locally as MDX)
- Single components work across marketing AND help with mock data
- Intercom articles cloned locally, used with real components

### 2. Everything from Code Philosophy
Services managed as Infrastructure as Code:
- **Google Workspace**: Users, groups, aliases (Terraform)
- **GitHub**: Repos, secrets, branch protection (Terraform)
- **Sentry**: Alerts, filters, scrubbing rules (Python + YAML)
- **Firebase/GCP IAM**: Role assignments, access control (Terraform)
- **Cloud Infrastructure**: Azure + GCP (Terraform modules)

---

## Revised Article List (28 Articles)

### THEME 1: Spec-Driven AI Development (NEW - HIGH PRIORITY) (4 Articles)

#### 1. "Specs as the Single Source of Truth: How I Write Once and Generate Everywhere"
**Source**: Mentorly spec → code → marketing → help workflow
**Essence**: Writing specs that AI can use to generate code, then reusing for docs and marketing
**Key Insights**:
- Versioned specs (V1, V2) track feature evolution
- Same spec drives backend code, help articles, and landing pages
- Real components + mock data = testable marketing
- Intercom articles cloned locally for unified management

#### 2. "The Help Article Pipeline: From Intercom to Local Codebase"
**Source**: mentorly-intercom-articles + mentorly-website/content/help
**Essence**: Why I store help articles locally and use real components
**Key Insights**:
- Clone Intercom via API to local MDX files
- help-structure.json preserves hierarchy
- Same components render in marketing site AND help center
- Mock data for testing, real data in production
- Frontmatter preserves Intercom metadata (IDs, authors, dates)

#### 3. "AI Reads My Specs: The New Development Workflow"
**Source**: Mentorly specs folder structure + AI code generation
**Essence**: How structured specifications enable AI-assisted development
**Key Insights**:
- Spec structure that AI can parse: Key Decisions, Architecture, Requirements
- Version control for specs (not just code)
- AI generates implementation from well-written specs
- The feedback loop: spec → code → test → update spec

#### 4. "Wireframes as Code: Prototyping Before Implementation"
**Source**: mentorly-flows wireframing tool
**Essence**: Using code-based wireframes to validate specs before building
**Key Insights**:
- 28 sketch components (Button, Card, Modal, Table, etc.)
- Clickable flows for stakeholder review
- Spec → Wireframe → Approval → Implementation
- No custom styling - just structure validation

---

### THEME 2: Everything from Code (NEW - HIGH PRIORITY) (5 Articles)

#### 5. "Google Workspace as Code: Managing Users, Groups, and Aliases with Terraform"
**Source**: mentorly-devops/google-workspace/
**Essence**: Why I manage email users and groups in Git, not admin console
**Key Insights**:
- Users defined as Terraform resources (name, email, aliases, admin status)
- Groups with membership relationships
- Service accounts for automation (help@, sendgrid@)
- Audit trail for all access changes
- One `terraform apply` to sync entire workspace

#### 6. "GitHub Configuration as Infrastructure: Secrets, Repos, and Branch Protection"
**Source**: All three DevOps repos (mentorly, eli, pivot)
**Essence**: Managing GitHub at scale across multiple projects
**Key Insights**:
- Repository settings in code (dependabot, default branch)
- Secrets per repository AND per environment
- Branch protection rules as code
- Collaborator access management
- No more manual secret rotation

#### 7. "Sentry Alerts, Filters, and Scrubbing: Programmatic Error Management"
**Source**: eli-devops/sentry/ (Python + YAML approach)
**Essence**: Why I wrote a Python CLI to manage Sentry instead of clicking
**Key Insights**:
- YAML configuration for alerts, filters, scrubbing rules
- 30+ error patterns to ignore (network errors, test errors)
- Data scrubbing for PII (hormone values, IPs)
- Environment-specific alert thresholds
- Idempotent operations (safe to run repeatedly)

#### 8. "Firebase IAM as Code: Who Can Access What, Defined in Git"
**Source**: pivot-devops/firebase/ + eli-devops
**Essence**: Managing GCP/Firebase access through Terraform
**Key Insights**:
- Production owners vs viewers vs BigQuery-only access
- Separate access levels per environment (prod strict, dev open)
- CI/CD service accounts with minimal permissions
- Audit trail for all permission changes

#### 9. "The DevOps Meta Repository: Organizing Infrastructure Across Projects"
**Source**: Pattern across mentorly-devops, eli-devops, pivot-devops
**Essence**: How I structure DevOps repos that manage multiple services
**Key Insights**:
- Separate folders for each service (google-workspace/, github/, sentry/)
- Independent Terraform state per concern
- modules/ pattern for reusable infrastructure
- Environment-specific variables files
- README documentation for each module

---

### THEME 3: Cloud Infrastructure & Multi-Cloud (5 Articles)

#### 10. "Migrating from AWS to Azure: A Zero-Downtime Philosophy"
**Source**: Mentorly AWS-to-Azure migration documentation
**Essence**: How to migrate production workloads incrementally
**Key Insights**:
- Staging environment as "production rehearsal"
- Exact replication of proven dev infrastructure
- Small, testable, reversible changes
- Cost comparison between providers

#### 11. "Why I Deploy the Same Infrastructure Three Times"
**Source**: All three platforms (dev/staging/prod patterns)
**Essence**: The business case for identical environments
**Key Insights**:
- Environment parity eliminates surprises
- Terraform state management strategies
- Cost optimization for non-production
- AI enables rapid infrastructure replication

#### 12. "Cloud Run vs Container Apps: Serverless Containers in Practice"
**Source**: Pivot (Cloud Run) + Mentorly (Azure Container Apps)
**Essence**: Practical comparison after running both in production
**Key Insights**:
- Scale-to-zero economics (~$20-25/month per service)
- Cold start implications
- Concurrency tuning for different workloads
- When each platform shines

#### 13. "The Application Gateway Pattern: Multi-Tenant Routing at Scale"
**Source**: Mentorly wildcard certs and path-based routing
**Essence**: Routing hundreds of customers to shared infrastructure
**Key Insights**:
- Subdomain vs path-based routing trade-offs
- Wildcard SSL certificate management
- Header injection for tenant identification
- Local development mirroring production (Caddy)

#### 14. "Data Pipeline Architecture: From Realtime to Warehouse"
**Source**: Eli Health data pipeline documentation
**Essence**: Building unified data architecture with multiple ingestion patterns
**Key Insights**:
- CDC (Change Data Capture) for real-time sync
- Airbyte for batch ETL from SaaS tools
- BigQuery as central warehouse
- Cross-region synchronization

---

### THEME 4: Security & Compliance (4 Articles)

#### 15. "SOC 2 for Startups: What You Already Have and What You Need"
**Source**: Mentorly SOC 2 preparation documentation
**Essence**: Demystifying enterprise compliance for early-stage companies
**Key Insights**:
- Controls you already have from good engineering
- Critical gaps (training, vendor management, risk assessment)
- Vendor compliance inheritance
- Timeline from preparation to certification

#### 16. "GraphQL Audit Logging: Who Changed What, When"
**Source**: Mentorly GraphQL audit logging implementation
**Essence**: Building complete traceability for enterprise customers
**Key Insights**:
- Two-layer logging (request + database)
- PaperTrail for "time travel" reconstruction
- Performance impact (<5ms overhead)
- SQL queries for common investigations

#### 17. "Enterprise SSO Integration: SAML in Practice"
**Source**: Mentorly SSO integration documentation
**Essence**: Practical guide to implementing enterprise authentication
**Key Insights**:
- SAML 2.0 flow explained simply
- Auto-provisioning on first login
- Domain-specific routing
- Testing with customer IT teams

#### 18. "HIPAA Compliance in the Cloud: What Actually Matters"
**Source**: Eli Health security architecture
**Essence**: Health data protection without paralysis
**Key Insights**:
- Encryption at rest and in transit
- Regional data residency
- Bastion host patterns
- Audit logging for compliance evidence

---

### THEME 5: ML/AI Systems in Production (4 Articles)

#### 19. "Image Processing at Scale: When Every Second Counts"
**Source**: Eli Health HAE documentation
**Essence**: Running ML inference with real users waiting
**Key Insights**:
- 10-12 second processing time per image
- Concurrency tuning (why 3 is the magic number)
- Cold start mitigation strategies
- PubSub queue architecture

#### 20. "The Bottleneck Formula: Capacity Planning for ML Services"
**Source**: Eli Health HAE performance analysis
**Essence**: Mathematical approach to ML service scaling
**Key Insights**:
- Processing Time = (Images ÷ Capacity) × LatencyPerImage
- Instance vs concurrency trade-offs
- When aggressive scaling causes failures
- Auto-scaling behavior and delays

#### 21. "PubSub Architecture: Decoupling ML from User Experience"
**Source**: Eli Health image upload flow
**Essence**: Keeping users happy while ML processes in background
**Key Insights**:
- Immediate response + async processing
- Dead letter queues for failures
- Retry strategies with exponential backoff
- Status polling patterns

#### 22. "Building a Customer Health Dashboard with Real-Time Metrics"
**Source**: Pivot CSM Dashboard specification
**Essence**: Using automation to surface business intelligence
**Key Insights**:
- Real-time triggers vs daily cron hybrid
- Threshold-based alerting
- 90-day historical trends
- Domain-specific health scoring

---

### THEME 6: Developer Experience & Automation (4 Articles)

#### 23. "GitHub to Monday.com: Automating the Boring Parts"
**Source**: Pivot Monday-GitHub integration documentation
**Essence**: Connecting commits to project management automatically
**Key Insights**:
- Regex extraction of task IDs from commits/PRs
- Duplicate detection to prevent spam
- Status column automation on PR merge
- Webhook security with HMAC verification

#### 24. "iOS Build Systems: One Codebase, Four Environments"
**Source**: Pivot iOS build system documentation
**Essence**: Managing mobile builds across environments
**Key Insights**:
- Fastlane lanes for each environment
- Xcode schemes and bundle ID management
- Provisioning profile automation with Match
- GitHub Actions to TestFlight pipeline

#### 25. "The Perfect Local Development Setup"
**Source**: Mentorly Caddy reverse proxy pattern
**Essence**: Making localhost behave exactly like production
**Key Insights**:
- Caddy as local Application Gateway
- Multi-service routing on single port
- SSL in local development
- Shared authentication

#### 26. "Stripe Webhook Integration: Subscription Billing That Works"
**Source**: Pivot Stripe integration documentation
**Essence**: Automating subscription lifecycle management
**Key Insights**:
- Webhook signature verification
- Customer matching across systems
- Automatic account locking on payment failure
- Test mode vs live mode strategies

---

### THEME 7: Systems Thinking & Philosophy (2 Articles)

#### 27. "Production-First: Why Every Environment Should Be Production-Ready"
**Source**: All three platforms + existing blog posts
**Essence**: The mindset shift from "dev environment" to "production at different scales"
**Key Insights**:
- Same infrastructure, different tier sizes
- No shortcuts in non-production
- The cost of environment drift
- AI enables production-first development

#### 28. "The Tension of DevOps: Speed vs Stability"
**Source**: Existing blog posts + platform stabilization docs
**Essence**: Managing the contradiction of moving fast without breaking things
**Key Insights**:
- Smaller changes = safer deployments
- Comprehensive testing as enabler
- Confidence from repetition
- Zero-downtime as non-negotiable

---

## Removed Articles (Per Your Feedback)
- ~~"The Day I Found Catastrophic Security Holes"~~ - Not deployed to production yet
- ~~"The 8-Phase Product Playbook"~~ - Not written by you

---

## Recommended First 10 Articles (Updated Order)

| Priority | Article | Why It's First |
|----------|---------|----------------|
| 1 | **Specs as Single Source of Truth** | Your passion + unique workflow |
| 2 | **Everything from Code (Google Workspace)** | Impressive automation story |
| 3 | **Sentry Configuration as Code** | Python + YAML approach is novel |
| 4 | **AI Reads My Specs** | Timely, AI-focused content |
| 5 | **AWS to Azure Migration** | Multi-cloud credibility |
| 6 | **GitHub Configuration as Code** | Practical DevOps |
| 7 | **Image Processing at Scale** | ML production experience |
| 8 | **Help Article Pipeline** | Content ops innovation |
| 9 | **SOC 2 for Startups** | Enterprise relevance |
| 10 | **Data Pipeline Architecture** | Systems thinking |

---

## Tags for Machine Readability

Use consistently across all articles:

- `#spec-driven-development` - Specs as source of truth
- `#infrastructure-as-code` - Terraform, everything from code
- `#multi-cloud` - AWS, Azure, GCP expertise
- `#ai-assisted-development` - AI workflow patterns
- `#production-first` - Always production-ready mindset
- `#devops-automation` - GitHub, Sentry, Workspace management
- `#ml-in-production` - Real AI/ML deployment
- `#content-operations` - Help articles, marketing, docs
- `#serverless` - Cloud Run, Container Apps
- `#enterprise-compliance` - SOC 2, HIPAA

---

## Key Narrative Threads

### Thread 1: "I Write Specs, AI Writes Code"
Articles 1, 3, 4 → Shows the modern development workflow

### Thread 2: "Everything I Touch Becomes Code"
Articles 5, 6, 7, 8, 9 → The infrastructure-as-code philosophy

### Thread 3: "Multi-Cloud Production Expert"
Articles 10, 11, 12, 13, 14 → Cross-cloud architecture experience

### Thread 4: "Enterprise-Ready from Day One"
Articles 15, 16, 17, 18 → Security and compliance without paralysis

### Thread 5: "AI/ML in the Real World"
Articles 19, 20, 21, 22 → Production ML systems

---

## Source Files Quick Reference

| Topic | Path |
|-------|------|
| Specs | `/mentorly-meta/mentorly-docs/docs/specs/` |
| Help Articles | `/mentorly-meta/mentorly-website/content/help/articles/` |
| Help Structure | `/mentorly-meta/mentorly-website/content/help/help-structure.json` |
| Wireframes | `/mentorly-meta/mentorly-flows/` |
| Google Workspace IaC | `/mentorly-meta/mentorly-devops/google-workspace/` |
| GitHub IaC | `*/mentorly-devops/github/terraform/` |
| Sentry IaC | `/eli.health/eli-devops/sentry/` |
| Firebase IAM | `/pivot-meta/pivot-devops/firebase/` |
| Azure Modules | `/mentorly-meta/mentorly-devops/infrastructure/terraform/azure/modules/` |
| GCP Modules | `/eli.health/eli-devops/tf/modules/` |
