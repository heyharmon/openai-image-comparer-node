# OpenAI Image Comparer

This application uses OpenAI's Vision API to compare two images and identify the differences between them. Built with Node.js, Fastify, and the OpenAI API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

3. Create an uploads directory:
```bash
mkdir uploads
```

4. Start the server:
```bash
node server.js
```

5. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Upload a "before" image and an "after" image using the web interface
2. Click "Compare Images" to analyze the differences
3. The differences will be displayed below the images

## Features

- Simple and intuitive web interface
- Real-time image preview
- Secure file handling
- Detailed difference analysis using OpenAI's Vision API

## Requirements

- Node.js 14+
- OpenAI API key
- Modern web browser
