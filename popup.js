async function initialize() {
    // console.log(localStorage);

    // if (Number(localStorage.getItem("master")) != 1) {
    //     localStorage.setItem("saturation", 10);
    // }
    
    for (let mode of modes) {
        let setting = Number(localStorage.getItem(mode));
        let val = (setting != null && setting != "null" && setting != "0" && setting != 0);
        localStorage.setItem(mode, (val) ? setting : 0)
        if (val) toggleMode(mode, true);
    }
    
    let saturation = Number(localStorage.getItem("saturation"));
    let contrast = Number(localStorage.getItem("contrast"));
    if ((Number(localStorage.getItem("master")) != 1) || saturation == "null" || saturation == null) saturation = 10;
    if ((Number(localStorage.getItem("master")) != 1) || contrast == "null" || contrast == null) contrast = 10;
    localStorage.setItem("saturation", saturation);
    localStorage.setItem("contrast", contrast);
    
    await setStyles();
    await setAltText();
}

async function setStyles() {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        var currentTab = tabs[0];
        var tabId = currentTab.id;
        const states = await getStates();
        const result = await getStyles(states);
        // console.log("Result:", result);
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
    let states;
    if (Number(localStorage.getItem("master")) != 1) {
        states = {"dark": 0, "night": 0, "saturation": 1, "contrast": 1, "colourblind": 0};
    } else {
        states = {
            "dark": Number(localStorage.getItem("darkMode")),
            "night": Number(localStorage.getItem("nightMode")),
            "saturation": Number(localStorage.getItem("saturation"))/10, // 0 to 2 (default is 1)
            "contrast": Number(localStorage.getItem("contrast"))/10, // 0 to 2 (default is 1)
            "colourblind": Number(localStorage.getItem("colourblind")) // red
        }
    }
    // console.log(states);
    return states; 
}

async function getStyles(states) {
    let css = [];

    css = [
        `html { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) saturate(${100*states.saturation}%) contrast(${100*states.contrast}%) !important; }`,
        `img, picture, video { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) saturate(100%) contrast(100%) !important; }`,
    ];

    if (states.night) css.push("html::before { display: block; background: #ffffbcbf; mix-blend-mode: multiply; content: ' '; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 999; }");
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
    let enableAltText = Number(localStorage.getItem("enableAltText"));
    let displayAltText = Number(localStorage.getItem("displayAltText"));


    if (enableAltText != "null" && enableAltText != null && enableAltText != 0) {
        if (!altTexted) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    function: async () => {
                        // Array of all images on page
                        const images = Array.from(document.querySelectorAll("img"))
                        // console.log(images)
            
                        // Iterate through all images, make alt text
                        for (const image in images) {
                            const imageSelector = images[image]
                            // console.log(imageSelector)
                            // console.log(imageSelector.src)
                            
                            // setTimeout(function() { 
                            //     asticaVision("2.0_full", image.src, 'Description', asticaCallback); //with options:
                            // }, 2000);
            
            
                            // Astica API endpoint
                            const apiUrl = 'https://vision.astica.ai/describe';
                            const apiKey = 'INSERT YOUR API KEY HERE!!';
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
                                    // console.log(data)
                                    // console.log(data["caption"]["text"]);
    
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

    if (displayAltText != "null" && displayAltText != null && displayAltText != 0 && enableAltText != "null" && enableAltText != null && enableAltText != 0) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: async () => {
                    // Array of all images on page
                    const images = Array.from(document.querySelectorAll("img"))
                    // console.log(images)
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



const body = document.querySelector('body');

// below is testing auto-enable extension when switching tabs... only does it for the first 2 tabs tho

// chrome.tabs.onActivated.addListener(async function() {
//     await initialize();
// });

// chrome.tabs.onUpdated.addListener(async function (tabId, info) {
//     await initialize();
// });

document.addEventListener('DOMContentLoaded', async function () {
    if (Number(localStorage.getItem("master")) != 1) document.querySelectorAll(".slider-bar").forEach((slider) => { slider.disabled = true; });
    else document.querySelectorAll(".slider-bar").forEach((slider) => { slider.disabled = false; });

    await initialize();
    for (let mode of modes) {
        let setting = Number(localStorage.getItem(mode));
        let val = (setting != null && setting != "null" && setting != "0" && setting != 0);
        if (val) toggleMode(mode, true);
    }

    let saturation = localStorage.getItem("saturation");
    let contrast = localStorage.getItem("contrast");
    var saturation_output = document.getElementById("saturation");
        saturation_output.innerHTML = `${saturation*10}%`;
    var saturation_slider = document.getElementById("saturation_slider");
        saturation_slider.value = saturation;
        saturation_slider.addEventListener('input', function() {
            if (Number(localStorage.getItem("master")) != 1) return;
            saturation_output.innerHTML = `${saturation_slider.value*10}%`;
            localStorage.setItem("saturation", saturation_slider.value);
            setStyles();
        });

    var contrast_output = document.getElementById("contrast");
        contrast_output.innerHTML = `${contrast*10}%`; 
    var contrast_slider = document.getElementById("contrast_slider");
        contrast_slider.value = contrast;
        contrast_slider.addEventListener('input', function() {
            if (Number(localStorage.getItem("master")) != 1) return;
            contrast_output.innerHTML = `${contrast_slider.value*10}%`;
            localStorage.setItem("contrast", contrast_slider.value);
            setStyles();
        });
});


async function toggleMode(mode, val) {
    if (val) body.classList.add(mode);
    else body.classList.remove(mode);
    localStorage.setItem(mode, (val) ? 1 : 0);

    if (mode == "master") {
        if (val == false) {
            for (const mode of modes.slice(1)) {
                toggleMode(mode, false);
            }
            document.querySelectorAll(".slider-bar").forEach((slider) => { slider.disabled = true; });
        } else {
            document.querySelectorAll(".slider-bar").forEach((slider) => { slider.disabled = false; });
        }
    } /* else if (mode == "enableAltText" && val == false) {
        // toggleMode("displayAltText", false); 
    }*/
}

// Add click listeners
document.querySelectorAll(".switch-box").forEach((toggle, i) => {
    toggle.addEventListener('click', async () => {
        if ((Number(localStorage.getItem("master")) == "null" || Number(localStorage.getItem("master")) == null || Number(localStorage.getItem("master")) == 0) && (modes[i] != "master")) return;
        await toggleMode(modes[i], !(body.classList.contains(modes[i])));
        await setStyles();
        await setAltText();
    });
});
