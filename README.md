# Assignment Workflow Portal - Frontend

## Features (Frontend)
- **Assignment Viewing**: Browse published assignments
- **Submission System**: Submit answers for assignments
- **Due Date Tracking**: Visual indicators for assignment deadlines
- **Submission History**: Track personal submission status
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Validation**: Frontend input validation
- **Error Handling**
- **Notifications** with React Hot Toast
- **Icons** with Lucide React
- **Date Utilities** with date-fns

## Tech Stack (Frontend)
- **React.js** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Context API** - State management
- **TailwindCSS** - Styling
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Project Structure (Frontend)
```
frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Setup Instructions (Frontend)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Assignment Portal
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development (Frontend)
### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables (Frontend)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Assignment Portal
```
