# Instagram Clone (MERN Stack, Socket.IO, JWT, Tailwind)

This project is a full-stack Instagram clone, aiming to replicate the core UI and functionality of Instagram, built using the MERN stack (MongoDB, Express.js, React.js, Node.js), Socket.IO for real-time features, JWT for authentication, and Tailwind CSS for styling. It includes real-time updates, notifications, chat, a responsive design with system-based dark/light mode support, robust search functionality, image compression, comprehensive error handling, and backend field validations. **Notably, the frontend is served directly from the backend server.**

**Live Demo:** [https://social-media-mern-project.onrender.com/](https://social-media-mern-project.onrender.com/)

---

## 🔐 Demo Login Credentials

- 👤 **Email:** `user@example.com`  
- 🔑 **Password:** `User@insta12`

> Use this test account to explore all features without signing up! 🚀

---

## Features

-   **Authentication:**
    -   User registration and login with JWT authentication.
-   **User Profiles:**
    -   View user profiles.
    -   Edit profile information (avatar, bio, etc.).
    -   Follow and unfollow users.
-   **Posts:**
    -   Create and upload posts with images (with image compression).
    -   View posts in a feed.
    -   Like and comment on posts.
    -   Bookmark posts.
    -   Delete own posts.
-   **Real-time Updates:**
    -   Real-time feed updates when new posts are created.
    -   Real-time like and comment updates.
-   **Real-time Notifications:**
    -   Real-time notifications for likes, comments, and follows.
-   **Real-time Chat:**
    -   Real-time messaging between users.
    -   Online/offline status indicators.
-   **Dark/Light Mode:**
    -   Automatic dark/light mode based on the user's system theme.
-   **Responsive UI:**
    -   Almost identical UI to Instagram, designed with Tailwind CSS for responsiveness.
-   **Robust Search Functionality:**
    -   Optimized search for users and posts.
-   **Story UI Element:**
    -   Story feature implemented as a UI element.
-   **Comprehensive Error Handling:**
    -   Robust error management throughout the application.
-   **Backend Field Validations:**
    -   Stringent field validation on the backend.

## Tech Stack

-   **Frontend:**
    -   React.js
    -   Redux (for state management)
    -   Axios (for API requests)
    -   Socket.IO Client
    -   Tailwind CSS (for styling)
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB (with Mongoose)
    -   Socket.IO Server
    -   JSON Web Tokens (JWT)
    -   Cloudinary

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    ```

2.  **Navigate to the backend directory:**

    ```bash
    cd instagram-clone/backend
    ```

3.  **Install backend dependencies:**

    ```bash
    npm install
    ```

4.  **Create a `.env` file in the backend directory and add your environment variables:**

    ```
    PORT=8080
    MONGODB_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUD_API_KEY=<your_cloudinary_api_key>
    CLOUD_API_SECRET=<your_cloudinary_api_secret>
    # or AWS S3 credentials
    AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
    AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
    AWS_BUCKET_NAME=<your_aws_bucket_name>
    AWS_REGION=<your_aws_region>
    ```

5.  **Build the frontend and place it into the backend's public directory**

    ```bash
    cd ../frontend
    npm install
    npm run build
    mv build ../backend/public
    cd ../backend
    ```

6.  **Start the backend server:**

    ```bash
    npm run dev
    ```

## Usage

-   Open your browser and navigate to `http://localhost:8080`.
-   Sign up or log in to your account.
-   Explore the feed, follow users, create posts, and interact with other users.
-   The dark/light mode will automatically adjust based on your system's theme settings.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
