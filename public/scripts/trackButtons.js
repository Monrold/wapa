document.querySelectorAll(".trackBtn").forEach((btn, index) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();

    const eventName = btn.dataset.eventName || "InitiateCheckout";
    const eventData = btn.dataset.eventData ? JSON.parse(btn.dataset.eventData) : { value: 0, currency: "MXN" };

    console.log(`👉 Click en botón #${index + 1}`);
    console.log("📦 Datos del evento:", eventName, eventData);

    // Pixel frontend
    if (typeof fbq === "function") {
      fbq("track", eventName, eventData);
    }

    // Worker backend
    const payload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      custom_data: eventData,
      event_id: crypto.randomUUID(),
    };
    navigator.sendBeacon("https://metaevents.soporte-draw.workers.dev", JSON.stringify(payload));

    // Abrir enlace
    window.open(btn.href, "_blank", "noopener,noreferrer");
  });
});
