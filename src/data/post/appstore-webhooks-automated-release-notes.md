---
title: "Release on Autopilot: From Code Push to Forced App Update, Zero Human Steps"
author: Ciprian Rarau
publishDate: 2026-04-07T12:00:00Z
category: Building
excerpt: "Six services talk to each other so I don't have to. Apple tells my system a build shipped. The system tells Slack, waits 30 minutes for global propagation, then forces every user to update. The entire iOS release pipeline runs without a single human step."
substack: true
tags:
  - ios-development
  - devops-automation
  - serverless
  - infrastructure-as-code
  - terraform
  - google-cloud
  - github-actions
  - production-first
  - shipping
image: /images/diagrams/appstore-webhooks-automated-release-notes-diagram-34c04c66.png
metadata:
  featured: true
  showAuthor: true
  showDate: true
  showReadingTime: true
  showTags: true
transcript: |
  I built a system where six services, Apple, a Cloud Function, Cloud Tasks, the backend API, a database, and Slack, all work as one. Developer pushes code, GitHub Actions builds and uploads to Apple, Apple processes the build and fires a webhook, my Cloud Function catches it, notifies Slack with the commits, and tells the backend to force the update. For production, it schedules a 30-minute delay via Cloud Tasks so Apple has time to propagate the binary globally, then fires the update. Every action posts to Slack. Every failure posts to Slack. There is no manual step anywhere. The entire release lifecycle, from git push to a blocking popup on the user's phone, is fully automated.
---

Six services. Zero human steps. A developer pushes code, and the system handles everything: building, uploading to Apple, tracking what changed, notifying the team, and forcing every user to update. No one checks App Store Connect. No one posts in Slack. No one runs a database query. The entire iOS release pipeline operates as a single automated system.

This is the story of how I built it, layer by layer, until the last manual step was gone.

## The Problem

iOS releases are opaque. You push a build, and then you wait. Is it processing? Did it upload correctly? Is it in review? The feedback loop is measured in hours or days, and the only way to know is to keep checking manually.

And when a build goes out: "What's in this release?" requires digging through git history.

I wanted a system where none of this requires human attention.

## Layer 1: Apple Talks to Slack

Apple sends webhooks for everything that happens in the build and release lifecycle: builds processing, TestFlight status changes, app review decisions, crash reports from testers. I set up a Cloud Function to receive these events, verify Apple's cryptographic signature, and post formatted notifications to a Slack channel.

