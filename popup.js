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

            if (states.colourblind) await styleColour();
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
        "saturation": (localStorage.getItem("saturation") == "null") ? 1.0 : localStorage.getItem("saturation")/10, // 0 to 2 (default is 1)
        "contrast": (localStorage.getItem("contrast") == "null") ? 1.0 : localStorage.getItem("contrast")/10, // 0 to 2 (default is 1)
        "colourblind": (localStorage.getItem("colourblind") == "null") ? 0.0 : 1.0 // red
    }
    console.log(states);
    return states; 
}

async function getStyles(states) {
    let css = [];

    css = [
        `html { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) saturate(${100*states.saturation}%) contrast(${100*states.contrast}%) !important; }`,
        `img, picture, video { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) saturate(100%) contrast(100%) !important; }`,
    ];

    if (states.night) css.push("html::before { display: block; background: #ffffbc; mix-blend-mode: multiply; content: ' '; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 999; }");
    else css.push("html::before { display: none; }");

    let res = css.join(' ')
    return res;
}

async function styleColour() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        var tabId = currentTab.id;

        chrome.scripting.executeScript({
            target: { tabId },
            files: [ "stylePage.js" ]
        });
    });
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

const modes = ["master", "darkMode", "nightMode", "enableAltText", "displayAltText", "colourblind"];
const toggles = {"c1": "off", "c2": "on"};

let master = localStorage.getItem("master");
let enableAltText = localStorage.getItem("enableAltText");
let displayAltText = localStorage.getItem("displayAltText");
let darkMode = localStorage.getItem("darkMode");
let nightMode = localStorage.getItem("nightMode");
let saturation = localStorage.getItem("saturation");
let contrast = localStorage.getItem("contrast");
let colourblind = localStorage.getItem("colourblind");

const body = document.querySelector('body');

document.addEventListener('DOMContentLoaded', async function () {
    let saturation = localStorage.getItem("saturation");
    let contrast = localStorage.getItem("contrast");
    if (saturation == "null") localStorage.setItem("saturation", 10); saturation = 10;
    if (contrast == "null") localStorage.setItem("contrast", 10); contrast = 10;

    var saturation_output = document.getElementById("saturation");
        saturation_output.innerHTML = `${saturation*10}%`;
    var saturation_slider = document.getElementById("saturation_slider");
        saturation_slider.value = saturation;
        saturation_slider.addEventListener('input', function() {
            saturation_output.innerHTML = `${saturation_slider.value*10}%`;
            localStorage.setItem("saturation", saturation_slider.value);
            setStyles();
        });

    var contrast_output = document.getElementById("contrast");
        contrast_output.innerHTML = `${contrast*10}%`; 
    var contrast_slider = document.getElementById("contrast_slider");
        contrast_slider.value = contrast;
        contrast_slider.addEventListener('input', function() {
            contrast_output.innerHTML = `${contrast_slider.value*10}%`;
            localStorage.setItem("contrast", contrast_slider.value);
            setStyles();
        });
    

    await setStyles();
    await setAltText();
});


async function toggleMode(mode, val) {
    if (val) body.classList.add(mode);
    else body.classList.remove(mode);
    localStorage.setItem(mode, (val) ? "enabled" : "null");

    if (mode == "master" && val == false) {
        for (const mode of modes.slice(1)) {
            toggleMode(mode, false);
        }
    } /* else if (mode == "enableAltText" && val == false) {
        // toggleMode("displayAltText", false); 
    }*/
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
