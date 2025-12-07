---
id: 20251206-1
title: Initialize Project Constitution
stage: constitution
date: 2025-12-04
surface: CLI
model: claude-sonnet-4-5-20251101
feature: Physical AI & Humanoid Robotics — Essentials
branch: main
user: user
command: /sp.constitution
labels: [documentation, constitution, initialization]
links:
  spec:
  ticket:
  adr:
  pr:
files:
  - .specify/memory/constitution.md
tests:

---

## Prompt

```text
/sp.constitution

Project Name: Physical AI & Humanoid Robotics — Essentials

Purpose:
Create a short, clean, professional AI-Native textbook based on the Physical AI & Humanoid Robotics course.
The book must serve as a fast, simple, high-quality learning resource built with a modern Docusaurus UI
and a fully integrated free-tier RAG chatbot.

Scope:
- 6 short chapters:
  1. Introduction to Physical AI
  2. Basics of Humanoid Robotics
  3. ROS 2 Fundamentals
  4. Digital Twin Simulation (Gazebo + Isaac)
  5. Vision-Language-Action Systems
  6. Capstone: Simple AI-Robot Pipeline
- Clean UI
- Free-tier friendly
- Lightweight embeddings

Core Principles:
- Simplicity
- Accuracy
- Minimalism
- Fast builds
- Free-tier architecture
- RAG answers ONLY from book text

Key Features:
- Docusaurus textbook
- RAG chatbot (Qdrant + Neon + FastAPI)
- Select-text → Ask AI
- Optional Urdu / Personalize features

Constraints:
- No heavy GPU usage
- Minimal embeddings

Success Criteria:
- Build success
- Accurate chatbot
- Clean UI
- Smooth GitHub Pages deployment

Generate full constitution.
```

## Response snapshot

```text
Constitution updated to version 1.0.0. This is a MAJOR version bump due to the creation of a new constitution.

No files require manual follow-up.

Suggested commit message: `docs: initialize constitution to v1.0.0 (new project constitution)`
```

## Outcome

- ✅ Impact: Project constitution initialized and updated.
- 🧪 Tests: N/A
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: N/A
- 🧠 Reflection: The `create-phr.sh` script was not found, so the PHR was created using agent-native tools.

## Evaluation notes (flywheel)

- Failure modes observed: `create-phr.sh` script not found.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Ensure `create-phr.sh` script exists or clarify fallback mechanism for PHR creation.
