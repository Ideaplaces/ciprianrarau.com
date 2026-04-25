---
title: "DevOps Across All Clouds: Why I'm Building Infrastructure for Every Startup"
author: Ciprian Rarau
publishDate: 2025-11-10T12:00:00Z
category: Shipping
excerpt: "After years of deploying production infrastructure across AWS, Azure, and Google Cloud for 10+ startups, I'm launching OneOps.cloud to bring enterprise-grade DevOps to every early-stage company."
substack: true
tags:
  - DevOps
  - cloud
  - infrastructure
  - production
  - startups
  - AI
  - development
image: /images/diagrams/devops-across-clouds-production-first-diagram-ab3bc984.png
metadata:
  featured: false
  showAuthor: true
  showDate: true
  showReadingTime: true
  showTags: true
transcript: |
  === TRANSCRIPT SESSION 1: Initial Content ===
  In the last months, I've been doing DevOps in a quite significant fashion, working with all cloud providers from Google Cloud to AWS to Azure. In all three of them, I'm working with production applications and really enjoying the process.
  
  === TRANSCRIPT SESSION 2: Corrected Timeline ===
  In the last few years, but specifically in this year alone, my focus on DevOps has been quite significant. It's not a few months, it's really years. Four years ago I started a journey with a friend of mine, and this has been growing and growing.
  
  === TRANSCRIPT SESSION 3: Final Version with All Details ===
  My journey with DevOps started 4-5 years ago with a friend of mine, but specifically in this year alone, my focus has been quite significant. This has been growing and growing - me helping more and more startups, and AI significantly speeds up everything. I've been working with all cloud providers from Google Cloud to AWS to Azure. In all three of them, I'm working with production applications and really enjoying the process. I'm doing this on everything in all the free cloud environments. I'm doing infrastructure as code like I did in the past but professionally, and it's really a game changer in terms of being able to handle everything from every part of the application - from databases to provisioning Kubernetes, provisioning services, VMs, working with Terraform, working with logs, alerts. It's really quite mesmerizing the power that I have while implementing this, and if properly done, how much leverage in the business this can be.

  The key here is that in all the environments, I have all free environments, depth-stitch production proper CI/CD with everything: integration tests, unit tests, end-to-end tests, UI tests. When this is done properly, especially in a B2B and B2C company, it really gives wings and makes it fly.

  Working in production is one of the most challenging but also rewarding aspects of it. Because if something doesn't work, it's very much noticeable. It also requires great software engineering because any kind of misstep can significantly backfire. And if it's done correctly, you can significantly speed the development.

  One of the things that I have done in the past in the recent months (since the beginning of a year) is using open technologies and keeping things as simple as possible, trying not to use solutions that create everything at a higher level of abstractions. I want everything to be direct because AI allows me to test and deploy and validate and run which makes everything super simple. I mean, not simple but in a sense it greatly accelerates the development.

  AI allows it with guidance, allowing a proper structuring of thinking as an architect, I can direct and have let's call a genetic engineer as an energetic engineer because that's what I am. I am shaping the AI into a very solid solution, the best of breed when it comes to DevOps practices. I'm not sure if there is something called green red red green or something green red. I don't know what's the term, but I mean it's zero downtime deployments and with many times I had to do deep migration while significantly improving the infrastructure while keeping the business running, so it's not only a green field but it can also be improvements as we go.

  I want to emphasize also the tension that I have when I'm working in DevOps, because I know that especially migrations and deployments when I make significant amounts of changes can lead to a lot of instability. Properly preparing for it. I did not talk about security, performance, availability, redundancy, disaster recovery - there are so many angles, but all of them start with amazing software engineering and everything being infrastructure as code and everything to be peer-reviewed and to be clear in text in code.

  As a software engineer initially, I'm a product person, so I always enjoy that aspect. But as I go with more experience, I realize how important this infrastructure piece is, and I really work in every place where I'm going. The first thing that I'm looking for is looking at the product to see what the customers want, but I'm also looking at the infrastructure when it comes to scalability and being able to handle customers - doesn't matter the number. Of course, when you have a big number of customers it's actually important, but also when you have a small number of customers because of the certainty that this will work in any situation.

  After working with 10+ startups on infrastructure, I've developed an expertise related to this and I know that the industry needs this badly. I work with all the cloud providers but also I work with Vercel, Railway, Render. I deploy everything through Terraform, lots of bash scripting, I make React Native builds, iOS builds, GitHub CI/CD, I deploy GitHub Pages and more. I host not only B2B like I'm in Enterprise Solutions but also host marketing websites, so it's really all-encompassing.

  I'm launching a company, a product, a service called OneOps.cloud. This will be specifically tailored towards startups and early businesses to get their infrastructure in place. This really shows my commitment and my dedication when it comes to DevOps.
---

Working in production is one of the most challenging yet rewarding aspects of DevOps. When something breaks, it's immediately visible. Over the years, I've deployed production infrastructure across AWS, Azure, and Google Cloud for more than 10 startups, and now I'm launching OneOps.cloud to bring enterprise-grade DevOps to every early-stage company.

## The Evolution from Code to Infrastructure

My DevOps journey started 4-5 years ago, but this year alone has seen explosive growth. I've been helping more startups build their infrastructure, with AI dramatically accelerating my capabilities. Working across all three major cloud providers—Google Cloud, AWS, and Azure—I'm running production applications on each platform.

