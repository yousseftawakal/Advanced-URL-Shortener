# CortoX - Advanced URL Shortener

A modern, feature-rich URL shortener built with React, Node.js, and MongoDB. CortoX provides a sleek interface for creating, managing, and tracking shortened URLs with advanced analytics.

## Features

- 🔗 Create short, memorable URLs
- 📊 Track clicks and analytics
- 🎨 Beautiful, responsive UI with dark/light mode
- 🔐 User authentication and secure links
- 📱 QR code generation for easy sharing
- 📈 Export data to CSV
- 🎯 Custom alias support
- 🔍 Search and filter your links
- 📱 Mobile-friendly design

## Quick Start

### Prerequisites

- Node.js (npm)
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone hhttps://github.com/yousseftawakal/Advanced-URL-Shortener.git
cd Advanced-URL-Shortener
```

2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

```bash
# In server directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:

```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm start
```

## Tech Stack

- **Frontend**: React, SCSS, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: Custom SCSS with CSS variables
