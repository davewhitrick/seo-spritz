// Deletes all saved orders from the shared Netlify Blobs store.
// Called by the bar view's "Clear all orders" button (behind the passcode).
import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore("orders");
  const { blobs } = await store.list();
  for (const b of blobs) {
    await store.delete(b.key);
  }

  return new Response(JSON.stringify({ ok: true, cleared: blobs.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/clear" };
