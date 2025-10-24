const keys = document.querySelectorAll(".keyboard li");

function getRandomNumber(min, max) {
  // return an integer between min and max (inclusive)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomKey() {
  if (!keys || keys.length === 0) return null;
  return keys[getRandomNumber(0, keys.length - 1)];
}

function targetRandomKey() {
  const key = getRandomKey();
  if (!key) return;
  key.classList.add("selected");
}

document.addEventListener("keydown", (e) => {
  const keyPressed = e.key ? e.key.toUpperCase() : "";
  const keyElement = document.getElementById(keyPressed);
  const highlightedKey = document.querySelector(".selected");

  if (!keyElement) return; // nothing to animate

  keyElement.classList.add("hit");
  keyElement.addEventListener(
    "animationend",
    () => {
      keyElement.classList.remove("hit");
    },
    { once: true }
  );

  if (!highlightedKey) return;

  // compare normalized content
  const highlightedText = (
    highlightedKey.textContent ||
    highlightedKey.innerText ||
    ""
  )
    .trim()
    .toUpperCase();
  if (keyPressed === highlightedText) {
    highlightedKey.classList.remove("selected");
    // some special keys may need additional handling, keep safe
    if (keyPressed === "CAPSLOCK" || keyPressed === "BACKSPACE") {
      keyElement.classList.remove("selected");
    }
    targetRandomKey();
  }
});

targetRandomKey();
