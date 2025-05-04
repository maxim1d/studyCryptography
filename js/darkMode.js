let styleMode = localStorage.getItem("styleMode");
console.log(styleMode);
const body = document.getElementById("body");

document.getElementById("dark-mode").addEventListener("click", () => {
    styleMode = localStorage.getItem("styleMode");
    if (styleMode !== "dark") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    body.classList.add("dark-mode");
    localStorage.setItem("styleMode", "dark");
}
function disableDarkMode() {
    body.classList.remove("dark-mode");
    localStorage.setItem("styleMode", null);
}

if (styleMode === "dark") {
    enableDarkMode();
}

