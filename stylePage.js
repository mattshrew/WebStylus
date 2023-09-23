document.querySelector("html").classList.toggle("AAAAAAAAAA");

test1 = document.querySelectorAll("a[href]");
// console.log(test1);
test2 = document.querySelectorAll("*");
// console.log(test2);

// var items = {};

test1.forEach((item) => {
    // console.log(item.id);
    bigColour = getComputedStyle(item).color;
    // console.log(bigColour);
    bigColour = bigColour.replace('(', '');
    bigColour = bigColour.replace(')', '');
    bigColour = bigColour.replace('rgb', '');
    bigColour = bigColour.replace('a', '');
    bigColour = bigColour.replace(/ /g, '');
    bigColour = bigColour.replace(/"/g, '');
    bigColourArr = bigColour.split(',');
    // console.log(bigColour);
    for (let i = 0; i<bigColourArr.length; i++){ // changes to integers
        bigColourArr[i] = Number(bigColourArr[i]);
    }
    if (bigColourArr[0]+bigColourArr[1]+bigColourArr[2]>=380){
        bigColour = 'rgb(0, 0, 0)';
    } else {
        bigColour = 'rgb(255, 255, 255)';
    }
    // items[item] = bigColour;
    // console.log(bigColour);
    // console.log(items);
    item.style.textDecorationLine = 'underline';
    item.style.textShadow = '1px 0px 4px '+bigColour+', 2px 0px 4px '+bigColour+', 3px 0px 4px '+bigColour+', 2px 0px 3px '+bigColour+', 2px 3px 15px '+bigColour;
})
test2.forEach((item) => {
    if (getComputedStyle(item).color){
        if (getComputedStyle(item).color!='inherit'&&getComputedStyle(item).color!='none transparent'&&getComputedStyle(item).color!='rgb(0, 0, 0)'&&getComputedStyle(item).color!='rgb(255, 255, 255)'){
            if (getComputedStyle(item).color!='white'&&getComputedStyle(item).color!='black'){
                colour = JSON.stringify(getComputedStyle(item).color);
                colour = colour.replace('(', '');
                colour = colour.replace(')', '');
                colour = colour.replace('rgb', '');
                colour = colour.replace('a', '');
                colour = colour.replace(/ /g, '');
                colour = colour.replace(/"/g, '');
                colourArr = colour.split(',');
                for (let i = 0; i<colourArr.length; i++){
                    colourArr[i] = Number(colourArr[i]);
                }
                if (colourArr.length==3){
                    item.style.color = 'rgb('+(colourArr[0]*0.5)+', '+colourArr[1]+', '+colourArr[2]+')';
                } else if (colourArr.length==4){
                    item.style.color = 'rgba('+(colourArr[0]*0.5)+', '+colourArr[1]+', '+colourArr[2]+', '+colourArr[3]+')';
                }
            }
        }
    }
    if (item.style.background){
        if (getComputedStyle(item).background!='inherit'&&getComputedStyle(item).background!='none transparent'&&getComputedStyle(item).background!='rgb(0, 0, 0)'&&getComputedStyle(item).background!='rgb(255, 255, 255)'){
            if (getComputedStyle(item).background!='white'&&getComputedStyle(item).background!='black'){
                backround = JSON.stringify(getComputedStyle(item).background);
                backround = backround.replace('(', '');
                backround = backround.replace(')', '');
                backround = backround.replace('rgb', '');
                backround = backround.replace('a', '');
                backround = backround.replace(/ /g, '');
                backround = backround.replace(/"/g, '');
                backroundArr = backround.split(',');
                for (let i = 0; i<backroundArr.length; i++){
                    backroundArr[i] = Number(backroundArr[i]);
                }
                if (backroundArr.length==3){
                    item.style.background = 'rgb('+(backroundArr[0]*0.5)+', '+backroundArr[1]+', '+backroundArr[2]+')';
                } else if (colourArr.length==4){
                    item.style.background = 'rgba('+(backroundArr[0]*0.5)+', '+backroundArr[1]+', '+backroundArr[2]+', '+backroundArr[3]+')';
                }
            }
        }
    }
    if (item.style.backgroundColor){
        if (getComputedStyle(item).backgroundColor!='inherit'&&getComputedStyle(item).backgroundColor!='none transparent'&&getComputedStyle(item).backgroundColor!='rgb(0, 0, 0)'&&getComputedStyle(item).backgroundColor!='rgb(255, 255, 255)'){
            if (getComputedStyle(item).backgroundColor!='white'&&getComputedStyle(item).backgroundColor!='black'){
                bgc = JSON.stringify(getComputedStyle(item).backgroundColor);
                bgc = bgc.replace('(', '');
                bgc = bgc.replace(')', '');
                bgc = bgc.replace('rgb', '');
                bgc = bgc.replace('a', '');
                bgc = bgc.replace(/ /g, '');
                bgc = bgc.replace(/"/g, '');
                bgcArr = bgc.split(',');
                for (let i = 0; i<bgcArr.length; i++){
                    bgcArr[i] = Number(bgcArr[i]);
                }
                if (bgcArr.length==3){
                    item.style.backgroundColor = 'rgb('+(bgcArr[0]*0.5)+', '+bgcArr[1]+', '+bgcArr[2]+')';
                } else if (colourArr.length==4){
                    item.style.backgroundColor = 'rgba('+(bgcArr[0]*0.5)+', '+bgcArr[1]+', '+bgcArr[2]+', '+bgcArr[3]+')';
                }
            }
        }
    }
});
