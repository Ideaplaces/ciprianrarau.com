---
title: "Sentry in Terraform: One Module, Three Environments, Zero UI Clicks"
author: Ciprian Rarau
publishDate: 2026-05-03T12:00:00Z
category: Building
excerpt: "I moved Eli's entire Sentry setup into Terraform. One module, one set of variables per environment, dev and stage and production in lockstep. The UI is for reading stack traces now, not for configuring anything."
image: /images/diagrams/sentry-in-terraform-diagram-cca38c82.png
substack: true
tags:
  - infrastructure-as-code
  - terraform
  - sentry
  - observability
  - eli-health
  - devops-automation
  - production-first
contentType: markdown
draft: false
metadata:
  canonical: https://ciprianrarau.com/blog/sentry-in-terraform
  featured: false
  showAuthor: true
  showDate: true
  showReadingTime: true
  showTags: true
transcript: |
  Sentry across dev, stage, and production for Eli is now defined entirely in Terraform.
  One module under eli-devops, one tfvars file per environment, three Sentry projects
  staying in lockstep. Alerts, inbound filters, data scrubbing, project keys, all of it.

  This is the follow-up to my Python CLI era. The CLI worked, but it was a sidecar that
  lived next to my real infrastructure. Now Sentry is just another resource declared in
  the same place I declare DNS, secrets, container apps, and IAM. One terraform plan
  shows me the diff across observability and everything else.

  Three things matter most: parity (dev/stage/prod cannot drift), reviewability (every
  Sentry change is a PR), and reproducibility (a fresh project is one variable away).
---

I run [Eli Health](https://elihealth.com) the way I run everything else: dev, stage, and production, the same shape, no surprises. Sentry was the last thing in that stack still configured through clicking. Not anymore.

Everything in Sentry, every alert rule, every inbound filter, every scrubbing pattern, every project key, is now declared in Terraform inside the `eli-devops` repository. One module, three workspaces, one source of truth.

## The Python CLI era was good, the Terraform era is better

A few months back I wrote about [managing Sentry with a Python CLI and YAML](/blog/sentry-configuration-as-code). That worked. I had a single source of truth and PRs for changes. But it was a sidecar. It lived next to my infrastructure, not inside it. I had to remember to run a different tool, and I had to keep its mental model separate from the rest.

A real Terraform provider for Sentry changed that. Now Sentry is just another resource. Same `terraform plan`, same `terraform apply`, same review flow as my container apps, my Key Vault secrets, my DNS records. One diff, one decision, one apply.

## What the module declares

```mermaid
flowchart TB
    subgraph repo["eli-devops repo"]
        mod["observability/sentry/<br/>Terraform module"]
        vars_dev["dev.tfvars"]
        vars_stage["stage.tfvars"]
        vars_prod["prod.tfvars"]
    end

    mod --> apply_dev["terraform apply<br/>dev workspace"]
    mod --> apply_stage["terraform apply<br/>stage workspace"]
    mod --> apply_prod["terraform apply<br/>prod workspace"]

    vars_dev -.-> apply_dev
    vars_stage -.-> apply_stage
    vars_prod -.-> apply_prod

    apply_dev --> sentry_dev["Sentry project: eli-dev<br/>alerts, filters, scrubbing"]
    apply_stage --> sentry_stage["Sentry project: eli-stage<br/>alerts, filters, scrubbing"]
    apply_prod --> sentry_prod["Sentry project: eli-prod<br/>alerts, filters, scrubbing"]

    classDef devbox fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef stagebox fill:#fff8e1,stroke:#ff8f00,stroke-width:2px,color:#000
    classDef prodbox fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000

    class apply_dev,sentry_dev,vars_dev devbox
    class apply_stage,sentry_stage,vars_stage stagebox
    class apply_prod,sentry_prod,vars_prod prodbox
```

![Diagram 1](/images/diagrams/sentry-in-terraform-diagram-cca38c82.png?v=e01b41f3)

The module covers everything you would otherwise click for:

- **Sentry projects and teams**, named consistently with the rest of my Eli stack.
- **Alert rules**, both issue rules and metric rules, tagged by environment, routed differently per env. Production routes to PagerDuty, stage to Slack, dev to a quiet channel during work hours only.
- **Inbound filters**, the noisy-by-default ones that I always want off (legacy browsers, web crawlers, junk 404s) plus my own per-project additions.
- **Data scrubbing rules**, the most important part. I strip `ip_address`, `user.email`, anything Authorization, anything that looks like a token. Stage matches prod on scrubbing. Dev is stricter, because people paste things into dev.
- **Project keys and DSNs**, surfaced as outputs that other Terraform modules consume directly. The application Container App reads its DSN from the same Key Vault secret that this module writes to.

The variables that differ between environments are small and explicit: which alerts page, which channel they target, retention windows, sampling rates. Everything else is identical by construction.

## Parity is the whole point

The reason I do this is not that I love Terraform. It is that I do not trust my memory.

Three environments staying in lockstep used to be a thing I had to verify by clicking through three Sentry tabs side by side. Now `terraform plan` tells me, in one screen, exactly where my environments differ. If a scrubbing rule lands in dev because of an incident, the same rule is one PR away from being live in stage and production. If an alert routes to the wrong channel, the diff is in the PR description.

The first time I added a new alert to the module, I added it to one place, ran `plan` against all three workspaces, applied them in order, and watched the same alert show up in three Sentry projects within a minute. That is the workflow I wanted from day one.

## Sentry is a source, not a destination

The other reason this matters: Sentry is no longer the only place I look at errors. With everything tagged and named consistently, I forward Sentry events into the same observability pipe as the rest of my logs. The Sentry UI is still useful for drilling into a specific stack trace, but most days I am querying logs, traces, and Sentry events together by tag.

The full flow, including the variables I expose to applications and the scrubbing rules I keep updated as new patterns appear, is documented in `eli-docs` under `observability/sentry`. That is the README I read first when something is on fire.

## What is next

Sampling and rate limits are the next thing I want in code. Today I dial them by environment manually when we run a load test. The Relay configuration is the natural extension of this same module, and once that lands the only Sentry UI I open will be for reading stack traces, never for configuring anything.

That has been the goal all along.
