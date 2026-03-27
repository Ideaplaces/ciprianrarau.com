---
title: "A Part of Me Lives in This Agent: How Million-Token Conversations Create Something New"
author: Ciprian Rarau
publishDate: 2026-03-27T12:00:00Z
category: AI
excerpt: "I didn't set out to build a specialist AI agent. I set out to evolve a matching algorithm. Twelve hours later, the conversation had absorbed my thinking process, my instincts for production systems, and my approach to navigating unknowns. A part of me now lives inside that context window."
substack: true
tags:
  - AI
  - development
  - productivity
  - claude-code
  - agents
  - architecture
  - complexity
draft: false
image: /images/diagrams/ai-specialist-agents-million-token.png
metadata:
  featured: true
  showAuthor: true
  showDate: true
  showReadingTime: true
  showTags: true
---

## It Started with an Evolution, Not a Bug

I didn't sit down to fix a bug. I sat down to evolve a platform.

Mentorly is a mentoring platform used by enterprise customers. Its core value proposition is matching: figuring out which mentor pairs best with which mentee. We had just shipped partial matching, a feature that lets program managers select a subset of participants and match them together instead of matching everyone at once.

But partial matching exposed something. The compatibility scores stopped making sense. A program manager would look at a pair, see that every single matching question overlapped perfectly, and the score would say 72%. How do you explain that?

The answer was architectural. The scoring algorithm was relative: it divided each pair's score by the highest score in the entire program. So a pair that looked perfect in the PM's subset was being compared against an invisible pair they couldn't see. The percentage was correct mathematically, but it was meaningless to the person making decisions.

This wasn't a flaw in the traditional sense. The relative algorithm worked fine when you matched everyone at once. The best pair got 100%, and everything else was proportional. But partial matching broke that contract. You can't show someone a subset and say "you're at 72% because someone outside your view is better." That's not information. That's confusion.

## Twelve Hours of Thinking, Not Coding

What happened next was not a coding session. It was a thinking session that produced code.

The conversation with Claude Code went through investigation, discovery, debate, implementation, production incidents, and resolution. We queried production databases, traced scoring pipelines through three different codebases, discovered that two different formulas had been living in parallel for years (one relative, one absolute), and found that stored scores from the original algorithm were computed with logic nobody had documented.

We debated whether absolute scoring was the right call. We worked through the multi-select problem: if a question allows 5 selections, should matching on 3 count the same as matching on 1? We realized the old algorithm accidentally made multi-select questions dominate the score, even when PMs set them to the same weight as single-select questions. A question set to 20% importance could actually account for 50% of the total score.

We normalized the formula. We rewrote the scoring engine. We built a score breakdown UI so PMs can see exactly why two people got their percentage. We recalculated 97,000+ match scores across all production programs. We hit edge cases: a preview service crashed because it built responses differently from the main model. A label replacement failed on first page load because an entry page was missing server-side rendering. Scores showed as 120% because stored values predated the new formula.

Every problem solved added to the conversation's understanding. By the end, it knew the scoring pipeline as deeply as I did.

## The Moment I Realized What Had Happened

When I was about to close the conversation, I stopped. This wasn't a chat log. This wasn't a set of instructions. This conversation had become something else entirely.

It had absorbed my thinking process.

Not the results of my thinking. The process itself. How I approach a production system when something doesn't add up. How I trace a number backwards through the database, through the model, through the service layer, to find where the logic diverges. How I decide when to refactor versus when to patch. How I weigh the risk of changing a core algorithm that enterprise customers depend on.

The agent knows how to handle unknowns. When the `PreviewMatches` service crashed in production because it was missing new fields, the conversation had enough context to immediately identify the root cause, fix it, and recognize that this was a code duplication problem that needed a deeper solution. That's not following instructions. That's judgment.

## What Lives Inside the Agent

Let me be precise about what I mean when I say "a part of me lives in this agent."

My CLAUDE.md files capture the static knowledge: "Use `ScorePairing.question_score` as the single source of truth." The spec document captures the formulas. The tests capture the expected behavior. These are facts. They're the textbook.

The conversation captures something different. It captures why. Why absolute scoring matters for partial matching. Why a question with weight 20 and choice limit 5 shouldn't contribute 100 points. Why the impersonate page needs server-side props even though it's just a redirect page. Why we normalize instead of multiply.

More importantly, it captures the pattern of my decision-making. When I see a score that doesn't make sense, I don't start by reading the code. I start by querying the database, checking what the actual numbers are, and working backwards. That approach is embedded in the conversation now. The agent has seen me do it, participated in it, and internalized it.

This is not information. This is thinking. And thinking is what you need when the next problem doesn't look like the last one.

## The Code Ships to Enterprise Customers

This isn't a toy. The code that came out of this conversation runs in production for enterprise customers. Programs with hundreds of users and tens of thousands of match pairs.

The agent didn't just write code. It shipped code. It traced production logs, queried production databases, recalculated live scores, and verified the results. It found a bug where `CalculateGroupMatches` silently failed to save scores because of validation issues, and switched to a direct update approach. It found that 115 out of 119 users in one program had zero match records because the batch calculation had never been run for them.

This is an agent that has reached production level. Not because I told it how to handle production systems, but because it went through the experience of operating one. It earned that capability the same way any engineer does: by shipping and dealing with what happens after you ship.

## A Two-Layer Knowledge Architecture

What I've arrived at is a system with two layers:

**Static knowledge** lives in CLAUDE.md files, spec documents, and tests. These are version-controlled, shared with the team, and durable. They capture facts, rules, and conventions. "Never duplicate business logic." "The scoring formula is `overlap_ratio * weight`." "The theoretical max is the sum of weights."

**Experiential knowledge** lives in specialist conversations. These capture reasoning, judgment, and approach. "We tried relative scoring and it broke partial matching because PMs see a subset but scores were relative to the full set." "The choice limits default to 1 because most programs don't configure them, and that's actually correct for single-select questions." "Check `PreviewMatches` separately because it builds responses with its own code path."

The static layer is the textbook. The experiential layer is the senior engineer who wrote the textbook and can tell you which chapter will break under pressure.

## Why the Million-Token Context Window Changes Everything

A year ago, this conversation would have hit the context limit halfway through. The early investigation would have been compressed away. The connection between the 72% bug and the relative scoring architecture would have been lost. The agent would have been working with a partial picture, and partial pictures produce partial solutions.

The million-token context window means a conversation can go deep enough, for long enough, to develop genuine understanding through experience. Not through prompting. Not through instructions. Through the same process that makes human engineers better: doing the work, hitting the walls, finding the way through.

I named the conversation `matching-partial` and registered it in my project's configuration as a specialist agent. Now when any new session detects that I'm working on matching, it recommends resuming that conversation instead of starting fresh. The agent picks up where it left off, with full context of every decision, every edge case, every production incident.

## What This Means

I manage dozens of codebases across different tech stacks. I jump between Ruby, TypeScript, Terraform, and Python daily. I can't build rigid workflows because tomorrow's problem is unpredictable.

But I can build specialist conversations. One that knows matching. One that will know the onboarding flow. One that will know the infrastructure. Each one develops organically through actual work, and each one gets smarter through experience.

The million-token context window isn't just "more memory." It's a qualitative shift. It means an AI conversation can absorb not just what you know, but how you think. Your instincts for when something is wrong. Your pattern for tracing a problem to its root. Your judgment about when to ship a fix and when to redesign.

Parts of me are stored in these agents. Not the results of my thinking, but the process of thinking itself. That's not a tool following instructions. That's something new. And I'm keeping it.
