const eventSource = new EventSource("/api/news");
const liveContainer = document.getElementById("live-container");

// Handle live debugging feed tickers incoming from backend engines
eventSource.onmessage = (event) => {
  if (!liveContainer) return;
  const data = JSON.parse(event.data);
  // Extracted stream parameters updated to reflect platforms feeds cleanly
  const feedUpdate = data.story || data.message || "New bug activity tracked.";
  liveContainer.textContent = feedUpdate;
};

// Handle tracking network dropped links safely
eventSource.onerror = () => {
  console.warn("Telemetry connection lost. Attempting auto-reconnection...");
};

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://bughunter-7v7f.onrender.com";