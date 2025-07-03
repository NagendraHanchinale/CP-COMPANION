# CP Companion

CP Companion is a full-stack web application designed to be your all-in-one dashboard for competitive programming. It helps you track upcoming contests, manage your CP platform handles, view performance analytics, practice problems by tag and difficulty, and discover curated YouTube solutions—all in one place.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Key Components & Architecture](#key-components--architecture)
- [API Endpoints](#api-endpoints)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Contest Aggregation:** Fetches and displays upcoming, live, and past contests from Codeforces, CodeChef, and LeetCode.
- **Profile Management:** Save and verify your CP handles for all major platforms.
- **Performance Analytics:** Visualize your rating history, contest participation, and problem-solving stats.
- **Practice Mode:** Generate random or tag-based problem sets from Codeforces, with a built-in timer.
- **YouTube Solutions:** Browse curated playlists of video solutions for popular problems.
- **Responsive UI:** Modern, dark-themed interface built with React and Tailwind CSS.

---

## Project Structure

```
cp-companion/
│
├── Backend/
│   ├── db/                # Database connection (PostgreSQL)
│   ├── models/            # Data models and cron jobs
│   ├── routes/            # Express route handlers (users, contests, handles, YT)
│   ├── utils/             # API wrappers, scrapers, helpers
│   ├── .env               # Backend environment variables
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components (pages, cards, graphs)
│   │   ├── App.jsx        # Main app router
│   │   └── main.jsx       # Entry point
│   ├── .env               # Frontend environment variables
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Axios, Recharts, React Router, React Toastify
- **Backend:** Node.js, Express, PostgreSQL, node-cron, bcrypt, JWT, axios, puppeteer
- **APIs Used:** [clist.by](https://clist.by/) for contest aggregation, Codeforces/CodeChef/LeetCode public APIs, YouTube Data API

---

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL (running and accessible)
- [clist.by](https://clist.by/) API credentials (for contest aggregation)
- YouTube Data API key (for video solutions)

### 1. Clone the Repository

```sh
git clone https://github.com/NagendraHanchinale/cp-companion.git
cd cp-companion
```

### 2. Backend Setup

```sh
cd Backend
npm install
```

- Create a `.env` file in `Backend/` with the following variables:

  ```
  DATABASE_URL=postgres://user:password@localhost:5432/yourdb
  JWT_SECRET=your_jwt_secret
  CLIST_USERNAME=your_clist_username
  CLIST_API_KEY=your_clist_api_key
  YOUTUBE_API_KEY=your_youtube_api_key
  
  ```

- Ensure your PostgreSQL database is running and the schema is set up (see `models/` and `db/`).

### 3. Frontend Setup

```sh
cd ../Frontend
npm install
```

- Create a `.env` file in `Frontend/` if you need to override Vite settings.

---

## Running the Application

### Backend

```sh
cd Backend
node server.js
```

- The backend runs on [http://localhost:3000](http://localhost:3000) by default.

### Frontend

```sh
cd Frontend
npm run dev
```

- The frontend runs on [http://localhost:5173](http://localhost:5173) by default.

---

## Key Components & Architecture

### Backend

- **Express Server:** Handles API requests, authentication, and database operations.
- **Contest Cron Job:** Fetches and updates contest data daily from clist.by.
- **User Routes:** Register, login, handle management, and platform verification.
- **YouTube Solutions:** Aggregates videos from curated playlists using the YouTube API.

### Frontend

- **App.jsx:** Main router for all pages.
- **HomePage.jsx:** Sidebar navigation and dynamic content area.
- **ContestPage.jsx:** Contest listing and filtering.
- **ProfilePage.jsx:** User info, handle management, and analytics.
- **PracticePage.jsx:** Random/tag-based problem generator with timer.
- **SolutionPage.jsx:** YouTube video browser for solutions.
- **SettingPage.jsx:** Account settings (future expansion).

---

## API Endpoints

### Backend (Express)

- `POST /users/register` — Register a new user
- `POST /users/login` — Login and receive JWT
- `GET /users/api/cf-varify?handle=...` — Verify Codeforces handle
- `GET /users/api/cc-varify?handle=...` — Verify CodeChef handle
- `GET /users/api/lc-varify?handle=...` — Verify LeetCode handle
- `GET /users/api/get-handles?email=...` — Get user CP handles
- `POST /users/api/set-handles` — Set/update user CP handles
- `GET /contestsList/get?platform=...` — Get contests (all or filtered by platform)
- `GET /get/solutions` — Get YouTube solution videos

### Frontend

- Uses Axios/fetch to call backend endpoints and public APIs as needed.

---

## Development Notes

- **Authentication:** JWT is issued on login, but the frontend currently stores only basic user info in localStorage. For production, store and use the JWT for protected routes.
- **Database:** Uses PostgreSQL. Ensure tables for `users`, `user_cp_handles`, and `contests` exist.
- **Contest Data:** Fetched and refreshed daily by a cron job. You can trigger it manually by restarting the backend.
- **Handle Verification:** When you add or update a handle, the backend verifies it via the respective platform's API.
- **Practice Problems:** Pulled live from Codeforces API; supports tag and difficulty filtering.
- **YouTube API:** Requires a valid API key with quota for playlist fetching.

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Submit a pull request with a clear description.

---

## License

This project is licensed under the MIT License.

---

**Questions?**  
Open an issue or contact the maintainer.
