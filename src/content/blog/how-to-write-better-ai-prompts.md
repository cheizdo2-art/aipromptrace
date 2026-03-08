---
title: "How to Write Better AI Prompts (With Real Examples That Work)"
description: "Stop getting generic AI responses. Learn 7 practical prompt techniques with before/after examples that actually improve output quality across any model."
date: 2026-03-08
category: guides
tags: ["prompt engineering", "ai prompts", "chatgpt tips", "ai writing", "prompt tips"]
author: "AI Prompt Race Team"
---

Most people type their first thought into ChatGPT and wonder why the response sounds like a Wikipedia article written by a robot.

The problem isn't the model. It's the prompt.

I've run thousands of prompts through different AI models over the past year. Some models handle vague prompts better than others, sure — but across the board, the single biggest factor in output quality is how you ask the question.

Here are 7 techniques that consistently produce better results. No fluff, no theory — just patterns that work with actual before/after examples.

## 1. Give Context Before the Task

This is the most common mistake. People jump straight to "write me a blog post about X" without telling the model who they are, who they're writing for, or what the end goal is.

**Weak prompt:**
> Write a product description for wireless headphones.

**Better prompt:**
> I sell mid-range electronics on Amazon. Write a product description for wireless headphones ($89 price point) aimed at remote workers who take a lot of Zoom calls. Keep it under 150 words, focus on mic quality and comfort for 8-hour wear.

The second prompt gives the AI four things to work with: audience, price context, key selling points, and length constraints. The result is dramatically more useful because the model isn't guessing what you need.

Think of it this way — if you asked a human copywriter to "write about headphones" with zero context, you'd get something generic too.

## 2. Show, Don't Describe

Instead of explaining the tone you want, give the model an example of that tone.

**Weak prompt:**
> Write a funny tweet about Monday mornings. Make it relatable and casual.

**Better prompt:**
> Write a tweet about Monday mornings in this style: "Just realized my retirement plan is basically 'hope something works out.' Anyway, back to my 9-5." — Keep it under 200 characters, no hashtags.

The first prompt leads to forced humor — the kind where the AI clearly tried to be funny and missed. The second gives it a voice template to match. The output sounds like something a person would actually post.

This works for any style. Want professional? Paste a paragraph from a company report. Want casual? Paste a text message thread. The model mirrors what you show it.

## 3. Use the "Act As" Frame (But Be Specific)

You've probably seen "act as a marketing expert" prompts. They work — sort of. The problem is that "marketing expert" is so broad it barely narrows anything down.

**Weak prompt:**
> Act as a marketing expert. Help me with my email campaign.

**Better prompt:**
> You're an email marketing specialist who's managed campaigns for DTC brands doing $1M-5M/year. I'm launching a new protein bar and need a 3-email welcome sequence for new subscribers. My brand voice is casual and a bit irreverent — think Liquid Death's tone but for fitness. First email should arrive immediately after signup.

See the difference? The second prompt creates a specific person with specific experience. The AI stops giving textbook advice and starts giving practical, contextual recommendations.

## 4. Ask for Multiple Options

One prompt, one response — that's how most people use AI. But models are much more useful when you ask for variations.

**Instead of:**
> Write a subject line for my newsletter about AI trends.

**Try:**
> Give me 10 subject lines for a weekly AI newsletter. Mix these styles: 3 curiosity-driven, 3 benefit-focused, 2 contrarian takes, 2 with numbers/data. Target audience is tech-savvy professionals, not beginners.

Now you have a selection to choose from instead of a single option that might not land. You can even follow up with "combine the best parts of #3 and #7" to iterate fast.

This approach works especially well with creative tasks — taglines, headlines, product names, ad copy. The first idea is rarely the best one, and AI can generate ten options in the time it takes to type one.

## 5. Break Complex Tasks Into Steps

Big asks produce mediocre results. If you ask an AI to "write a complete business plan," you'll get a shallow overview of everything instead of a deep dive into anything.

**Weak prompt:**
> Write a business plan for an online tutoring platform.

**Better approach — break it into a chain:**

