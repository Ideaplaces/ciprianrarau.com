---
title: "The Flywheel: Teaching My System to Need Me Less"
publishDate: 2026-10-18T12:00:00Z
author: Ciprian Rarau
excerpt: "I can only dictate so many words a day. The only way past that limit is to teach the system to do more of my work every week. So I started measuring how much it does without me."
category: Thinking
tags: [agents, agentic-systems, ai-engineering, automation, metrics]
substack: false
draft: true
---

I dictate almost everything I do, and that gives me a hard limit. There are only so many words I can say in a day.

So the way I grow is by teaching the system to do more of my work. Every time I catch myself doing something by hand, I ask why the agent isn't doing it, and I teach it.

Last week I started measuring it, going back to the end of August:

![Three charts by week, from August 30 to October 4: shipped commits per 1,000 dictated words went from 28 to 61, the share of output started by C3 before I speak went from 34% to 44%, and million tokens per commit went from 3.7 to 9.2](/images/blog/the-flywheel/flywheel-trend.png)

The first chart is the one I care about. For every 1,000 words I dictate, what ships went from 28 commits to 61 in five weeks, while the number of words I dictate stayed about the same.

## C3 starts the work

C3 is my orchestrator, and most of its agents run before I'm up. On [TourCockpit](https://tourcockpit.com), one of them reads every merged pull request against the specs each morning, and another writes the help pages for what shipped. Then a second agent judges the help the first one wrote.

In the week of October 4, 44% of the output came from sessions C3 started, before I said anything.

## A team inside every session

When I work on something, I'm working with a team of agents. I looked at how my own mind goes through a change, step by step, and each step became an agent that starts by itself when its moment comes. There's an architect, a code reviewer, one that runs the tests, one that keeps the specs up to date.

Last week they ran more than 1,000 times. In September it was around 100 a week.

One agent reads my sessions, finds what I keep doing by hand, and proposes a new agent for it as a pull request. That's how a few of the agents on the team were born.

## The specs

Every product has specs in plain English, and everything else comes from them. When the code and the spec don't match, that's a bug, and an agent fixes it the next morning.

As an engineer, I moved from code to specs. That's where I shape ideas.

## I'm a drift engineer

We came up with this at a CTO meetup in Montreal. If you launch something to the moon, you have one shot. You let it fly and you correct the drift, a notch to the left, a notch to the right.

That's my job now. When the system drifts, I ask what the agent was missing and I teach it that, so the next time it doesn't drift there.

## What I'm working on next

The third chart is going the wrong way. Tokens per commit more than doubled in the same five weeks, so that's the number I'm bringing down now.

Most of my turns are still short, too. The agents usually finish a few minutes after my message, and I want them working longer on their own between my messages. Between midnight and 6 the machines are mostly idle.

## The Monday loop

Every Monday at 8, a script reads the week and posts these numbers to a channel next to last week's. It also shows which projects took most of my words, and what C3 needed me for when it got stuck.

Then I pick one thing to teach the system that week, and the next Monday shows me if it moved the number.
