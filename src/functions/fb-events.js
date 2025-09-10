
async function sha256Hex(value) {
  if (!value) return undefined;
  const text = value.trim().toLowerCase();
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request) {
  try {
    const body = await request.json();

    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || undefined;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: "Missing PIXEL_ID or ACCESS_TOKEN env vars" }), { status: 500 });
    }

    // Extraer cabeceras útiles
    const headers = request.headers;
    const client_ip_address =
      headers.get("cf-connecting-ip") ||
      headers.get("x-forwarded-for")?.split(",")?.[0] ||
      headers.get("x-real-ip") ||
      null;
    const client_user_agent = headers.get("user-agent") || null;
    const cookieHeader = headers.get("cookie") || "";

    // sacar _fbp y _fbc si existen
    const match = cookieHeader.match(/_fbp=([^;]+)/);
    const fbp = match ? match[1] : undefined;
    const match2 = cookieHeader.match(/_fbc=([^;]+)/);
    const fbc = match2 ? match2[1] : undefined;

    // user_data: hacemos hashing de los campos si vienen
    const userDataInput = body.user_data || {};
    const user_data = {};

    if (userDataInput.email) {
      user_data.em = await sha256Hex(userDataInput.email);
    }
    if (userDataInput.phone) {
      const digits = userDataInput.phone.replace(/\D/g, "");
      if (digits) user_data.ph = await sha256Hex(digits);
    }
    if (userDataInput.first_name) user_data.fn = await sha256Hex(userDataInput.first_name);
    if (userDataInput.last_name) user_data.ln = await sha256Hex(userDataInput.last_name);

    // añadir IP/UA/fbp/fbc sin hash (Meta espera IP y UA sin hash)
    if (client_ip_address) user_data.client_ip_address = client_ip_address;
    if (client_user_agent) user_data.client_user_agent = client_user_agent;
    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;

    // Construir el evento aceptando distintos nombres de campo
    const event = {
      event_name: body.event_name || body.eventName || "CustomEvent",
      event_time: body.event_time || Math.floor(Date.now() / 1000),
      event_id: body.event_id || undefined,             // opcional para deduplicar
      action_source: body.action_source || "website",
      event_source_url: body.event_source_url || body.eventSourceUrl || null,
      user_data: user_data,
      custom_data: body.custom_data || body.customData || {},
    };

    const payload = {
      data: [event],
      ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
    };

    const url = `https://graph.facebook.com/v17.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, error: json }), { status: res.status });
    }

    return new Response(JSON.stringify({ ok: true, meta: json }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 });
  }
}



