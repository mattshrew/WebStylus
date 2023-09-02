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

// belo is good

// const modes = ["darkMode", "nightMode"];

// document.addEventListener('DOMContentLoaded', async function () {
//     await setStyles();
// });

// async function setStyles() {
//     chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//         var currentTab = tabs[0];
//         var tabId = currentTab.id;
//         const states = await getStates();
//         const result = await getStyles(states);
//         console.log("Result:", result);
//         if (!chrome.runtime.lastError) {
//             await chrome.scripting.insertCSS({
//                 target: { tabId },
//                 css: result
//             });
//         } else {
//             console.error('Error executing script:', chrome.runtime.lastError);
//         }
//     });
// }

// async function getStates() {
//     console.log(localStorage)
//     let states = {
//         "dark": (localStorage.getItem("darkMode") == "null") ? 0.0 : 1.0,
//         "night": (localStorage.getItem("nightMode") == "null") ? 0.0 : 1.0,
//         "grayscale": 0.0, // 0 to 1
//         "contrast": 1.0, // 0 to 2 (default is 1)
//         "protanopia": 0.0, // red-green or red = gray
//         "deuteranopia": 0.0, // red-green
//         "tritanopia": 0.0 // blue = gray
//     }
//     return states; // for now
// }

// async function getStyles(states) {
//     let css = [];
    
//     if (states.protanopia) {
//         css.concat([
//             ""
//         ]);
//     } else {
//         css.concat([
//             ""
//         ]);
//     }

//     if (states.deuteranopia) {
//         css.concat([
//             ""
//         ]);
//     } else {
//         css.concat([
//             ""
//         ]);
//     }

//     if (states.tritanopia) {
//         css.concat([
//             ""
//         ]);
//     } else {
//         css.concat([
//             ""
//         ]);
//     }

//     css = [
//         `html { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) grayscale(${100*states.grayscale}%) contrast(${100*states.contrast}%) !important; }`,
//         `img, picture, video { filter: invert(${states.dark}) hue-rotate(${180*states.dark}deg) grayscale(0%) contrast(100%) !important; }`,
//     ];

//     if (states.night) css.push("html::before { display: block; background: #ffffab; mix-blend-mode: multiply; content: ' '; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 999; }");
//     else css.push("html::before { display: none; }");

//     let res = css.join(' ')
//     return res;
// }




// // JS For Frontend

// let darkMode = localStorage.getItem("darkMode");
// let nightMode = localStorage.getItem("nightMode");
// let highContrast = localStorage.getItem("highContrast");

// const darkModeToggle = document.querySelector('.darkMode-button');
// const nightModeToggle = document.querySelector('.nightMode-button');
// const hightContrastToggle = document.querySelector('.high-contrast-button');
// const body = document.querySelector('body');

// async function toggleMode(mode, bool) {
//     if (bool) body.classList.add(mode);
//     else body.classList.remove(mode);
//     localStorage.setItem(mode, (bool) ? "enabled" : "null");
// }

// for (const mode of modes) {
//     if (localStorage.getItem(mode) != "null") {
//         toggleMode(mode, true);
//     }
// }

// // Add click listeners
// document.querySelectorAll(".toggle").forEach((toggle, i) => {
//     toggle.addEventListener('click', async () => {
//         await toggleMode(modes[i], !body.classList.contains(modes[i]));
//        await setStyles();
//     });
// });

// testing....
document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        var tabId = currentTab.id;

        chrome.scripting.executeScript(
            {
                target: { tabId: tabId },
                files: ["stylePage.js"],
            },
            function (result) {
                console.log("Result:", result);
                if (!chrome.runtime.lastError) {                    
                    // do smt
                } else {
                    console.error('Error executing script:', chrome.runtime.lastError);
                }
            }
        );
    });
});