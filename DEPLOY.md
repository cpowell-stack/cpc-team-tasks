# Deployment Guide

## Local Deployment

To run the application locally in production mode:

1.  **Build the application:**
    ```bash
    npm run build
    ```

2.  **Start the server:**
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

## Vercel Deployment (Recommended for Next.js)

1.  **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).
2.  **Import the project into Vercel:**
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click "Add New..." -> "Project".
    - Import your repository.
3.  **Configure Environment Variables:**
    - Add the following variables in the Vercel project settings:
        - `DATABASE_URL`: Your production database URL (e.g., from Vercel Postgres, Supabase, or PlanetScale). **Note:** SQLite (`file:./dev.db`) will NOT work on serverless platforms like Vercel. You must switch to a cloud database (PostgreSQL or MySQL).
        - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`).
        - `NEXTAUTH_SECRET`: A strong random string.
        - `GOOGLE_CLIENT_ID`: From Google Cloud Console.
        - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
        - `EMAIL_SERVER_USER`: Your SMTP user.
        - `EMAIL_SERVER_PASSWORD`: Your SMTP password.
4.  **Deploy:** Click "Deploy".

## Docker Deployment

1.  **Build the Docker image:**
    ```bash
    docker build -t team-task-manager .
    ```
2.  **Run the container:**
    ```bash
    docker run -p 3000:3000 --env-file .env team-task-manager
    ```
