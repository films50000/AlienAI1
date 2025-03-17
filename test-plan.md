# AlienAI API Test Plan

## Changes Made
1. Removed hardcoded API key from script.js
2. Updated sendToOpenRouter function to use serverless function
3. Verified serverless function setup in netlify/functions

## Testing Steps

### Local Testing
1. Rename script.js to script.js.original
2. Copy script.js.fixed to script.js
3. Install dependencies:
   ```
   cd netlify/functions
   npm install
   ```
4. Start local Netlify development server:
   ```
   npx netlify dev
   ```
5. Test the application in your browser
   - Try sending messages in Alien mode
   - Try switching to Einstein mode
   - Verify no API key errors in console

### Netlify Deployment Testing
1. Push changes to GitHub
2. Deploy to Netlify
3. Set OPENROUTER_API_KEY environment variable in Netlify dashboard
   - Go to Site settings > Environment variables
   - Add variable OPENROUTER_API_KEY with your API key
4. Test the deployed application
   - Verify API calls work
   - Check the Function logs in Netlify to ensure proper function execution

## Verification
- No hardcoded API key in code
- API calls routed through serverless functions
- API key securely stored in environment variables
- All functionality working as expected 