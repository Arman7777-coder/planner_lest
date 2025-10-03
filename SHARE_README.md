# Sharing the Planner App with Your Friend on Windows

Since you built the app on Linux, but your friend is on Windows, here are ways to share the built app or the project.

## Option 1: Share the Built App (dist directory)
1. Zip the `dist` directory: `zip -r planner-app.zip dist/`
2. Send the `planner-app.zip` to your friend via email, Google Drive, Dropbox, or any file sharing service.
3. Your friend can unzip and run the `.exe` or `.msi` file directly on Windows.

## Option 2: Share the Source Code for Your Friend to Build
1. Zip the entire project: `zip -r planner-source.zip .` (exclude node_modules if present)
2. Send `planner-source.zip` to your friend.
3. Instruct your friend to:
   - Unzip the file.
   - Install Node.js from https://nodejs.org/
   - Run `npm install`
   - Run `npm run build-win` to build the app.
   - Or run `npm start` to run in development.

## Option 3: Upload to GitHub
1. Create a GitHub repository.
2. Push the code: `git init`, `git add .`, `git commit -m "Initial commit"`, `git remote add origin <repo-url>`, `git push -u origin main`
3. Share the repo link with your friend, who can clone and build on Windows.

Choose the option that suits your needs.