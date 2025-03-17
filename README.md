# AlienAI with Netlify Integration

A futuristic AI chat application with Alien, Einstein, and Newton modes, designed to be deployed on Netlify.

## Deployment Instructions

### 1. Create a Netlify Account
If you don't have a Netlify account, sign up at [netlify.com](https://netlify.com).

### 2. Deploy to Netlify
You can deploy this project to Netlify in one of these ways:

#### Option A: Deploy via Git Repository
1. Push this code to a GitHub, GitLab, or Bitbucket repository
2. Log in to your Netlify account
3. Click "New site from Git"
4. Select your repository
5. Configure the build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

#### Option B: Manual Deploy
1. Compress this folder as a ZIP file
2. Log in to your Netlify account
3. Go to "Sites" and drag & drop the ZIP file
4. Follow the prompts to complete deployment

### 3. Set up the OpenRouter API Key (CRITICAL STEP)

After deployment, you must add your OpenRouter API key as an environment variable:

1. Get an API key from [OpenRouter](https://openrouter.ai/keys)
2. Go to your Netlify site dashboard
3. Navigate to Site settings > Environment variables
4. Add a new variable:
   - Key: `OPENROUTER_API_KEY`  
   - Value: Your OpenRouter API key
5. Click "Save"
6. Trigger a redeployment of your site (Site overview > Deploys > Trigger deploy)

## How It Works

This project uses Netlify's serverless functions to securely handle API requests:

1. When users interact with the chat interface, the requests go through a serverless function
2. The function uses your API key (stored as an environment variable) to make requests to OpenRouter
3. This approach keeps your API key secure by never exposing it in client-side code

## Troubleshooting

If you see "Error connecting to the server. Please check your API key and internet connection":

1. Verify you've set up the `OPENROUTER_API_KEY` environment variable in Netlify
2. Check the function logs in Netlify (Functions > openrouter > View logs)
3. Ensure your API key is valid and has sufficient credits on OpenRouter
4. Try a different browser or disable any extensions that might block requests

## Contact

For assistance, please open an issue on the GitHub repository.

## License

MIT License 