1. "List the 5 biggest problems students face with current online tutoring platforms. Be specific, not generic."
2. "Based on those problems, describe a tutoring platform that solves the top 3. Focus on what makes it different from Chegg and Wyzant."
3. "Draft the revenue model section. Include 3 pricing tiers with specific dollar amounts and what's included in each."
4. "Write the competitive analysis. Compare against these specific competitors: Chegg, Wyzant, Varsity Tutors, Khan Academy."

Each step builds on the previous one, and the AI has enough focus to actually go deep instead of spread thin.

I use this technique constantly for research tasks. Instead of "research the AI market," I'll start with "what are the 5 most important trends in the AI market right now" and then drill into each one individually.

## 6. Tell the Model What NOT to Do

This is weirdly effective and most people never think to do it.

AIs have default patterns they fall into. ChatGPT loves starting responses with "Great question!" or "Absolutely!" Claude tends to hedge everything with "it's important to note that..." Gemma is shorter but sometimes too terse.

You can break those patterns by explicitly calling them out.

**Example:**
> Explain quantum computing to a 12-year-old. Don't use the phrase "in simple terms." Don't start with a definition. Don't use bullet points. Write it as a conversation between a kid and an older sibling.

That "don't" list forces the model off its default rails. Instead of the standard "Quantum computing, in simple terms, is..." you get something actually creative and readable.

Some useful "don'ts" to keep in your back pocket:
- Don't use filler phrases like "it's worth noting" or "it's important to remember"
- Don't start with "Sure!" or "Great question!" or "Absolutely!"
- Don't use more than one exclamation mark
- Don't hedge every statement with "however" and "on the other hand"
- Don't use bullet points (forces paragraph-style answers, which often read better)

## 7. Iterate, Don't Restart

The biggest difference between people who get great results from AI and those who don't isn't better prompts — it's that they keep going after the first response.

First response too long? Say "cut this in half, keep only the most impactful points."

Too formal? Say "rewrite this like you're texting a friend."

Missing something? Say "add a section about pricing, keep the same tone."

Wrong angle? Say "this is too positive. Add 2-3 honest criticisms and potential downsides."

Each follow-up gets you closer to what you actually want. The first prompt is a starting point, not the finish line. Most people give up too early.

## Which Model Handles Prompts Best?

Not all models respond equally to these techniques. Some follow complex instructions better; others are faster but need simpler prompts.

From my testing across six free models:

- **Nemotron 30B** is the best at following multi-step, detailed prompts — it rarely drops instructions
- **Trinity Large 400B** handles creative prompts and long-form output well, but it's slower
- **Gemma 3 12B** is fast and works great with short, direct prompts — but can lose track of complex instructions
- **GLM 4.5 Air** excels at structured output and handles constraints like word counts more precisely

The honest answer? It depends on the task. That's why I always test the same prompt across 2-3 models before committing to one for a project. Different models interpret the same words differently — and sometimes the "worse" model on paper gives a better response for your specific use case.

You can [test any prompt across multiple models for free](/) on our comparator. Or browse our [prompt library](/tools/prompt-library) for templates that are already optimized for different tasks.

## Quick Reference: Prompt Checklist

Before hitting enter, ask yourself:

1. Did I give enough context about who I am and what I need this for?
2. Did I show an example of the style or tone I want?
3. Is my ask specific enough, or could a human misinterpret it too?
4. Would it help to ask for multiple options instead of one?
5. Is this task small enough for a single prompt, or should I break it up?
6. Did I call out any defaults or patterns I don't want?

You don't need all six on every prompt. But running through this list before complex tasks will save you a lot of back-and-forth.

## Start Testing

The only way to get better at prompting is to practice. Seriously — reading about it helps, but you need reps.

Pick a task you actually need done today. Write a prompt using one or two techniques from this guide. Run it through a couple of different models and compare the results.

You'll be surprised how much difference a well-crafted prompt makes — even with free models.

**[Try your prompts across 6 AI models for free →](/)**

---

*Published March 2026. Examples tested on Gemma 3, Nemotron, Trinity, and GLM models via AI Prompt Race.*
