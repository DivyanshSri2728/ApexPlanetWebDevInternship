const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌗 Dark Mode";
});


const images = document.querySelectorAll(".carousel-image");
const dots = document.querySelectorAll(".dot");
let index = 0;

function showSlide(i) {
  images.forEach((img, idx) => {
    img.classList.toggle("active", idx === i);
    dots[idx].classList.toggle("active", idx === i);
  });
}

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % images.length;
  showSlide(index);
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + images.length) % images.length;
  showSlide(index);
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
});


setInterval(() => {
  index = (index + 1) % images.length;
  showSlide(index);
}, 4000);


const jokeBtn = document.getElementById("joke-btn");
const jokeText = document.getElementById("joke");

async function getJoke() {
  jokeText.textContent = "Loading joke...";
  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await response.json();
    jokeText.textContent = `${data.setup} 😂 ${data.punchline}`;
  } catch (error) {
    jokeText.textContent = "Failed to load joke. Try again!";
  }
}

jokeBtn.addEventListener("click", getJoke);
