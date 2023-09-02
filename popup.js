// document.addEventListener('DOMContentLoaded', function () { // can replace with another event or smt, this runs when popup is opened
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var currentTab = tabs[0];
//         var tabId = currentTab.id;

//         chrome.scripting.executeScript(
//             {
//                 target: { tabId: tabId },
//                 function: someFunction,
//             },
//             function (result) {
//                 console.log("Result:", result);
//                 if (!chrome.runtime.lastError) {
//                     var cssStyles = result[0].result;
//                     console.log('Received CSS Styles in Popup:', cssStyles);
                    
//                     // You can now process or display the CSS styles in your popup as needed
//                 } else {
//                     console.error('Error executing script:', chrome.runtime.lastError);
//                 }
//             }
//         );
//     });
// });


const modes = ["darkMode", "nightMode"];

document.addEventListener('DOMContentLoaded', async function () {
    await setStyles();
});

async function setStyles() {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0];
        var tabId = currentTab.id;
        const states = await getStates();
        const result = await getStyles(states);
        console.log("Result:", result);
        if (!chrome.runtime.lastError) {
            await chrome.scripting.insertCSS({
                target: { tabId },
                css: result
            });
        } else {
            console.error('Error executing script:', chrome.runtime.lastError);
        }
    });
}

async function getStates() {
    console.log(localStorage)
    let states = {
        "dark": (localStorage.getItem("darkMode") == "null") ? 0.0 : 1.0,
        "night": (localStorage.getItem("nightMode") == "null") ? 0.0 : 1.0,
        "grayscale": 0.0, // 0 to 1
        "contrast": 1.0, // 0 to 2 (default is 1)
        "protanopia": 0.0, // red-green or red = gray
        "deuteranopia": 0.0, // red-green
        "tritanopia": 0.0 // blue = gray
    }
    return states; // for now
}

async function getStyles(states) {
    let css = [];
    
    if (states.protanopia) {
        css.concat([
            ""
        ]);
    } else {
        css.concat([
            ""
        ]);
    }

    if (states.deuteranopia) {
        css.concat([
            ""
        ]);
    } else {
        css.concat([
            ""
        ]);
    }

    if (states.tritanopia) {
        css.concat([
            ""
        ]);
    } else {
        css.concat([
            ""
        ]);
    }

    css = [
        `html { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) grayscale(${100*states.grayscale}%) contrast(${100*states.contrast}%) !important; }`,
        `img, picture, video { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) grayscale(0%) contrast(100%) !important; }`,
    ];

    if (states.night) css.push("html::before { display: block; background: #ffffab; mix-blend-mode: multiply; content: ' '; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 999; }");
    else css.push("html::before { display: none; }");

    let res = css.join(' ')
    return res;
}




// JS For Frontend

let darkMode = localStorage.getItem("darkMode");
let nightMode = localStorage.getItem("nightMode");
let highContrast = localStorage.getItem("highContrast");

const darkModeToggle = document.querySelector('.darkMode-button');
const nightModeToggle = document.querySelector('.nightMode-button');
const hightContrastToggle = document.querySelector('.high-contrast-button');
const body = document.querySelector('body');

async function toggleMode(mode, bool) {
    if (bool) body.classList.add(mode);
    else body.classList.remove(mode);
    localStorage.setItem(mode, (bool) ? "enabled" : "null");
}

for (const mode of modes) {
    if (localStorage.getItem(mode) != "null") {
        toggleMode(mode, true);
    }
}

// Add click listeners
document.querySelectorAll(".toggle").forEach((toggle, i) => {
    toggle.addEventListener('click', async () => {
        await toggleMode(modes[i], !body.classList.contains(modes[i]));
        await setStyles();
    });
});

// testing....
// document.addEventListener("DOMContentLoaded", function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var currentTab = tabs[0];
//         var tabId = currentTab.id;

//         chrome.scripting.executeScript(
//             {
//                 target: { tabId: tabId },
//                 files: ["stylePage.js"],
//             },
//             function (result) {
//                 console.log("Result:", result);
//                 if (!chrome.runtime.lastError) {                    
//                     // do smt
//                 } else {
//                     console.error('Error executing script:', chrome.runtime.lastError);
//                 }
//             }
//         );
//     });
// });