Every webhook also triggers a lookup to the App Store Connect API to get the actual version and build number (Apple's webhook payloads contain IDs, not details). For build events, the system also fetches the list of git commits that shipped in that build, which GitHub Actions uploads to cloud storage during the CI pipeline.

The result: a Slack channel that shows the complete lifecycle of every build, with the exact commits included.

## Layer 2: The Team Stays Current

Notifications are nice. But there was still a gap. QA was testing on an old build while a newer one had been ready for hours. Nobody told them. TestFlight doesn't force updates.

So I connected the webhook to the backend. When a dev or staging build finishes processing, the Cloud Function tells the backend "the latest version is now 1.4.17 build 338." The backend stores this and marks it as mandatory. The mobile app checks on every launch, and if it's behind, it shows a blocking full-screen popup. No dismiss button. You must update.

```mermaid
sequenceDiagram
    participant Apple as App Store Connect
    participant CF as Cloud Function
    participant Slack as Slack
    participant API as Backend
    participant App as Mobile App

    Apple->>CF: Build 338 is ready
    CF->>Slack: Build notification + commits
    CF->>API: New version: 1.4.17.338
    CF->>Slack: "Force Update Applied"

    App->>API: I'm on build 225
    API-->>App: You need build 338 (mandatory)
    App->>App: Blocking update popup
```

Dev and staging were now fully automated. Build completes, everyone updates. No human in the loop.

## Layer 3: The Last Manual Step

But production was different. Every App Store release ended with me connecting to the production database and running SQL to force the update. It worked. It always worked. But it was the one manual step in an otherwise fully automated pipeline.

It existed because the original code explicitly rejected production from the automation. A cautious choice, but the wrong one. The authentication was already there. If the secret is valid, the caller is trusted. The environment restriction added no security, only friction.

I removed the restriction. Then I had to solve a harder problem.

## The 30-Minute Problem

You can't force users to update the moment you click "Release" in App Store Connect. Apple needs time to propagate the binary to CDN nodes across all regions. If I forced the update immediately, users in some countries would see "Update Required" but find nothing available in their App Store.

The solution: a 30-minute delay. When Apple fires the release event, my Cloud Function doesn't call the backend immediately. Instead, it schedules a task that fires 30 minutes later. Google Cloud Tasks handles the scheduling, the delay, and automatic retries if the backend is temporarily unavailable.

Same function, different behavior per environment: dev and staging get immediate updates when builds complete. Production gets a delayed update when the App Store release goes live.

## The Surprise in Apple's Payload

This is where building against real data saved me. I assumed Apple's release webhook would include the version and build number. It does not.

The actual payload when a build is released to the App Store contains only a state change ("now live") and a resource ID. No app identifier. No version string. No build number. If I had built the automation from documentation alone, it would have silently done nothing in production.

I found this by pulling the real webhook payload from production logs after an actual release. The fix: use that resource ID to call Apple's API and fetch the version, build number, and app ID before scheduling the update.

## The Unified System

Here's the full picture:

```mermaid
flowchart TB
    subgraph Developer["Developer"]
        Push["Push code"]
    end

    subgraph GitHub["GitHub Actions"]
        Build["Build + tag + upload commits"]
    end

    subgraph Apple["Apple"]
        Process["Process + Review + Release"]
    end

    subgraph Cloud["Google Cloud"]
        CF["Cloud Function"]
        CT["Cloud Tasks (30 min delay)"]
    end

    subgraph Backend["Backend"]
        DB["Version record (1 row)"]
    end

    subgraph Slack["Slack"]
        Notify["Every event, every action, every error"]
    end

    subgraph Mobile["Mobile App"]
        Popup["Blocking update popup"]
    end

    Push --> Build --> Apple
    Process -->|"Webhook"| CF
    CF -->|"Dev/Stage: immediate"| DB
    CF -->|"Production: delayed"| CT --> DB
    CF --> Notify
    DB --> Popup

    style Developer fill:#f3e5f5,stroke:#621164,stroke-width:2px
    style GitHub fill:#f6f8fa,stroke:#24292e,stroke-width:2px
    style Apple fill:#f5f5f7,stroke:#86868b,stroke-width:2px
    style Cloud fill:#e8f0fe,stroke:#4285f4,stroke-width:2px
    style Backend fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    style Slack fill:#f4ede4,stroke:#4a154b,stroke-width:2px
    style Mobile fill:#fff3e0,stroke:#e65100,stroke-width:2px
```

Everything talks to everything else, and nobody needs to tell it to. The developer pushes code. GitHub builds and tags. Apple processes and reviews. The Cloud Function listens, notifies, and triggers. Cloud Tasks handles the delay. The backend writes one row. The mobile app reads it and acts.

There is no communication necessary between humans for any of this to work.

## Full Visibility as a Feature

Every action the system takes posts to Slack. Not just Apple's events, but every version update action:

- Build ready, force update applied for dev/staging
- Production released, 30-minute timer started
- Backend update confirmed
- Any failure at any step, with error details

I chose Slack over just logging because Slack is where I live during releases. If something goes wrong, I need to see it without opening a cloud console. And when everything goes right, the confirmation is right there next to the build notification.

If the automated system ever fails, there's a one-command manual fallback. But the point is that I shouldn't need it.

## The Infrastructure Principle

All of this is infrastructure as code. The Cloud Function, the task queue, the permissions, the shared secrets, the environment variables. One command and everything is wired up. One shared secret ties the system together: the Cloud Function reads it to authenticate outbound calls, the backend reads it to validate inbound calls. Same trust boundary, managed in one place.

This is what I mean when I say infrastructure should be invisible. You build it once, deploy it, and forget it exists. Until Slack reminds you it's working.

## The Release Experience Now

Here's what releasing looks like:

1. I click "Release" in App Store Connect
2. Slack: "Released to App Store"
3. Slack: "Force Update Scheduled (30 minutes)"
4. I close App Store Connect
5. 30 minutes later: update confirmed
6. Every user on an older version sees the update popup

No SSH. No SQL. No manual anything.

## What This Really Means

This isn't about any single piece of technology. It's about what happens when you connect systems intentionally. Each service does one thing. GitHub builds. Apple reviews. A function routes events. A task queue adds a delay. The backend writes one row. Slack provides visibility. The mobile app enforces.

None of them are complex individually. But connected, they create something that feels magical: a developer pushes code, and hours or days later, every user's phone updates itself. No human touched anything in between.

The best infrastructure is the kind you build once and then forget exists. Until Slack reminds you it's working.
