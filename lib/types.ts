export type ProjectType = 'html-css' | 'nodejs' | 'python' | 'jupyter' | 'docker'

export interface Project {
  id: string
  name: string
  type: ProjectType
  userId: string
  files: ProjectFile[]
  createdAt: Date
  updatedAt: Date
  description?: string
  githubUrl?: string
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: string
}

export interface UserData {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  credits: number
  createdAt: Date
  lastLoginAt: Date
}

export const PROJECT_TEMPLATES: Record<ProjectType, { name: string; icon: string; description: string; defaultFiles: ProjectFile[] }> = {
  'html-css': {
    name: 'HTML/CSS',
    icon: '🌐',
    description: 'Web development with HTML, CSS, and JavaScript',
    defaultFiles: [
      { id: '1', name: 'index.html', path: '/index.html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, ShadowSandBox!</h1>\n  <script src="script.js"></script>\n</body>\n</html>', language: 'html' },
      { id: '2', name: 'style.css', path: '/style.css', content: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: system-ui, sans-serif;\n  background: #0a0a0a;\n  color: #00ff00;\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\nh1 {\n  text-shadow: 0 0 10px #00ff00;\n}', language: 'css' },
      { id: '3', name: 'script.js', path: '/script.js', content: 'console.log("Welcome to ShadowSandBox!");', language: 'javascript' },
    ]
  },
  'nodejs': {
    name: 'Node.js',
    icon: '⬢',
    description: 'Server-side JavaScript with Node.js',
    defaultFiles: [
      { id: '1', name: 'index.js', path: '/index.js', content: 'const http = require("http");\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { "Content-Type": "text/plain" });\n  res.end("Hello from ShadowSandBox Node.js!");\n});\n\nserver.listen(3000, () => {\n  console.log("Server running at http://localhost:3000/");\n});', language: 'javascript' },
      { id: '2', name: 'package.json', path: '/package.json', content: '{\n  "name": "shadowsandbox-project",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  }\n}', language: 'json' },
    ]
  },
  'python': {
    name: 'Python',
    icon: '🐍',
    description: 'Python development environment',
    defaultFiles: [
      { id: '1', name: 'main.py', path: '/main.py', content: '#!/usr/bin/env python3\n\ndef main():\n    print("Welcome to ShadowSandBox!")\n    print("Python environment is ready.")\n\nif __name__ == "__main__":\n    main()', language: 'python' },
      { id: '2', name: 'requirements.txt', path: '/requirements.txt', content: '# Add your dependencies here\n# numpy\n# pandas\n# requests', language: 'plaintext' },
    ]
  },
  'jupyter': {
    name: 'Jupyter Labs',
    icon: '📓',
    description: 'Interactive notebooks for data science',
    defaultFiles: [
      { id: '1', name: 'notebook.ipynb', path: '/notebook.ipynb', content: '{\n  "cells": [\n    {\n      "cell_type": "markdown",\n      "metadata": {},\n      "source": ["# Welcome to ShadowSandBox Jupyter\\n", "Start coding your data science project!"]\n    },\n    {\n      "cell_type": "code",\n      "execution_count": null,\n      "metadata": {},\n      "outputs": [],\n      "source": ["print(\\"Hello, ShadowSandBox!\\")"]\n    }\n  ],\n  "metadata": {\n    "kernelspec": {\n      "display_name": "Python 3",\n      "language": "python",\n      "name": "python3"\n    }\n  },\n  "nbformat": 4,\n  "nbformat_minor": 4\n}', language: 'json' },
    ]
  },
  'docker': {
    name: 'Docker',
    icon: '🐳',
    description: 'Containerized development environment',
    defaultFiles: [
      { id: '1', name: 'Dockerfile', path: '/Dockerfile', content: 'FROM node:18-alpine\n\nWORKDIR /app\n\nCOPY package*.json ./\n\nRUN npm install\n\nCOPY . .\n\nEXPOSE 3000\n\nCMD ["npm", "start"]', language: 'dockerfile' },
      { id: '2', name: 'docker-compose.yml', path: '/docker-compose.yml', content: 'version: "3.8"\n\nservices:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n    volumes:\n      - .:/app\n    environment:\n      - NODE_ENV=development', language: 'yaml' },
      { id: '3', name: 'app.js', path: '/app.js', content: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.send("Hello from ShadowSandBox Docker!");\n});\n\napp.listen(3000, () => {\n  console.log("App running on port 3000");\n});', language: 'javascript' },
    ]
  },
}
