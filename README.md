# DocFix AI

## AI-Powered Document Layout Engine

DocFix AI is an intelligent document formatting assistant that understands natural language instructions and automatically improves Microsoft Word document layouts while preserving the original content.

Instead of manually adjusting spacing, margins, fonts, headings, or images, users can simply describe the desired result, and DocFix AI generates a structured layout plan before applying changes.

---

# Vision

Create an AI-powered layout engine that removes the complexity of Microsoft Word formatting while giving users full control over every modification.

---

# Current Architecture

```
React Frontend
        │
        ▼
Upload Module
        │
        ▼
Document Reader
        │
        ▼
Internal Document Model
        │
 ┌──────┼─────────┐
 ▼      ▼         ▼
Analysis AI    Style Library
        │
        ▼
Layout Intelligence Engine
        │
        ▼
Document Editing Engine
        │
        ▼
Document Generator
        │
        ▼
Download
```

---

# Current Features

- Upload DOCX documents
- Read internal Word XML
- Extract paragraphs
- Detect headings
- Extract paragraph styles
- Extract font information
- Extract spacing information
- Build internal Document Model
- Basic document analysis

---

# Roadmap

## Phase 1
- [x] Upload Module
- [x] Download Module

## Phase 2
- [x] Document Model

## Phase 3
- [x] Style Library

## Phase 4
- [x] Open DOCX
- [x] Load XML
- [x] Extract Paragraphs
- [x] Detect Headings
- [x] Extract Basic Styles
- [ ] Extract Images
- [ ] Extract Tables
- [ ] Read styles.xml
- [ ] Extract Lists

## Phase 5
- [ ] Document Analysis

## Phase 6
- [ ] AI Understanding Engine

## Phase 7
- [ ] Layout Intelligence Engine

## Phase 8
- [ ] Document Editing Engine

## Phase 9
- [ ] Document Generator

---

# Tech Stack

Frontend
- React
- Vite

Backend
- Node.js
- Express

Document Processing
- JSZip
- Fast XML Parser

Future AI
- OpenAI API

---

Built as a software engineering project focused on modular architecture, explainable AI, and intelligent document layout automation.