// AI Alt Text Toggle

// Add some css for the alt text display
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: async () => {
            pageBody = document.querySelector("body")

            // Add styling for the alt text
            const altTextStyle = document.createElement("style")
            altTextStyle.classList.add("altTextStyle")
            altTextStyle.textContent = ".altElement {font-size: 20px; font-weight: bold}"
            pageBody.insertAdjacentElement("afterend", altTextStyle)
        }
    })
})

let altText = localStorage.getItem("altText");

const altTextToggle = document.querySelector('.alt-text-button');

let altTexted = false

// Enable AI Alt Text
const enableAltText = () => {
    body.classList.add("ai-alt-text");
    localStorage.setItem("altText", "enabled")
    if (!altTexted) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: async () => {
                    // Array of all images on page
                    const images = Array.from(document.querySelectorAll("img"))
                    console.log(images)
        
                    // Iterate through all images, make alt text
                    for (const image in images) {
                        const imageSelector = images[image]
                        console.log(imageSelector)
                        console.log(imageSelector.src)
                        
                        // setTimeout(function() { 
                        //     asticaVision("2.0_full", image.src, 'Description', asticaCallback); //with options:
                        // }, 2000);
        
        
                        // Astica API endpoint
                        const apiUrl = 'https://vision.astica.ai/describe';
                        const apiKey = 'F8F2FE27-99AB-48BF-8CA6-0F00F24C18AA85CA951C-407F-4F11-B878-1213C8C4E34E';
                        const modelVersion = '2.0_full'; 
        
                        // Data to send to API
                        const imageUrl = images[image].src;
                        const visionParams = 'description';
        
                        // JSON payload
                        const payload = {
                        tkn: apiKey,
                        modelVersion: modelVersion,
                        visionParams: visionParams,
                        input: imageUrl,
                        };
                        if (imageSelector.alt == "") {
                            // Send a POST request to the Astica API
                            fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(payload),
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                // Log the API response in the console
                                console.log(data)
                                console.log(data["caption"]["text"]);

                                imageSelector.alt = data["caption"]["text"]
                                
                            })
                            .catch((error) => {
                                // Handle any errors
                                console.error('Error:', error);
                            });
                        }
                    }
                }
            });
        })
    }
    altTexted = true
 }
 // Disable AI Alt Text
 const disableAltText = () => {
    body.classList.remove("ai-alt-text");
    localStorage.setItem("altText", null)
}
if (altText == "enabled") {
    enableAltText();
}
altTextToggle.addEventListener('click', () => {
    altText = localStorage.getItem("altText");
    if (altText !== "enabled") {
        enableAltText();
    } else {
        disableAltText();
    }
})


// JS for alt text display

let displayAlt = localStorage.getItem("displayAlt");

const displayAltToggle = document.querySelector('.display-alt-button');

// Enable Display Alt
const enableDisplayAlt = () => {
    body.classList.add("display-alt");
    localStorage.setItem("displayAlt", "enabled")
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: async () => {
                // Array of all images on page
                const images = Array.from(document.querySelectorAll("img"))
                console.log(images)
                images.forEach((image) => {
                    // Create a new paragraph element
                    const altTextParagraph = document.createElement("p");
                    altTextParagraph.classList.add("altElement")
                    altTextParagraph.textContent = image.alt;
                    image.insertAdjacentElement("afterend", altTextParagraph);
                });
            }
        })
    })
 }
 // Disable Display Alt
 const disableDisplayAlt = () => {
    body.classList.remove("display-alt");
    localStorage.setItem("displayAlt", null)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: async () => {
                document.querySelectorAll('.altElement').forEach(e => e.remove());
            }
        })
    })
}

displayAltToggle.addEventListener('click', () => {
    displayAlt = localStorage.getItem("displayAlt");
    if (displayAlt !== "enabled") {
        enableDisplayAlt();
    } else {
        disableDisplayAlt();
    }
})