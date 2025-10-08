document.querySelectorAll(".trackBtn").forEach((btn, index) => {
  btn.addEventListener("click", async (event) => {
    event.preventDefault();

    const eventName = btn.dataset.eventName || "InitiateCheckout";
    const eventData = btn.dataset.eventData ? JSON.parse(btn.dataset.eventData) : { value: 0, currency: "MXN" };

    // Extraer cookies de Meta Pixel
    const cookieHeader = document.cookie;
    const fbp = (cookieHeader.match(/_fbp=([^;]+)/) || [])[1];
    const fbc = (cookieHeader.match(/_fbc=([^;]+)/) || [])[1];

    // ✅ Generar un solo event_id por click
    const eventId = crypto.randomUUID();

    console.log(`👉 Click en botón #${index + 1}`);
    console.log("📦 Datos del evento:", eventName, eventData);
    console.log("🧩 Cookies detectadas:", { fbp, fbc });
    console.log("🔑 Event ID único:", eventId);

    // Pixel frontend
    if (typeof fbq === "function") {
      fbq("track", eventName, eventData, { eventID: eventId });
    }

    // Worker backend usando fetch
    try {
      const payload = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        custom_data: eventData,
        event_id: eventId, // usar el mismo ID
        fbp,
        fbc,
        client_user_agent: navigator.userAgent,
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
