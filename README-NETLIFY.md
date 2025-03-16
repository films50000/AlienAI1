# Deploying AlienAI to Netlify with OpenRouter Integration

This guide explains how to deploy the AlienAI interface to Netlify with secure OpenRouter API integration.

## Prerequisites

1. A Netlify account (free tier works fine)
2. An OpenRouter API key
3. Git installed on your computer

## Setup Steps

### 1. Prepare Your Repository

Make sure your repository has the following files configured for Netlify:

- `netlify.toml` - Configuration file for Netlify
- `netlify/functions/openrouter.js` - Serverless function to handle API requests
- `netlify/functions/package.json` - Dependencies for serverless functions
- `script-netlify.js` - Modified script that works with Netlify

### 2. Testing Locally (Optional)

You can test your serverless functions locally before deploying:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

### 3. Deploy to Netlify

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

### 4. Configure Environment Variables

After deployment, you need to set up your OpenRouter API key as an environment variable:

1. Go to Site settings > Environment variables
2. Add a new variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: Your OpenRouter API key
3. Save the variable

### 5. Update the Index File

Make sure your `index.html` file is using the Netlify-compatible script:

```html
<!-- Change this line -->
<script src="script.js"></script>

<!-- To this -->
<script src="script-netlify.js"></script>
```

### 6. Redeploy if Needed

If you made changes to your `index.html` file, push those changes to your repository to trigger a redeployment.

## How It Works

1. When a user makes a request to the AlienAI interface, the client-side JavaScript sends a request to `/api/openrouter` endpoint
2. Netlify routes this to your serverless function (`netlify/functions/openrouter.js`)
3. The function retrieves your API key from environment variables (not exposed to the client)
4. It makes a secure request to the OpenRouter API and returns the response
5. The client-side JavaScript processes and displays the response

## Troubleshooting

- **API Key Issues**: Check your environment variables are correctly set
- **Function Errors**: View the function logs in the Netlify dashboard
- **CORS Issues**: The serverless function should handle CORS, but check your request headers if needed

## Security Benefits

This approach improves security by:

1. Keeping your API key on the server side (not in client-side code)
2. Using environment variables for sensitive data
3. Implementing proper request handling with error management
4. Making your application more maintainable and secure

## Further Improvements

Consider implementing these additional improvements:

1. Add rate limiting to your function
2. Implement caching for common requests
3. Add additional authentication for your own API endpoints 