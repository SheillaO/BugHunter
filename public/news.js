const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://bughunter-7v7f.onrender.com";

const eventSource = new EventSource(`${API_BASE}/api/news`);
const liveContainer = document.getElementById("live-container");

eventSource.onmessage = (event) => {
  if (!liveContainer) return;
  const data = JSON.parse(event.data);
  const feedUpdate = data.story || data.message || "New bug activity tracked.";
  liveContainer.textContent = feedUpdate;
};

eventSource.onerror = () => {
  console.warn("Telemetry connection lost. Attempting auto-reconnection...");
};
