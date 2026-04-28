export function emitProjectEvent(projectId, eventName, payload) {
  const ioServer = globalThis.__io;
  if (!ioServer) {
    return;
  }

  ioServer.to(`project:${projectId}`).emit(eventName, payload);
}
