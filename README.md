# MERN Bug Tracker 🐞

A full-stack bug tracking application built with the MERN (MongoDB, Express, React, Node.js) stack. This project demonstrates a systematic approach to **testing**, **debugging**, and **error handling** for both the backend and frontend of a web application.

---

## 📌 Objective

- Develop a structured approach to **testing and debugging** MERN applications.
- Implement **unit**, **integration**, and **component tests**.
- Use modern **debugging tools and techniques** to identify and resolve issues.
- Promote best practices to ensure application **stability and reliability**.

---

## 🛠️ Features

Users can:

- 🐛 Report new bugs using a simple form.
- 📋 View a list of all reported bugs.
- 🔄 Update bug status (e.g., `Open`, `In-Progress`, `Resolved`).
- ❌ Delete bugs.

---

## 📁 Project Structure

mern-testing/
├── client/                 # React front-end
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx         # Main application component
│   └── cypress/            # End-to-end tests
├── server/                 # Express.js back-end
│   ├── src/                # Server source code
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── tests/              # Server-side tests
│       ├── unit/           # Unit tests
│       └── integration/    # Integration tests
├── jest.config.js          # Jest configuration
└── package.json            # Project dependencies

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or cloud)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mern-bug-tracker.git
cd mern-bug-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install