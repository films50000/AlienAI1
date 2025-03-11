# AI-Enhanced Knowledge Base Chat Interface

An advanced chat interface with both AI capabilities and a custom knowledge base for specific topics. The system intelligently determines whether to use the knowledge base or general AI based on the relevance of user queries.

## Features

- **AI-Powered Chat**: Integrates with OpenRouter API for AI responses
- **Smart Knowledge Base**: Automatically loads and processes files from the Mydata folder
- **Hybrid Intelligence**: Leverages AI to determine query relevance to knowledge base topics
- **Beautiful UI**: Alien-inspired interface with animations and responsive design
- **Multilingual Support**: Handles both English and Arabic, with automatic language detection
- **Code Highlighting**: Proper formatting and syntax highlighting for code snippets
- **Markdown Support**: Renders markdown formatting in responses

## How to Use

1. Clone the repository
2. Place your knowledge base files in the Mydata folder
3. Open index.html in a browser or use a local server (`python -m http.server 8000`)
4. Enter your OpenRouter API key when prompted
5. Start asking questions!

## Knowledge Base

The system automatically loads files from the Mydata folder. You can add:
- Markdown files
- Text files

The AI will intelligently determine if your query relates to topics in these files.

## Technologies Used

- HTML5, CSS3, and JavaScript
- OpenRouter API for AI integration
- Custom knowledge base search algorithm
- Markdown rendering
- Code syntax highlighting

## Getting an OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Create a new API key
5. When prompted in the app, paste your API key

## API Key Security

Your API key is stored securely in your browser's localStorage and is:
- Never sent to any server except OpenRouter
- Not shared across browser sessions
- Can be cleared by clearing your browser data
- Used only to authenticate with the OpenRouter API

## Usage

1. Type your coding question in the input area
2. Press Enter or click the send button
3. Watch the AI respond with a natural typing animation
4. Code blocks are automatically formatted and syntax-highlighted

## Default AI Model

This app uses Google's Gemini 2.0 model (`google/gemini-pro`) via OpenRouter, which offers:
- Advanced reasoning capabilities
- Step-by-step problem solving
- Excellent coding knowledge
- Fast response times

## Customization

You can customize the AI model used by changing the `model` parameter in the `sendToOpenRouter` function in `script.js`. OpenRouter supports various models including:

- `google/gemini-pro` (default)
- `openai/gpt-3.5-turbo`
- `openai/gpt-4`
- `anthropic/claude-2`
- And many more

Check the [OpenRouter documentation](https://openrouter.ai/docs) for a full list of supported models.

## Color Scheme

The interface uses a modern dark theme with the following colors:
- Background: #121212
- Surface: #1e1e1e
- Primary: #4f46e5
- Text: #e2e8f0

You can customize these colors by editing the CSS variables in the `styles.css` file.

## Troubleshooting

If you encounter authentication errors:
1. Click the "Get API Key" link in the prompt
2. Ensure you have credit available in your OpenRouter account
3. Create a new API key and try again
4. Check that you've copied the entire API key without any extra spaces

## License

MIT 