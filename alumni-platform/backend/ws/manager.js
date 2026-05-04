const clients = new Map(); // userId -> Set<WebSocket>

function registerWsClient(userId, ws) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(ws);
}
function removeWsClient(userId, ws) {
  if (clients.has(userId)) {
    clients.get(userId).delete(ws);
    if (clients.get(userId).size === 0) clients.delete(userId);
  }
}
function sendToUser(userId, payload) {
  const set = clients.get(userId);
  if (!set) return;
  const data = JSON.stringify(payload);
  for (const ws of set) {
    if (ws.readyState === 1) ws.send(data);
  }
}
module.exports = { registerWsClient, removeWsClient, sendToUser };
