<!-- Sync Impact Report:
Version change: 0.0.0 -> 1.0.0
Modified principles: N/A (all new)
Added sections: Purpose, Scope, Key Features, Constraints, Success Criteria
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated
- .specify/templates/spec-template.md: ✅ updated
- .specify/templates/tasks-template.md: ✅ updated
- .specify/templates/commands/sp.constitution.md: ✅ updated
Follow-up TODOs: N/A
-->
# Physical AI & Humanoid Robotics — Essentials Constitution

## Purpose

Create a short, clean, professional AI-Native textbook based on the Physical AI & Humanoid Robotics course. The book must serve as a fast, simple, high-quality learning resource built with a modern Docusaurus UI and a fully integrated free-tier RAG chatbot.

## Scope

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

## Core Principles

### Simplicity
The textbook content, UI, and underlying architecture must prioritize simplicity to ensure ease of learning, development, and maintenance. Avoid unnecessary complexity.

### Accuracy
All information presented in the textbook and provided by the RAG chatbot MUST be technically accurate and verifiable.

### Minimalism
Design and implement with a focus on essential features and content, avoiding bloat. This applies to code, UI elements, and textbook explanations.

### Fast builds
The Docusaurus site build process MUST be optimized for speed to ensure rapid iteration and deployment.

### Free-tier architecture
The RAG chatbot and related infrastructure MUST be designed to operate within the constraints of free-tier cloud services to minimize operational costs.

### RAG answers ONLY from book text
The RAG chatbot MUST exclusively use the content of the textbook for generating answers. It MUST NOT introduce external information or general AI knowledge.

## Key Features

- Docusaurus textbook
- RAG chatbot (Qdrant + Neon + FastAPI)
- Select-text → Ask AI
- Optional Urdu / Personalize features

## Constraints

- No heavy GPU usage
- Minimal embeddings

## Success Criteria

- Build success
- Accurate chatbot
- Clean UI
- Smooth GitHub Pages deployment

## Governance

This constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All PRs/reviews must verify compliance. Complexity must be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
