document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los <a> con la clase trackBtn
  const buttons = document.querySelectorAll(".trackBtn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const eventName = btn.dataset.eventName || "InitiateCheckout";
      const eventData = btn.dataset.eventData
        ? JSON.parse(btn.dataset.eventData)
        : { value: 0, currency: "MXN" };

      // Envía evento a Meta Pixel
      if (typeof fbq === "function") {
        fbq("track", eventName, eventData);
      }

      console.log("Evento enviado:", eventName, eventData);
    });
  });
});
