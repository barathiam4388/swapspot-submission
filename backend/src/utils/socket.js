let ioInstance = null;

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const getSocketServer = () => ioInstance;

export const emitEvent = (eventName, payload) => {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
};

export const emitToUser = (userId, eventName, payload) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(eventName, payload);
  }
};
