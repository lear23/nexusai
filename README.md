Aquí tienes la traducción al inglés del README.md, lista para copiar y pegar:

---

# NexusAI - Chat Interface with Ollama and Groq
> A modern web application that allows you to chat with local AI models via Ollama and high-speed cloud models via the Groq API. Fully containerized and ready to deploy with Docker.

---
## 📜 Overview
NexusAI is a chat interface built with Next.js that serves as a centralized bridge for interacting with different language models (LLMs). You can connect to a local Ollama service to experiment with models running on your own machine or switch to the Groq API for impressively fast responses.
The project is fully containerized, meaning you can deploy it on any system with Docker installed, without worrying about dependencies or manual setup.

## ✨ Features
- **Modern User Interface:** A clean and responsive chat application built with Next.js and React.
- **Dual AI Integration:**
  - **Ollama:** Support for running and chatting with local language models.
  - **Groq:** Integration with the fast Groq API for cloud inference.
- **Easy Deployment:** Simplified setup and deployment with a single command thanks to Docker Compose.
- **Optimized & Secure:** Docker images are optimized to be lightweight, and secret management follows best practices.

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TypeScript
- **Backend & AI:** Node.js, Ollama, Groq API
- **Containerization:** Docker, Docker Compose

## 🚀 Getting Started
Follow these steps to get the application running on your local machine.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop).

### 1. Get the Code
You can clone this repository or simply download the necessary files (`docker-compose.yml`, `Dockerfile`, etc.).
```bash
git clone <REPOSITORY_URL>
cd nexusai
```

### 2. Set Up Environment Variables
Create a file named `.env.local` in the root of the project. This file will contain your API keys and model configuration.
Copy and paste the following content into your `.env.local` file:
```env
# Groq service API key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
# Internal URL for the app to communicate with the Ollama container
# Do not change this value if using Docker Compose
OLLAMA_URL=http://ollama:11434
# Default Ollama model you want to use
OLLAMA_MODEL=llama3.1:8b
```
**Important:** Replace `gsk_xxxxxxxxxxxxxxxxxxxxxxxx` with your actual Groq API key.

### 3. Start the Services
With everything in place, run the following command from the root of your project. This will build your application image and launch the app and Ollama containers.
```bash
docker-compose up --build -d
```
The `-d` (detached) flag runs the containers in the background.

### 4. Download an Ollama Model
The first time you use the application, you will need to download the model you specified in the `.env.local` file. To do this, run:
```bash
docker-compose exec ollama ollama pull llama3.1:8b
```
*(Replace `llama3.1:8b` if you chose a different model.)*
This is a one-time step for each model you want to use.

## 💻 Usage
- **Access the chat application** by opening your browser and visiting:
  [http://localhost:3000](http://localhost:3000)
- **The Ollama API** is exposed on your local machine at port `11434`. You can interact with it directly at:
  [http://localhost:11434](http://localhost:11434)

---