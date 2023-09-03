// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     console.log(message);
//     if (message.stylesheet) {
//         const stylesheet = message.sylesheet;
//         console.log("Received stylesheet:", stylesheet);
//     }
// });

// document.addEventListener('DOMContentLoaded', function () {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var currentTab = tabs[0];
//         var tabId = currentTab.id;

//         chrome.scripting.executeScript(
//             {
//                 target: { tabId: tabId },
//                 function: getStyles,
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
  
// function getStyles() {
//     var styles = [];
  
//     var sheets = document.styleSheets;
//     for (var i = 0; i < sheets.length; i++) {
//       try {
//         var rules = sheets[i].cssRules;
//         for (var j = 0; j < rules.length; j++) {
//           var rule = rules[j];
//           if (rule instanceof CSSStyleRule) {
//             styles.push(rule.cssText);
//           }
//         }
//       } catch (error) {
//         // Handle any errors due to cross-origin stylesheets
//         console.error('Error fetching CSS rules from stylesheet:', error);
//       }
//     }
  
//     return styles;
// }  

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     var currentTab = tabs[0];
//     var tabId = currentTab.id;
  
//     const css = 'html { filter: invert(1) hue-rotate(180deg); } img, picture, video { filter: invert(1) hue-rotate(180deg); }';

//     chrome.scripting.insertCSS({
//         target: { tabId },
//         css: css
//     });
// });



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
    console.log(states);
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


let altTexted = false;

async function setAltText() {
    let enableAltText = localStorage.getItem("enableAltText");
    let displayAltText = localStorage.getItem("displayAltText");


    if (enableAltText != "null") {
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

    if (displayAltText != "null" && enableAltText != "null") {
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
        });
    } else if (displayAltText == "null") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: async () => {
                    document.querySelectorAll('.altElement').forEach(e => e.remove());
                }
            })
        });
    }
}




// JS For Frontend


document.addEventListener('DOMContentLoaded', async function () {
    await setStyles();
    await setAltText();
});

const modes = ["master", "enableAltText", "displayAltText", "darkMode", "nightMode"];
const toggles = {"c1": "off", "c2": "on"};

let master = localStorage.getItem("master");
let enableAltText = localStorage.getItem("enableAltText");
let displayAltText = localStorage.getItem("displayAltText");
let darkMode = localStorage.getItem("darkMode");
let nightMode = localStorage.getItem("nightMode");

const body = document.querySelector('body');

async function toggleMode(mode, val) {
    if (val) body.classList.add(mode);
    else body.classList.remove(mode);
    localStorage.setItem(mode, (val) ? "enabled" : "null");

    if (mode == "master" && val == false) {
        for (const mode of modes.slice(1)) {
            toggleMode(mode, false);
        }
    } else if (mode == "enableAltText" && val == false) {
        // toggleMode("displayAltText", false);
    }
}

for (const mode of modes) {
    if (localStorage.getItem(mode) != "null") {
        toggleMode(mode, true);
    }
}

// Add click listeners
document.querySelectorAll(".switch-box").forEach((toggle, i) => {
    toggle.addEventListener('click', async () => {
        if (localStorage.getItem("master") == "null" && modes[i] != "master") return;
        await toggleMode(modes[i], !(body.classList.contains(modes[i])));
        await setStyles();
        await setAltText();
    });
});

var slider = document.querySelector("slider-bar");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}