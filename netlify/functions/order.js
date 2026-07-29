// Saves a single order to a shared Netlify Blobs store.
// No account or config needed: Blobs is built into Netlify.
import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let order;
  try {
    order = await req.json();
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const clean = {
    name: (order.name || "Someone").toString().slice(0, 60),
    drink: (order.drink || "a drink").toString().slice(0, 80),
    drinkId: (order.drinkId || "").toString().slice(0, 40),
    at: new Date().toISOString()
  };

  const store = getStore("orders");
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await store.setJSON(key, clean);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/order" };
