# Medical Report Simplifier — Backend API

A simple Express.js backend that accepts medical report uploads (PDF/images), extracts text, and uses Google Gemini AI to simplify the report into patient-friendly language.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

> Get a free API key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 3. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:3000`.

---

## API Endpoints

### `GET /api/health`

Health check.

**Response:**
```json
{ "status": "ok", "message": "Medical Report Simplifier API is running" }
```

### `POST /api/upload`

Upload a medical report and get a simplified explanation.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` — PDF, PNG, JPG, or WEBP (max 10MB)

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/medical-report.pdf"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "originalFileName": "blood-test.pdf",
    "extractedTextLength": 1423,
    "simplifiedReport": "## Summary\nYour blood test results show..."
  }
}
```

**Error Responses:**

| Status | Reason                          |
|--------|---------------------------------|
| 400    | No file uploaded                |
| 413    | File too large (>10MB)          |
| 415    | Unsupported file type           |
| 422    | No text could be extracted      |
| 503    | AI service not configured       |
| 500    | Unexpected server error         |

---

## Project Structure

```
├── server.js                  # Express app entry point
├── routes/
│   └── upload.js              # POST /api/upload route
├── services/
│   ├── textExtractor.js       # PDF parsing + OCR
│   └── aiSimplifier.js        # Gemini AI integration
├── middleware/
│   └── errorHandler.js        # Centralized error handling
├── uploads/                   # Temp file storage (auto-cleaned)
├── .env.example               # Environment template
└── package.json
```

## Supported File Types

- **PDF** — Text extracted via `pdf-parse`
- **PNG / JPG / WEBP** — Text extracted via Tesseract.js OCR

## Notes

- Uploaded files are **deleted immediately** after processing (privacy-first).
- The first OCR request may be slower as Tesseract downloads language data.
- This is a **simplified backend** — no auth, no database, no complex architecture — as specified.
