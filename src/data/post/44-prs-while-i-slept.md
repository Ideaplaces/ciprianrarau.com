---
publishDate: 2026-04-06T12:00:00Z
author: Ciprian Rarau
title: "44 PRs While I Slept"
excerpt: "I built an AI agent that runs on my dev machine, watches my Slack channels, and fixes production errors autonomously. In two weeks, it merged 44 pull requests across three repositories. Here is how."
category: AI
substack: true
tags: ["c3", "claude-code", "autonomous-agents", "shipping", "devops"]
image: ""
contentType: markdown
draft: true
---

Two weeks ago, I woke up to a Slack thread I didn't write.

At 3:12 AM, an alert had fired in our `#alerts-backend-prod` channel. A SAML authentication error for one of our enterprise customers. By 3:24 AM, the agent had traced the error to a renamed config key, created a fix, written a test, and opened a pull request. By 9 AM, I read the thread on my phone, reviewed the diff, and merged it.

I didn't write a single line of code.

This happened 44 times in two weeks.

## The Numbers

| Repository | Merged PRs | What the agent fixed |
|---|---|---|
| mentorly-backend | 18 | SSO bugs, rate limit thundering herds, matching logic, notification timing |
| mentorly-website | 25 | React hydration mismatches, error reporting noise, SSR crashes |
| mentorly-devops | 1 | Alert summarizer with trace-based context |
| **Total** | **44** | |

These are not toy fixes. PR #689 fixed a Cronofy webhook thundering herd by adding jittered retry delays. PR #684 solved an OpenAI rate limit cascade that was burning API credits. PR #1609 added an ESLint rule to prevent React hydration mismatches across the entire frontend. Each PR has tests, targets `develop`, and follows our branching rules.

## What Made This Possible

The tool is called [C3](https://c3.ideaplaces.com) (Cloud Claude Code). It is open source. But the tool is not the breakthrough. The breakthrough is what comes before the tool.

For six months, I have been writing code on a cloud VM. Not a laptop. A machine that runs 24/7 in Azure, with all my repos, my secrets, my CLI tools, my database access. I SSH into it and write code. Every time I wrote code, I was teaching the AI. Every `CLAUDE.md` file, every commit convention, every branching rule, every test pattern. The machine accumulated my expertise.

C3 turns that machine into an autonomous agent platform.

Instead of me sitting at the terminal, C3 watches my Slack channels. When an alert fires, it starts a Claude Code session on my machine, with my repos, with my access. The agent reads the code, traces the error, checks recent commits, writes a fix, writes tests, runs them, and opens a PR. Then it reports back in the Slack thread.

The entire prompt for the production error agent is 230 lines of markdown. It encodes everything I would do manually: which repos to check, how to classify the error, when to fix vs. when to flag, how to write the commit message, where to run tests. The prompt is the product. Everything else is plumbing.

## Why It Works

Three things had to be true simultaneously:

**1. The code runs where I work.** C3 is not a cloud-hosted agent with limited access. It runs on my machine. It can `git blame`, query production, run my test suite, read my `.env` files. It has the same context I do.

**2. The codebase teaches itself.** Every `CLAUDE.md` file is a tutorial for the next agent session. Our backend has 230 lines of context. Our frontend has conventions for error handling, test patterns, component structure. The AI does not guess. It reads the instructions and follows them.

**3. The guardrails are in the prompt.** The agent never pushes to `main`. Never runs migrations. Never deletes files. Never modifies CI/CD. It creates PRs targeting `develop`, keeps fixes minimal, and flags anything it is not confident about. These rules are in the prompt template, not in the tool.

## What It Feels Like

The shift is not about productivity. It is about attention.

Before C3, every production alert was a context switch. Drop what I am doing, investigate, fix, deploy, go back to what I was doing. Each one took 30 minutes to 2 hours. With 44 alerts in two weeks, that is 22 to 88 hours of reactive work.

Now I read threads. I review diffs. I merge. The agent does the investigation and the fix. I do the judgment call.

This is not "AI replacing developers." This is a developer who spent 25 years building systems, encoding that expertise into prompts and conventions, and letting an AI execute with the same tools and access. The AI is fast. The expertise is mine.

## The Intercom Surprise

Production errors were the first use case. Then I added another trigger: customer support.

Our Intercom messages flow into a Slack channel. C3 watches that channel too. When a support message arrives, the agent reads it, checks the codebase for context, classifies the issue (platform bug, user error, configuration, feature request), and writes a recommendation for the support team.

It does not reply to customers. It advises the team. "This looks like a missing invitation. The admin needs to resend from the program settings page. Here is the exact path."

Two different prompts, two different channels, same machine, same tool.

## Try It

C3 is open source: [github.com/Ideaplaces/c3](https://github.com/Ideaplaces/c3)

You need a machine that is always on (cloud VM, homelab, Mac Mini), Claude Code installed and authenticated, and a tunnel to access it from outside. The setup takes 15 minutes.

The hard part is not the tool. The hard part is writing prompts that encode your expertise. The 230-line production error prompt took me two weeks to refine. But once it works, it works at 3 AM.

Every time you write code, you are teaching the AI. Every convention you document, every test you write, every rule you encode. You are building the system that will eventually run without you.

I found this by removing myself from the loop.

*Built with C3 (Next.js + Claude Code SDK), running on an Azure VM behind a Cloudflare Tunnel. 153 tests. 103 commits in two weeks.*
