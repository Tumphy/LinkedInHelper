# LinkedIn Helper

A comprehensive LinkedIn automation tool with support interfaces, campaign management, and lead tracking capabilities.

## Project Structure

The project is divided into two main parts:

- `backend/`: Node.js backend API
- `dashboard/`: React frontend application

## Features

- **Support System**: Complete support interface with tickets, knowledge base, and FAQs
- **Campaign Management**: Create and manage LinkedIn outreach campaigns
- **Lead Tracking**: Import and track leads from LinkedIn
- **Message Templates**: Create and use reusable message templates
- **AI Assistance**: Generate personalized messages with AI

## Dashboard Components

### Support Interface

- **Ticket System**: Users can create, view, and respond to support tickets
- **Knowledge Base**: Searchable articles organized by category
- **FAQs**: Common questions with expandable answers
- **Contact Form**: Direct support request submission

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB instance (local or remote)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with required environment variables:
   ```
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/linkedin-helper
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Dashboard Setup

1. Navigate to the dashboard directory:
   ```
   cd dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with required environment variables:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

5. The application will be available at `http://localhost:3000`

## Running the Entire Application

You can use concurrently to run both backend and frontend:

1. Install concurrently:
   ```
   npm install -g concurrently
   ```

2. From the project root:
   ```
   concurrently "npm run start:backend" "npm run start:dashboard"
   ```

## License

MIT