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


document.addEventListener('DOMContentLoaded', async function () {
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
});

async function getStates() {
    let states = {
        "dark": 0.0,
        "night": 1.0,
        "grayscale": 1.0, // 0 to 1
        "contrast": 1.0, // 0 to 2 (default is 1)
        "protanopia": 0.0, // red-green or red = gray
        "deuteranopia": 0.0, // red-green
        "tritanopia": 0.0 // blue = gray
    }
    return states; // for now
}

async function getStyles(states) {
    let css = []
    
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
        `html { filter: invert(${states.dark}) hue-rotate(${180*states.dark}) grayscale(${100*states.grayscale}%) contrast(${100*states.contrast}%) }`,
        `img, picture, video { filter: invert(${states.dark}) hue-rotate(${180*states.dark}) grayscale(0%) contrast(0%) }`,
    ];

    if (states.night) css.push("html::before { background: #ffffab; mix-blend-mode: multiply; content: ' '; position: fixed; top: 0; left: 0; width: 100%; height: 999vh; pointer-events: none; z-index: 999; }");
    else css.push("html::before { display: none; }");

    let res = css.join(' ')
    return res;
}




// JS For Frontend

let darkMode = localStorage.getItem("darkMode");
let nightMode = localStorage.getItem("nightMode");
let highContrast = localStorage.getItem("highContrast");

const darkModeToggle = document.querySelector('.dark-mode-button');
const nightModeToggle = document.querySelector('.night-mode-button');
const hightContrastToggle = document.querySelector('.high-contrast-button');
const body = document.querySelector('body');

 // Enable Dark Mode
const enableDarkMode = () => {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled")
 }
 // Disable Dark Mode
 const disableDarkMode = () => {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", null)
}

// Enable Night Mode
const enableNightMode = () => {
    body.classList.add("night-mode");
    localStorage.setItem("nightMode", "enabled")
 }
 // Disable Night Mode
 const disableNightMode = () => {
    body.classList.remove("night-mode");
    localStorage.setItem("nightMode", null)
}

// Enable High Contrast
const enableHighContrast = () => {
    body.classList.add("high-contrast");
    localStorage.setItem("highContrast", "enabled")
 }
 // Disable High Contrast
 const disableHighContrast = () => {
    body.classList.remove("high-contrast");
    localStorage.setItem("highContrast", null)
}

// Check previous settings
if (darkMode == "enabled") {
    enableDarkMode();
}
if (nightMode == "enabled") {
    enableNightMode();
}
if (highContrast == "enabled") {
    enableHighContrast();
}

// Add click listeners
darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem("darkMode");
    if (darkMode !== "enabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
})
nightModeToggle.addEventListener('click', () => {
    nightMode = localStorage.getItem("nightMode");
    if (nightMode !== "enabled") {
        enableNightMode();
    } else {
        disableNightMode();
    }
})
hightContrastToggle.addEventListener('click', () => {
    highContrast = localStorage.getItem("highContrast");
    if (highContrast !== "enabled") {
        enableHighContrast();
    } else {
        disableHighContrast();
    }
})