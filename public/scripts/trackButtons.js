document.addEventListener("DOMContentLoaded", () => {
  console.log("🔎 Iniciando tracking de botones...");

  function attachTrackButtons() {
    const buttons = document.querySelectorAll(".trackBtn");
    console.log("🔎 Botones detectados:", buttons.length);

    buttons.forEach((btn, index) => {
      if (btn.dataset.listenerAttached === "true") return; // evita duplicar listeners
      btn.dataset.listenerAttached = "true";

      console.log(`🎯 Configurando botón #${index + 1}`, btn);

      btn.addEventListener("click", (event) => {
        event.preventDefault(); // evita navegación inmediata

        // Parsear datos del evento
        let eventData = { value: 0, currency: "MXN" };
        try {
          eventData = btn.dataset.eventData ? JSON.parse(btn.dataset.eventData) : eventData;
        } catch (err) {
          console.warn("⚠️ Error al parsear eventData:", btn.dataset.eventData);
        }

        const eventName = btn.dataset.eventName || "InitiateCheckout";

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

        try {
          navigator.sendBeacon(
            "https://metaevents.soporte-draw.workers.dev",
            JSON.stringify(payload)
          );
          console.log("✅ Evento enviado al Worker", payload);
        } catch (err) {
          console.error("❌ Error al enviar evento:", err);
        }

        // Abrir el enlace en nueva pestaña
        window.open(btn.href, "_blank", "noopener,noreferrer");
      });
    });
  }

  // Inicial
  attachTrackButtons();

  // Observador para botones agregados dinámicamente
  new MutationObserver(attachTrackButtons).observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("✅ Listeners asignados a todos los botones trackBtn");
});
