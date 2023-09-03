# WebStylus - Making browsing more accessible

## Inspiration
WebStylus was initially a do-it-all extension with several small features focused on customizability. However, as we kept working, we started to shift our focus towards browsing accessibility. By integrating tools to make websites more navigable and readable, WebStylus reduces eye stress on users and makes browsing easier for the visually impaired.
## What it does
WebStylus is a Google Chrome Extension that allows the user to customize their browsing experience to their own needs. WebStylus boasts dark and night mode filters, saturation and contrast adjustment, AI alt-text generation, and an experimental colourblind-accessible function. This blend of features makes it so that this extension helps the visually impaired with their browsing, while still offering convenient customizability for everyday users.
## How we built it
| Tool | Description |
| ----------- | ----------- |
| ML Model | Special image-to-text model used to generate alt text for images. |
| chrome.tabs API | Retrieval of browser data for the extension. |
| chrome.storage API | Enhance user experience with the extension. |
| chrome.runtime API | Used for error logging when scripting. |
| Async Utility Module | Improving functionality by enabling promise-based code. |
| Scripting | Edit browser source code. |
| VSCode Liveshare | Collaborate on the extension. |
| Github | Sharing code and testing the product of customized sample pages |
## Challenges we ran into
Throughout this hackathon, we ran into several problems. 
Our first problem came during the ideation phase. As a team, we were enthusiastic about our project idea, but as the night progressed, we grew skeptical of its applications. We were able to persevere through our identity crisis and develop our concept into one that could benefit people on a much larger scale than we had thought.
We also found problems working with the extension because of Google's security policies. Basic functions like `splice()` and tasks such as accessing the current webpage's stylesheet became impossible, and we had to resort to many workarounds to ensure extension functionality.
Finally, as our project began to come together, we found difficulty injecting scripts into the web browser to edit the page's source code. 

## Accomplishments that we're proud of
We’re proud of our commitment to the project, our resilience when running into challenges, and our final product as a whole. We're very proud that we were able to overcome our identity crisis and many other roadblocks to create an application to effectively help others. 
## What we learned
As coders, we added several new functions to our figurative toolkits. We used functions such as `getComputedStyle()` and `replace()` to take the places of functions that wouldn't function due to Google Chrome security policies.
Most crucially, we learned about colour theory, colour manipulation and colour blindness. By working on an accessibility extension that focused on colours, we had to adapt and figure out how to manipulate colours to make web pages more customizable and readable for individual users.
## What's next for WebStylus
There are so many more features we want to add to WebStylus! More advanced accessibility features for the colourblind, special customizable text-to-speech, and more! We plan on releasing this extension on the Chrome Web Store soon.

## [Current] Instructions for use
1. Download the repository's code.
2. Go to chrome://extensions/.
3. Click "Load unpacked"
4. Select the local folder containing the extension.
5. Click the extension's icon to enable it on your current tab.
6. Customize the page with WebStylus's sliders and toggles.
7. Enjoy a more accessible browsing experience!

---
Built by @mattshrew, @raydrost, and @derekgou.
