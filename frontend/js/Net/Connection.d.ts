declare module Connection {
  function sendMessage(eventName, data): any;
  function broadCast(eventName, data): any;
}

