document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los <a> con la clase trackBtn
  const buttons = document.querySelectorAll(".trackBtn");
  console.log("🔎 Botones detectados:", buttons.length);

  buttons.forEach((btn, index) => {
    console.log(`🎯 Configurando botón #${index + 1}`, btn);

    btn.addEventListener("click", (event) => {
      event.preventDefault(); // Evita que navegue antes de enviar el evento

      const eventName = btn.dataset.eventName || "InitiateCheckout";
      const eventData = btn.dataset.eventData
        ? JSON.parse(btn.dataset.eventData)
        : { value: 0, currency: "MXN" };

      console.log(`👉 Click en botón #${index + 1}`);
      console.log("📦 Datos del evento:", eventName, eventData);

      // Enviar al Pixel (frontend)
      if (typeof fbq === "function") {
        fbq("track", eventName, eventData);
      }

      // Enviar al Worker (backend)
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
});
