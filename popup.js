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

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentTab = tabs[0];
    var tabId = currentTab.id;
  
    const css = 'html { filter: invert(1) hue-rotate(180deg); }';

    chrome.scripting.insertCSS({
        target: { tabId },
        css: css
    });
});


document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        var tabId = currentTab.id;

        chrome.scripting.executeScript(
            {
                target: { tabId },
                function: stylePage,
                args: [ isToggled() ]
            },
            function (result) {
                console.log("Result:", result);
                if (!chrome.runtime.lastError) {
                    console.log(result);
                } else {
                    console.error('Error executing script:', chrome.runtime.lastError);
                }
            }
        );
    });
});

function isToggled() {
    return true; // for now
}

function stylePage(toggle) {
    console.log(toggle);
    if (toggle) {
        document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg);";
        let media = document.querySelectorAll("img, picture, video");
        console.log(media);
        media.forEach((mediaItem) => { 
            console.log(mediaItem);
            mediaItem.style.filter = "invert(1) hue-rotate(180deg) !important;"; 
        });
    }
    else {
        document.querySelector("html").style.filter = "invert(0) hue-rotate(0deg);";
    }
    return true;
}