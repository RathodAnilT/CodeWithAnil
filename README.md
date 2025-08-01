# CodeWithAnil - DSA Learning Platform..

A personalized full-stack web platform built to help developers master Data Structures & Algorithms, solve problems using a real-time code editor, and write/share technical blogs — all under one seamless ecosystem.

## 🌟 Core Features.

### 📚 1. SDE Sheet (DSA Tracker)
- Curated list of must-solve DSA problems by topic and difficulty
- Track solved problems and monitor progress
- LeetCode-style activity calendar

### 💻 2. VS Code-Like Code Editor
- Built using Monaco Editor
- Multi-language support
- Light/Dark themes
- Code execution and submissions

### ✍️ 3. Tech Blog System
- Write & publish blog posts
- Comment, like, and bookmark blogs
- Filter blogs by tags

### 🔐 4. Authentication System
- Secure login/signup
- Role-based permissions

## 🧰 Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router
- Monaco Editor
- Context API for state management

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- RESTful API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/CodeWithAnil.git
cd CodeWithAnil
```

2. Set up the backend
```bash
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
NODE_ENV=development
MONGODB_URI= your uri will be here-- use your own setup
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
CLIENT_URL=http://localhost:3000
```

4. Set up the frontend
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend development server
```bash
cd client
npm run dev
```

3. Open your browser and navigate to http://localhost:3000

## 📘 Complete DSA Topics Covered

1. Arrays
2. Strings
3. Linked List
4. Stack
5. Queue
6. Hashing
7. Recursion & Backtracking
8. Searching
9. Sorting
10. Binary Search
11. Sliding Window
12. Two Pointers
13. Bit Manipulation
14. Mathematics & Number Theory
15. Greedy Algorithms
16. Dynamic Programming (DP)
17. Graphs (BFS, DFS, Shortest Path, MST, etc.)
18. Trees (Binary Tree, BST)
19. Tries
20. Heaps / Priority Queue
21. Disjoint Set Union (Union-Find)
22. Topological Sort
23. Segment Tree / Fenwick Tree
24. Monotonic Stack / Queue
25. Matrix Problems
26. Game Theory
27. Geometry
28. Advanced Data Structures

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

- **Anil Rathod** - [GitHub](https://github.com/RathodAnilT) | [LinkedIn](https://www.linkedin.com/in/anil-rathod-1a088819b/) 
