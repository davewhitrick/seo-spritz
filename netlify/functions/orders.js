// Returns all saved orders. Used by the menu (for the live tally) and by
// the passcode-protected bar view (for the full list).
import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("orders");
  const { blobs } = await store.list();

  const orders = [];
  for (const b of blobs) {
    const o = await store.get(b.key, { type: "json" });
    if (o) orders.push(o);
  }
  orders.sort((a, b) => new Date(a.at) - new Date(b.at));

  return new Response(JSON.stringify({ orders }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { path: "/api/orders" };
