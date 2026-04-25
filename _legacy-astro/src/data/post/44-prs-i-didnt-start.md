---
publishDate: 2026-04-06T12:00:00Z
author: Ciprian Rarau
title: "44 PRs I Didn't Start"
excerpt: "I open sourced an autonomous AI agent that runs on my dev machine, watches my Slack channels, and fixes production errors while my attention is elsewhere. In two weeks, it merged 44 pull requests across three repositories. I started none of them."
category: AI
substack: true
tags: ["c3", "claude-code", "autonomous-agents", "shipping", "devops", "open-source"]
image: ""
contentType: markdown
draft: false
linkedin: |
  I just open sourced C3: an AI agent that runs on my dev machine and acts on my behalf.

  In the last two weeks, it opened 44 pull requests across three repositories. I started none of them.

  Here is what makes it different from every other AI coding tool:

  It runs where I work. Not in the cloud. On my machine. With my repos, my secrets, my CLI tools, my database access. It has the exact same context I do.

  When a production alert fires, C3 picks it up from Slack, starts a Claude Code session, traces the error, writes a fix, writes tests, runs them, and opens a PR. Then it reports back in the thread.

  But here is the real breakthrough: I can continue the conversation.

  If the PR needs changes, I do not start over. I open the session, type "also check the staging config," and the agent continues with full context from the original investigation. It is not fire and forget. It is a conversation I pick up when I am ready.

  The agent starts the work. I review, steer, and merge. My attention stays where it matters.

  Every time I write code, I am teaching the AI. Every CLAUDE.md file, every commit convention, every test pattern. The machine accumulates my expertise. The prompt for my production error agent is 230 lines of markdown. It does exactly what I would do, step by step.

  44 PRs. Started by the agent. Reviewed and merged by me.

  C3 is open source: https://github.com/Ideaplaces/c3

  Blog post with the full story: [LINK]

  #OpenSource #AI #ClaudeCode #DevOps #Automation #SoftwareEngineering #Shipping
---

