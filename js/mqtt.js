export function iniciarMqtt(mensajes) {
  const escenario = document.getElementById("escenario-mqtt");
  const paquete = document.getElementById("paquete");
  const texto = document.getElementById("mqtt-texto");
  const codigo = document.getElementById("mqtt-codigo");
  const botones = document.querySelectorAll("[data-mensaje]");
  if (!escenario) return;

  const centro = (nombre) => {
    const nodo = escenario.querySelector(`[data-nodo="${nombre}"]`);
    const a = escenario.getBoundingClientRect();
    const b = nodo.getBoundingClientRect();
    return { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2, nodo };
  };

  const brillar = (nodo) => {
    nodo.classList.add("brilla");
    setTimeout(() => nodo.classList.remove("brilla"), 700);
  };

  let animacion = null;

  const lineas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  lineas.classList.add("lineas-mqtt");
  escenario.prepend(lineas);
  function dibujarLineas() {
    const b = centro("broker");
    lineas.replaceChildren();
    ["nodemcu", "vision", "nodered"].forEach((n) => {
      const c = centro(n);
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", c.x);
      l.setAttribute("y1", c.y);
      l.setAttribute("x2", b.x);
      l.setAttribute("y2", b.y);
      lineas.append(l);
    });
  }
  dibujarLineas();
  window.addEventListener("resize", dibujarLineas);

  function enviar(clave) {
    const m = mensajes[clave];
    if (!m) return;
    botones.forEach((b) => b.classList.toggle("activo", b.dataset.mensaje === clave));
    const origen = centro(m.de);
    const broker = centro("broker");
    const destino = centro(m.a);
    const carga = typeof m.carga === "string" ? m.carga : JSON.stringify(m.carga);
    texto.textContent = m.texto;
    codigo.textContent = `PUBLISH\ntema:  ${m.tema}\ncarga: ${carga}`;
    if (animacion) animacion.cancel();
    brillar(origen.nodo);
    animacion = paquete.animate(
      [
        { left: `${origen.x}px`, top: `${origen.y}px`, opacity: 1, offset: 0 },
        { left: `${broker.x}px`, top: `${broker.y}px`, opacity: 1, offset: 0.45 },
        { left: `${broker.x}px`, top: `${broker.y}px`, opacity: 1, offset: 0.55 },
        { left: `${destino.x}px`, top: `${destino.y}px`, opacity: 1, offset: 0.97 },
        { left: `${destino.x}px`, top: `${destino.y}px`, opacity: 0, offset: 1 }
      ],
      { duration: 1800, easing: "ease-in-out", fill: "forwards" }
    );
    setTimeout(() => brillar(broker.nodo), 820);
    animacion.onfinish = () => brillar(destino.nodo);
  }

  botones.forEach((b) => b.addEventListener("click", () => enviar(b.dataset.mensaje)));

  const visible = () => {
    const r = escenario.getBoundingClientRect();
    return !document.hidden && r.bottom > 0 && r.top < window.innerHeight;
  };
  let auto = setInterval(() => visible() && enviar("telemetria"), 4000);
  botones.forEach((b) => b.addEventListener("click", () => {
    clearInterval(auto);
    auto = setInterval(() => visible() && enviar("telemetria"), 9000);
  }));
}
