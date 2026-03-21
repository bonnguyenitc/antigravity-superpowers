---
name: real-time-features
description: Use when implementing WebSockets, Server-Sent Events (SSE), live collaboration, presence indicators, real-time notifications, or choosing between real-time transport options
---

# Real-Time Features Lens

> **Philosophy:** Real-time is expensive infrastructure. Use it only where it's perceptibly better than polling.
> The cheapest real-time solution is a fast refresh interval with good UX.

---

## Core Instincts

- **Start with polling** — 5-second polling covers 90% of "live" use cases with zero infra complexity
- **SSE before WebSockets** — SSE is simpler, HTTP/2-compatible, easy to scale; use WebSockets only for bidirectional needs
- **Connection lifecycle is state** — track connect/disconnect, handle reconnects, never assume connection is alive
- **Scale out = sticky sessions or pub/sub** — WebSockets break horizontal scaling without Redis Pub/Sub or a broker
- **Real-time is optional** — always design a fallback (last-write-wins, reconciliation on reconnect)

---

## Technology Selection

```
Which real-time tech to use?

Need bidirectional (client AND server send)?
├── YES → WebSocket
│         (chat, collaborative editing, gaming, live cursors)
└── NO → Server-Sent Events (SSE) or Polling
          │
          └── Data changes frequently + immediate delivery matters?
              ├── YES → SSE
              │         (live notifications, dashboards, feeds)
              └── NO → Long polling or periodic polling
                        (< 5 changes/min: just poll every 5s)
```

---

## Technology Comparison

| Feature | Polling | SSE | WebSocket |
|---------|---------|-----|-----------|
| Complexity | ⭐ Low | ⭐⭐ Medium | ⭐⭐⭐ High |
| Bidirectional | ❌ | ❌ | ✅ |
| HTTP/2 compatible | ✅ | ✅ | ❌ |
| Horizontal scaling | ✅ Easy | ⚠️ Sticky sessions | ⚠️ Redis Pub/Sub needed |
| Firewall / proxy friendly | ✅ | ✅ | ⚠️ Sometimes blocked |
| Browser reconnect | N/A | ✅ Automatic (EventSource) | Manual |
| Use case | Dashboards, status | Notifications, feeds | Chat, collab |

---

## SSE Implementation Pattern

```javascript
// Server (Node.js / Express)
app.get('/events', (req, res) => {
  // Auth first!
  if (!req.user) return res.sendStatus(401);

  res.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection':    'keep-alive',
  });

  // Send keepalive every 15s (prevents proxy timeout at 30s)
  const keepalive = setInterval(() => res.write(': keepalive\n\n'), 15000);

  // Register client
  clients.set(req.user.id, res);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(keepalive);
    clients.delete(req.user.id);
  });
});

// Push to client
function pushToUser(userId, event, data) {
  const client = clients.get(userId);
  if (client) client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
```

---

## WebSocket Scaling Pattern

```
Single server: Direct WebSocket connection works fine
Multi-server:  Client connects to Server A, event fires on Server B
               → Server B can't reach Server A's client
               → Solution: Redis Pub/Sub

Architecture:
  [Client] ←WS→ [Server A] ←→ [Redis Pub/Sub] ←→ [Server B] ←WS→ [Client]

Server publishes to Redis channel:
  await redis.publish(`user:${userId}`, JSON.stringify(event))

Server subscribes on connect:
  await redis.subscribe(`user:${userId}`, (message) => {
    ws.send(message)
  })
```

---

## Reconnection & State Reconciliation

```javascript
// Client-side: always implement reconnect with backoff
const MAX_RETRIES = 5;
let retries = 0;

function connect() {
  const ws = new WebSocket(url);
  
  ws.onopen = () => { retries = 0; };
  
  ws.onclose = () => {
    if (retries < MAX_RETRIES) {
      setTimeout(connect, Math.min(1000 * 2 ** retries, 30000));
      retries++;
    }
  };
}

// Server-side: on reconnect, send missed events since lastEventId
// SSE: browser sends Last-Event-ID header automatically
// WebSocket: client sends lastEventId on connect message
```

---

## ❌ Anti-Patterns to Avoid

| ❌ NEVER DO | Why | ✅ DO INSTEAD |
|------------|-----|--------------|
| WebSocket for unidirectional updates | SSE is simpler for same use case | Use SSE for server→client only |
| In-memory client registry | Breaks on horizontal scale | Redis Pub/Sub for multi-instance |
| No keepalive messages | Proxy kills idle connections at 30–60s | Send `: keepalive` every 15s |
| No reconnect logic on client | Single network hiccup = broken UI | Exponential backoff reconnect |
| Auth skipped on WebSocket handshake | WS connections are permanent — auth must be first | Auth during HTTP upgrade (before WS established) |
| Sending all state on every event | Expensive; clients drift on missed events | Send diffs; reconcile on reconnect |

---

## Questions You Always Ask

**When choosing real-time:**
- Does this require bidirectional communication, or is server→client enough?
- Would polling every 5–10 seconds give acceptable UX?
- How many concurrent connections do we expect at peak? (Connection limit planning)

**When implementing:**
- Is there auth on the WebSocket handshake/SSE endpoint?
- Is there a keepalive to prevent proxy timeouts?
- What's the reconnection strategy on the client?
- How is this scaled across multiple server instances?

---

## Red Flags

**Must fix:**
- [ ] No auth on WebSocket / SSE endpoint
- [ ] In-memory client registry on multi-instance deployment
- [ ] No keepalive (proxy will terminate idle connections)

**Should fix:**
- [ ] No reconnect logic on client
- [ ] WebSocket used where SSE would suffice
- [ ] No strategy for clients that miss events while disconnected

---

## Who to Pair With
- `backend-developer` — for server architecture and Redis Pub/Sub
- `frontend-developer` — for client-side connection management
- `devops-engineer` — for WebSocket-aware load balancer config

---

## Tools
**Managed:** Supabase Realtime · Pusher · Ably · Liveblocks (collaboration)  
**Self-hosted:** Socket.IO (WebSocket + SSE fallback) · ws (raw WebSocket)  
**Browser:** `EventSource` (SSE, built-in) · `WebSocket` (built-in)  
**Scaling:** Upstash Redis · Redis with ioredis
