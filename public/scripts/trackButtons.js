document.querySelectorAll(".trackBtn").forEach((btn, index) => {
  btn.addEventListener("click", async (event) => {
    event.preventDefault();

    const eventName = btn.dataset.eventName || "InitiateCheckout";
    const eventData = btn.dataset.eventData ? JSON.parse(btn.dataset.eventData) : { value: 0, currency: "MXN" };

    console.log(`👉 Click en botón #${index + 1}`);
    console.log("📦 Datos del evento:", eventName, eventData);

    // Pixel frontend
    if (typeof fbq === "function") {
      fbq("track", eventName, eventData);
    }

    // Worker backend usando fetch
    try {
      const payload = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: eventData,
        event_id: crypto.randomUUID(),
      };
      const res = await fetch("https://metaevents.soporte-draw.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log("✅ Evento enviado al Worker:", json);
    } catch (err) {
      console.error("❌ Error enviando evento al Worker:", err);
    }

    // Abrir enlace después de enviar el evento
    window.open(btn.href, "_blank", "noopener,noreferrer");
  });
});
