# GitHub Upload Instructions

Since we're having issues with automatic upload, let's do this manually using a personal access token:

## Step 1: Create a Personal Access Token (PAT)
1. Go to GitHub.com and log in to your account
2. Click on your profile photo in the top-right corner
3. Select "Settings"
4. Scroll down to "Developer settings" in the left sidebar
5. Click on "Personal access tokens" → "Tokens (classic)"
6. Click "Generate new token" → "Generate new token (classic)"
7. Give it a name like "AlienAI Upload"
8. Set expiration as needed (e.g., 7 days)
9. Select the "repo" scope (this allows repository access)
10. Click "Generate token"
11. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Step 2: Upload Using the Token
1. Open Terminal
2. Navigate to your project directory:
```
cd "/Users/macbook/Desktop/My games/untitled folder 30/31-3"
```
3. Enter the following command, replacing `YOUR_TOKEN` with the token you copied:
```
git remote set-url origin https://YOUR_TOKEN@github.com/films50000/AlienAI.git
git push -u origin main
```

For example, if your token is `ghp_abc123def456`, the command would be:
```
git remote set-url origin https://ghp_abc123def456@github.com/films50000/AlienAI.git
git push -u origin main
```

This method will securely upload your project to GitHub without requiring you to enter credentials each time. 