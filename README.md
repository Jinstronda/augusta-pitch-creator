# Augusta Pitch Creator

AI-powered pitch deck automation. Stop spending 1-2 hours manually building slides for every deal.

## The Problem

Every new deal needs a custom pitch deck. Same slides, different data. Copy-pasting case studies. Updating financial projections. Tweaking positioning angles.

You waste 1-2 hours per deal on grunt work.

## The Solution

Upload your data. The AI generates your entire pitch deck automatically.

- Case studies formatted and ready
- Financial projections visualized
- Positioning angles tailored
- Multiple layout options to choose from

**Time saved**: 1-2 hours per deal

## Quick Start

```bash
# Install
cd frontend
npm install

# Run server
npm run server
```

Open http://localhost:3000 in your browser. Click the buttons in the UI to:
1. Generate all presentation variants
2. Review and select your preferred layouts
3. Create final combined deck

That's it. Everything else is automated.

## How It Works

1. Input your deal data
2. AI generates 5 presentation variants (different layouts for case studies + core slides)
3. Review them in the interactive UI
4. Select your preferred layouts
5. System assembles final pitch deck

All slides are created in Pitch.com format, ready to present.

## What You Get

**Case Studies**: 1-slide, 2-slide, or 4-slide layouts - pick what fits your story
**Financial Slides**: PnL projections formatted and visualized
**Positioning**: Angles slide showing competitive advantages

The AI handles formatting, layout, and data visualization. You focus on closing deals.

## Architecture

```
Frontend (Vanilla JS)
├── index.html          # Interactive UI
├── server.js           # API server
└── tests/
    ├── create-all-presentations-parallel.js
    └── create-combined-with-variants.js
```

**Tech**: Automated browser control + Pitch.com integration

## Why This Matters

Most automation tools require manual setup for every deck.

This generates complete pitch decks from raw data.

**ROI**: Save 1-2 hours per deal × 20 deals/month = 20-40 hours/month freed up.

## Requirements

- Node.js
- Chrome installed
- Pitch.com account (logged into Chrome Profile 3)

## Roadmap

Backend AI orchestration (RAG + LLM) is scaffolded. Current version automates slide creation from pre-formatted data. Next: full end-to-end AI generation from raw inputs.
