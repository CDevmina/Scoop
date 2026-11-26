import io from "socket.io-client";
import { API_BASE_URL } from "./apiService";

let socket;

export const getSocketIO = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL || API_BASE_URL);
    }
    return socket;
};