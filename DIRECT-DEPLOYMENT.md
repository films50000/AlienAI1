# AlienAI Direct Implementation

This is a simplified implementation of AlienAI with the OpenRouter API key directly embedded in the serverless function for easier testing.

## Files

- `netlify/functions/openrouter-proxy-direct.js` - Serverless function with embedded API key
- `script-direct.js` - Simplified client-side JavaScript
- `direct-test.html` - Simplified HTML for testing

## Quick Start

1. Open `direct-test.html` in your browser to test locally with Netlify CLI:
   ```
   npx netlify dev
   ```

2. Navigate to http://localhost:8888/direct-test.html

## Deploying to Netlify

1. Push your code to GitHub

2. In Netlify:
   - Connect to your GitHub repository
   - Set the publish directory to `.`
   - Deploy

3. Once deployed, you can access the direct test at:
   ```
   https://your-site-name.netlify.app/direct-test.html
   ```

## Moving to Production

Once you've confirmed everything works with the direct implementation, you should:

1. Delete the direct implementation files:
   - `netlify/functions/openrouter-proxy-direct.js`
   - `script-direct.js`
   - `direct-test.html`

2. Remove the extra redirect from `netlify.toml`

3. Add your API key as an environment variable in Netlify
   - Go to Site settings > Environment variables
   - Add a new variable with key `OPENROUTER_API_KEY` and your API key as the value

4. Use the regular implementation that reads the API key from environment variables

## Note on Security

This direct implementation includes the API key directly in the code. This is **not secure** for production use and is only intended for testing. Always use environment variables for API keys in production. 