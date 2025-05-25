import io from "socket.io-client";

let socket;

export const getSocketIO = () => {
    if (!socket) {
        socket = io(import.meta.env.REACT_APP_SOCKET_URL || "http://localhost:5001");
    }
    return socket;
};