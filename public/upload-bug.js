// Target the exact ID matching your BugHunter HTML form layout structure
const form = document.getElementById("bugForm");
const formMessageText = document.querySelector(".form-message");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const details = document.getElementById("details").value.trim();
    const location = document.getElementById("location").value.trim();
    const severity = document.getElementById("severity").value;

    if (!title || !details || !location) {
      if (formMessageText)
        formMessageText.textContent = "Please complete all mandatory fields!";
      return;
    }

    // Generate accurate, live timestamps directly on submission
    const date = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const readableDate = date.toLocaleString("en-GB", options);

    // Consolidated payload schema mapping accurately to index.js layout template properties
    const formData = {
      title: title,
      details: details,
      location: location,
      severity: severity,
      timeStamp: readableDate,
    };

    try {
      if (formMessageText) formMessageText.textContent = "Uploading ticket...";

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        if (formMessageText) {
          formMessageText.innerHTML = `Your bug report was logged. View it <a href="/bugs.html">here</a>.`;
        }
        form.reset();
      } else {
        if (formMessageText)
          formMessageText.textContent =
            "The server rejected the log request. Please retry.";
        console.error("Server Error:", response.statusText);
      }
    } catch (error) {
      if (formMessageText)
        formMessageText.textContent =
          "Network error. Unable to contact log engine.";
      console.error("Log Connection Failure:", error);
    }
  });
}
