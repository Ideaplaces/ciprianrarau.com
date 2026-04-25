---
publishDate: 2026-04-05T20:00:00Z
author: Ciprian Rarau
title: "You Are the Bottleneck"
excerpt: "55 builds. 12 hours. 2 lines of code. The AI didn't need a better prompt. It needed me to get out of the way."
category: AI
substack: true
tags: ["AI","iOS","debugging","react-native","expo","fastlane","CI-CD","productivity"]
image: ""
contentType: markdown
draft: false
---

# You Are the Bottleneck

I was setting up a CI/CD pipeline for a React Native fitness app. The app was using Expo's cloud build service, which meant multi-hour queue times for every build. I wanted local builds. Ten minutes from code push to TestFlight.

Setting up Fastlane, certificates, and the build pipeline took two hours. The first TestFlight build deployed perfectly. Then I opened the app.

It crashed.

## The Loop

What followed was a familiar pattern. Build. Install on my phone. Open the app. Watch it crash. Copy the error from Xcode. Paste it into the AI conversation. Wait for a suggestion. Try it. Rebuild. Install. Crash.

For about an hour, I was in the loop. Back and forth. Build, install on my phone, crash, copy the error, paste it back, try a fix, repeat. The AI could analyze errors in seconds, but it was blind. It couldn't see what was happening on the device. I was the eyes and hands.

## The Unlock

Then I asked a simple question: "Can you test it yourself?"

The AI had access to the iOS Simulator on my Mac. It could build the app, install it, launch it, wait, check if it crashed, take a screenshot, and read the logs. All without me.

```bash
# Build
xcodebuild -sdk iphonesimulator ...

# Install
xcrun simctl install "iPhone-UUID" WorkoutWave.app

# Launch and wait
xcrun simctl launch "iPhone-UUID" com.ideaplaces.workoutwave
sleep 15

# Did it crash?
xcrun simctl spawn "iPhone-UUID" launchctl list | grep workoutwave

# What does it look like?
xcrun simctl io "iPhone-UUID" screenshot /tmp/screenshot.png
```

Once I gave it this loop, I was out of the equation. The AI ran 25 simulator builds independently, each taking 5-7 minutes to compile. It wasn't fast. Each build was a full Xcode Release compilation. But the AI could queue the next experiment while the current one was building, read the screenshot when it finished, adjust its hypothesis, and try again. No copying logs. No pasting errors. No "can you try this?"

Over the next few hours, it methodically worked through the problem. Tried different Metro bundler configurations. Swapped navigation libraries. Tested module resolution patterns. Patched build scripts. Built a Hermes bytecode test harness. Wrote inline debugging into the JavaScript bundle. Each time, it would build, install on the simulator, take a screenshot, read the error, and iterate.

55 total build iterations. 25 of them without me.

## Start From Scratch

The second insight came when I told the AI to stop guessing and build a Hello World app instead.

```jsx
export default function App() {
  return (
    <View>
      <Text>Hello Workout Wave!</Text>
    </View>
  );
}
```

It worked. Clean Release build, rendered perfectly on the simulator. Then we added the navigation library. Crash. That narrowed the problem from "something in the entire app" to "something in the navigation stack."

## The Root Cause

After all that, the fix was two lines.

React Native 0.81 has a build script that disables JavaScript minification when Hermes (the JS engine) is enabled. The logic: "Hermes compiles to bytecode anyway, so minification is redundant." But it's not redundant. Without minification, dead code branches in pre-compiled npm packages survive into the production bundle. These dead branches reference module formats that work in development but break in production.

One line to enable minification. One line to prevent Expo from loading environment variables during the build. That's it. After 12 hours.

## What I Learned

**The breakthrough wasn't technical. It was operational.**

I didn't find the bug faster by being smarter about Metro bundler configuration or Hermes bytecode compilation. I found it by removing myself from the debugging loop. Before the simulator, every test cycle was 15 minutes and required my full attention. After, the AI ran 25 independent build cycles over several hours while I stepped away.

The tokens weren't the expensive part. The compute was. Each Xcode Release build took 5-7 minutes. 25 builds is over two hours of pure compilation time. But it was machine time, not my time. The AI was patient. It would build, check the screenshot, think, adjust, and build again. Methodically. No frustration. No shortcuts. Just systematic elimination.

## The Numbers

| Metric | Value |
|--------|-------|
| Total build iterations | 55 |
| Simulator builds (AI independent) | 25 |
| TestFlight deploys | 8 |
| Device builds | 6 |
| Bundle-only test builds | 16 |
| Pure compute time (builds compiling) | ~5.2 hours |
| Wall clock time (start to fix) | ~12 hours |
| Time I was actively in the loop | ~1 hour |
| Time AI was iterating independently | ~10 hours |
| Lines of code that fixed the problem | 2 |

Five hours of my Mac's CPU time. One hour of my time. The rest was the AI systematically working through hypotheses while my Mac compiled Xcode builds in the background.

The cost wasn't tokens. It was compute. Each Xcode Release build took 5-7 minutes. 55 builds is a lot of CPU time. But it was machine time, not my time. That's the trade that matters.

## You Are the Bottleneck

This is what I do every day, across every project. I work with the AI, and then I ask myself: how do I remove myself from this loop?

The pattern is always the same. I start by doing the work alongside the AI. I'm the eyes, the hands, the feedback mechanism. But the moment I notice that I'm the slowest part of the system, I stop and think: what would the AI need to iterate without me?

Sometimes it's a test suite. Sometimes it's access to a staging environment. In this case, it was the iOS Simulator and the ability to take screenshots. The specific tool doesn't matter. What matters is: once the AI can see what I'm seeing, it can iterate faster than I ever could. I am always the bottleneck.

Teaching the AI to test itself is not a one-time trick. It's a discipline. Every time I catch myself copy-pasting output back into the conversation, I stop and ask: why am I the middleman here? Can I give the AI direct access to this feedback?

The debugging session was 12 hours. But my time in it was about one hour. The rest was compute. My Mac's CPU doing builds while I lived my life. That's the trade I'm optimizing for. Not fewer tokens. Not faster responses. Less of me in the loop.

## The Pipeline

The end result: code pushed to main triggers a self-hosted GitHub Actions runner on my Mac, which builds with Fastlane and uploads to TestFlight. Seven minutes later, the app is available for testing.

No cloud queues. No manual steps. No hours of waiting.

And the debugging methodology? Give the AI a way to test itself. Start from scratch when stuck. The answer is usually simpler than you think.

---

*The CI/CD pipeline runs on Fastlane with a self-hosted GitHub Actions runner on a MacBook. The stack is Expo 54, React Native 0.81, React 19, and Hermes.*
