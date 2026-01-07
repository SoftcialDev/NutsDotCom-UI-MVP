# Complaints Analyzer

A single-page React application for analyzing complaints using sentiment analysis and key phrase extraction.

## Features

- Text input for complaints
- Sentiment analysis
- Key phrase extraction with confidence scores
- Clean, modern UI with Montserrat font
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The complaints API service running at `http://localhost:7071/api/complaints`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

## Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. Enter your complaint text in the textarea
2. Click the "Analyse" button
3. View the results in the three columns:
   - **Sentiment**: Overall sentiment of the complaint
   - **Key Phrases**: Extracted key phrases with confidence scores
   - **Labels**: Additional labels (if available in the API response)

## API Integration

The app sends POST requests to:
- Endpoint: `http://localhost:7071/api/complaints`
- Method: POST
- Body: `{ "text": "your complaint text" }`

Make sure the API service is running before using the application.


