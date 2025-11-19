# How to Push to GitHub

Follow these steps to push your project to GitHub.

## 1. Initialize Git (if not already done)
```bash
git init
```

## 2. Add your files
```bash
git add .
```

## 3. Commit your changes
```bash
git commit -m "Initial commit: Team Task Manager App"
```

## 4. Create a Repository on GitHub
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name your repository (e.g., `team-task-manager`).
4.  Click **Create repository**.

## 5. Connect to GitHub and Push
Replace `<YOUR_REPO_URL>` with the URL provided by GitHub (e.g., `https://github.com/username/team-task-manager.git`).

```bash
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```