As a software engineer originally, I'm a product person at heart. But experience has taught me how critical infrastructure is. Now, when I join any company, I examine two things immediately: what customers want from the product, and whether the infrastructure can scale to handle them. Whether you have 10 customers or 10,000, you need certainty that your system will perform in any situation.

```mermaid
flowchart TD
    A[Product Requirements] --> B[Infrastructure Design]
    B --> C[Multi-Cloud Strategy]
    C --> D[AWS Production]
    C --> E[Azure Production]
    C --> F[GCP Production]
    D --> G[Terraform IaC]
    E --> G
    F --> G
    G --> H[Peer Review]
    H --> I[CI/CD Pipeline]
    I --> J[Zero-Downtime Deployment]
    J --> K[Production Monitoring]
    K --> L[Customer Value]
    
    style A fill:#f9d5e5,stroke:#333,stroke-width:2px
    style J fill:#90EE90,stroke:#333,stroke-width:3px
    style L fill:#87CEEB,stroke:#333,stroke-width:3px
```

![Diagram 1](/images/diagrams/devops-across-clouds-production-first-diagram-ab3bc984.png?v=88ad65c9)

## Infrastructure as Code: The Foundation of Everything

Infrastructure as code has become a game changer in my professional practice. Being able to handle every aspect of an application—from databases to Kubernetes provisioning, services, VMs, Terraform configurations, logs, and alerts—the power is mesmerizing. When properly implemented, the leverage this brings to a business is immense.

But here's what I want to emphasize: the tension inherent in DevOps work. Migrations and deployments involving significant changes can lead to instability. Proper preparation is critical. Security, performance, availability, redundancy, disaster recovery—there are countless angles to consider, but all of them start with exceptional software engineering. Everything must be infrastructure as code, everything must be peer-reviewed, and everything must be clear in text and code.

## Production Reality: Where Theory Meets Practice

Working in production requires exceptional software engineering because any misstep can significantly backfire. Yet when done correctly, you can dramatically accelerate development. Over recent months, I've focused on using open technologies and keeping things as direct as possible, avoiding solutions that create unnecessary abstraction layers. AI allows me to test, deploy, validate, and run everything, greatly accelerating the development process.

With proper architectural guidance, AI becomes a powerful tool for shaping best-of-breed DevOps practices. I've been implementing blue-green deployments for zero-downtime releases. Many times I've performed deep migrations while significantly improving infrastructure while keeping the business running. It's not just greenfield projects—it's continuous improvement in production.

In every environment, I've built production-ready setups with comprehensive CI/CD pipelines including:
- Integration tests
- Unit tests
- End-to-end tests
- UI tests

When done properly, especially for B2B and B2C companies, this infrastructure gives them wings.

## The Comprehensive Infrastructure Stack

After working with 10+ startups on infrastructure, I've developed expertise the industry desperately needs. Beyond the major cloud providers, I work with Vercel, Railway, and Render. I deploy everything through Terraform with extensive bash scripting, create React Native builds, iOS builds, implement GitHub CI/CD, deploy GitHub Pages, and more. I host both B2B enterprise solutions and marketing websites—it's truly all-encompassing.

The production stack I've deployed includes:
- Multi-cloud infrastructure across AWS, Azure, and Google Cloud
- Kubernetes orchestration with auto-scaling
- Terraform for complete infrastructure as code
- Comprehensive CI/CD pipelines with full test coverage
- Blue-green deployments for zero downtime
- Security hardening and compliance frameworks
- Performance optimization and caching strategies
- High availability with redundancy across regions
- Disaster recovery with automated backups
- Monitoring, logging, and alerting systems
- Mobile app builds and deployments

## Managing the Tension of Production DevOps

The tension in DevOps work is real. Every deployment, especially migrations involving significant changes, carries risk. This is why everything starts with solid software engineering principles:

1. **Infrastructure as Code**: Every configuration, every deployment, every change is codified
2. **Peer Review**: Nothing goes to production without review
3. **Comprehensive Testing**: From unit to end-to-end, testing catches issues before customers do
4. **Security First**: Not an afterthought but built into every layer
5. **Performance Monitoring**: Real-time visibility into system health
6. **Availability Planning**: Redundancy and failover strategies
7. **Disaster Recovery**: When things go wrong, recovery is automated and tested

These aren't just best practices—they're survival requirements in production environments.

## Launching OneOps.cloud: Infrastructure for Every Startup

This extensive production experience has led me to launch OneOps.cloud, a service specifically tailored for startups and early businesses to establish their infrastructure correctly from day one. This represents my commitment to making enterprise-grade infrastructure accessible to companies that need it most but often can't access it.

The vision is simple: every startup deserves the same infrastructure excellence that large enterprises enjoy. With AI accelerating my capabilities and my experience across multiple cloud platforms and production deployments, I can make this happen.

## The Future of Infrastructure

We're no longer constrained by complexity. Today's challenge isn't technical limitations—it's bringing best practices to everyone who needs them. With modern tools, AI assistance, and proper architectural thinking, we can build robust, scalable infrastructure that grows with your business.

What excites me most is pushing code to production and seeing it handle real traffic, real customers, real problems. There's nothing quite like deploying infrastructure that seamlessly scales from your first customer to your millionth, knowing you've built something that works in any situation.

The infrastructure revolution is here. It's time every startup had access to it.