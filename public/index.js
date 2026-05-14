// 1. Initialize environment routing base immediately with your full schema prefix
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://bughunter-7v7f.onrender.com";

// 2. Fetch bug listings from your live Render data pipeline
async function loadBugs() {
  try {
    const data = await fetch(`${API_BASE}/api`);
    const response = await data.json();
    renderCards(response);
  } catch (err) {
    console.error("Failed to load active bug reports:", err);
  }
}

function renderCards(cardsData) {
  const container = document.querySelector(".cards-container");
  if (!container) return;

  let cardsHTML = "";

  cardsData.forEach((card, i) => {
    const severityClass = card.severity
      ? `severity-${card.severity.toLowerCase()}`
      : "severity-low";

    cardsHTML += `
<article class="bug-card" aria-labelledby="bug-title-${i}">
  <p class="card-details">
    <span>${card.timeStamp}</span> | 
    <span>${card.location}</span> | 
    <span class="${severityClass}">Priority: ${card.severity || "Low"}</span>
  </p>
  <h3 id="bug-title-${i}">${card.title}</h3>
  <div class="bug-text-wrapper">
    <p class="bug-text">${card.details|| "No description provided."}</p>
  </div>
  <button class="read-more-btn" aria-expanded="false">Read in full</button>
</article>
  `;
  });

  container.innerHTML = cardsHTML;
}

// 3. Run data download function on initialization
loadBugs();

// 4. Delegate show more / show less click mechanics safely
document.querySelector(".cards-container")?.addEventListener("click", (e) => {
  if (!e.target.classList.contains("read-more-btn")) return;

  const button = e.target;
  const bugCard = button.closest(".bug-card");
  const isExpanded = bugCard.classList.toggle("expanded");

  button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  button.textContent = isExpanded ? "Show less" : "Read in full";
});
