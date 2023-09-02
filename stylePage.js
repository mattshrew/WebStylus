document.querySelector("html").style.filter = "invert(1) hue-rotate(180deg)";
console.log(document.querySelector("html"));
document.querySelector("html").classList.toggle("AAAAAAAAAA");
mediaa = document.querySelectorAll("img, picture, video");
mediaa.forEach((mediaItem) => {
    mediaItem.style.filter = "invert(1) hue-rotate(180deg)";
})
console.log(mediaa);


test = document.querySelectorAll("a[href]");
console.log(test);

test2 = document.querySelectorAll("[style*=color]");
console.log(test2);
test2.forEach((item) => {
    item.style.color = "#fff";
    console.log(item.style.color);
});
// test2 half works idk

test3 = document.querySelectorAll("*"); // .filter()
// color, background-color, backround: (some colour)