// 1. Initialize environment routing base immediately
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://bughunter-7v7f.onrender.com";

// 2. Establish Server-Sent Events (SSE) telemetry connection loop
const eventSource = new EventSource(`${API_BASE}/api/news`);
const liveContainer = document.getElementById("live-container");

// 3. Handle live debugging feed tickers incoming from backend engines
eventSource.onmessage = (event) => {
  if (!liveContainer) return;
  const data = JSON.parse(event.data);
  const feedUpdate = data.story || data.message || "New bug activity tracked.";
  liveContainer.textContent = feedUpdate;
};

// 4. Handle tracking network dropped links safely
eventSource.onerror = () => {
  console.warn("Telemetry connection lost. Attempting auto-reconnection...");
};
