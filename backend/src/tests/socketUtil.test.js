const { Server } = require('socket.io');
const { initializeSocket, getSocketIO } = require('../utils/socketUtil');

jest.mock('socket.io');

describe('socketUtil', () => {
    let serverMock;
    let socketMock;

    beforeEach(() => {
        serverMock = {
            on: jest.fn(),
            emit: jest.fn()
        };
        socketMock = {
            on: jest.fn(),
            emit: jest.fn()
        };
        Server.mockImplementation(() => serverMock);
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initializeSocket', () => {
        it('should initialize the socket server', () => {
            const httpServerMock = {};
            initializeSocket(httpServerMock);

            expect(Server).toHaveBeenCalledWith(httpServerMock, {
                cors: {
                    origin: process.env.FRONTEND_URL,
                    methods: ['GET', 'POST']
                }
            });
            expect(serverMock.on).toHaveBeenCalledWith('connection', expect.any(Function));
        });

        it('should handle connection and disconnection events', () => {
            const httpServerMock = {};
            initializeSocket(httpServerMock);

            const connectionCallback = serverMock.on.mock.calls[0][1];
            connectionCallback(socketMock);

            expect(socketMock.on).toHaveBeenCalledWith('disconnect', expect.any(Function));

            const disconnectCallback = socketMock.on.mock.calls[0][1];
            disconnectCallback();

        });

        it('should emit custom events', () => {
            const httpServerMock = {};
            initializeSocket(httpServerMock);

            const connectionCallback = serverMock.on.mock.calls[0][1];
            connectionCallback(socketMock);

            socketMock.emit('custom-event', { data: 'test' });

            expect(socketMock.emit).toHaveBeenCalledWith('custom-event', { data: 'test' });
        });
    });

    describe('getSocketIO', () => {
        it('should return the initialized socket server', () => {
            const httpServerMock = {};
            initializeSocket(httpServerMock);

            const io = getSocketIO();
            expect(io).toBe(serverMock);
        });

        it('should throw an error if socket server is not initialized', () => {
            expect(() => getSocketIO()).toThrow('Socket.io not initialized');
        });
    });
});