I just open sourced [C3](https://github.com/Ideaplaces/c3), an autonomous AI agent that runs on my dev machine, watches my Slack and Discord channels, and acts on my behalf.

In the last two weeks, it opened 44 pull requests across three repositories. I started none of them. The agent saw the alerts, investigated the errors, wrote the fixes, ran the tests, and opened the PRs. My job was to review, continue the conversation if needed, and merge.

## How It Started

A production alert fired. A SAML authentication error for an enterprise customer. I was in the middle of something else. By the time I looked at Slack, the agent had already traced the error to a renamed config key, created a fix, written a test, and opened a pull request. I reviewed it, merged it, and went back to what I was doing.

This happened 44 times in two weeks. Not because I was sleeping. Because my attention was somewhere else, and the agent handled it.

## The Numbers

**Backend (Rails API):** 18 PRs opened by the agent, reviewed and merged by me. SSO bugs, rate limit thundering herds, matching logic, notification timing.

**Frontend (Next.js):** 25 PRs opened by the agent. React hydration mismatches, error reporting noise, SSR crashes, broken formatting.

**DevOps:** 1 PR. Alert summarizer with trace-based context.

These are not toy fixes. One PR fixed a webhook thundering herd by adding jittered retry delays. Another solved an API rate limit cascade that was burning credits. Another added an ESLint rule to prevent React hydration mismatches across the entire frontend. Each PR has tests, targets `develop`, and follows the project's branching rules.

## What Is C3

C3 (Cloud Claude Code) turns your dev machine into an autonomous agent platform.

You have a machine where you write code. A VM, a server, a Mac Mini in a closet. That machine has your repos, your secrets, your CLI tools, your database access. You SSH into it and run Claude Code.

C3 listens to your Slack and Discord channels. When an alert fires, a bug is reported, or someone asks a question, C3 starts a Claude Code session on YOUR machine, with YOUR repos, with YOUR access. The agent reads the code, traces the error, checks recent commits, writes a fix, writes tests, runs them, and opens a PR. Then it reports back in the channel thread.

You wake up, read the thread, click a link, and continue the conversation from your phone.

**This is not a cloud-hosted agent.** It runs where your code lives. That is what makes it powerful: it has the same context you do.

## The Breakthrough: Conversation Continuity

This is the part most people miss.

The agent does not just produce output and disappear. Every triggered session is a full Claude Code conversation that I can continue. If the PR is not to my satisfaction, I do not start over. I do not open a new ticket. I open the same session from my phone, type "also check the staging environment," and the agent picks up exactly where it left off, with full context from the 3 AM investigation.

The agent starts the work. I pick it up when I am ready.

This changes the relationship with autonomous agents completely. It is not fire and forget. It is not "review and redo." It is a continuous thread where the AI does the heavy lifting first and I steer it after.

The agent investigated the SAML error, found the root cause, created the fix, wrote the test. I woke up, read the thread, saw that the fix was correct but wanted one more edge case covered. I typed "add a test for when the config key is completely missing." The agent added it. I merged.

That interaction took me 45 seconds. The investigation took the agent 12 minutes. Without C3, it would have taken me an hour.

## What Made This Possible

The tool is not the breakthrough. The breakthrough is what comes before the tool.

For six months, I have been writing code on a cloud VM. Not a laptop. A machine that runs 24/7, with all my repos, my secrets, my CLI tools, my database access. I SSH into it and write code. Every time I wrote code, I was teaching the AI. Every `CLAUDE.md` file, every commit convention, every branching rule, every test pattern. The machine accumulated my expertise.

The entire prompt for the production error agent is 230 lines of markdown. It encodes everything I would do manually: which repos to check, how to classify the error, when to fix vs. when to flag, how to write the commit message, where to run tests. The prompt is the product. Everything else is plumbing.

## Why It Works

Three things had to be true simultaneously.

**1. The code runs where I work.** C3 is not a sandboxed agent with limited access. It runs on my machine. It can `git blame`, query production, run my test suite, read my `.env` files. It has the same context I do.

**2. The codebase teaches itself.** Every `CLAUDE.md` file is a tutorial for the next agent session. The backend has 230 lines of context. The frontend has conventions for error handling, test patterns, component structure. The AI does not guess. It reads the instructions and follows them.

**3. The guardrails are in the prompt.** The agent never pushes to `main`. Never runs migrations. Never deletes files. Never modifies CI/CD. It creates PRs targeting `develop`, keeps fixes minimal, and flags anything it is not confident about. These rules are in the prompt template, not in the tool.

## What It Feels Like

The shift is not about productivity. It is about attention.

Before C3, every production alert was a context switch. Drop what I am doing, investigate, fix, deploy, go back to what I was doing. Each one took 30 minutes to 2 hours. With 44 alerts in two weeks, that is 22 to 88 hours of reactive work.

Now I read threads. I review diffs. I merge. The agent does the investigation and the fix. I do the judgment call.

This is not "AI replacing developers." This is a developer who spent 25 years building systems, encoding that expertise into prompts and conventions, and letting an AI execute with the same tools and access. The AI is fast. The expertise is mine.

## The Support Surprise

Production errors were the first use case. Then I added another trigger: customer support.

Support messages flow into a Slack channel. C3 watches that channel too. When a message arrives, the agent reads it, checks the codebase for context, classifies the issue (platform bug, user error, configuration, feature request), and writes a recommendation for the support team.

It does not reply to customers. It advises the team. "This looks like a missing invitation. The admin needs to resend from the program settings page. Here is the exact path."

Two different prompts, two different channels, same machine, same tool.

## Try It

C3 is open source: [github.com/Ideaplaces/c3](https://github.com/Ideaplaces/c3)

You need a machine that is always on (cloud VM, homelab, Mac Mini), Claude Code installed and authenticated, and a tunnel to access it from outside. The setup takes 15 minutes.

The hard part is not the tool. The hard part is writing prompts that encode your expertise. The 230-line production error prompt took me two weeks to refine. But once it works, it works at 3 AM.

Every time you write code, you are teaching the AI. Every convention you document, every test you write, every rule you encode. You are building the system that will eventually run without you.

I found this by removing myself from the loop.

*Built with C3 (Next.js + Claude Code SDK), running on an Azure VM behind a Cloudflare Tunnel. 153 tests. Open source.*
