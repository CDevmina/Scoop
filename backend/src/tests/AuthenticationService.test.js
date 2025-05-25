const { getDB } = require('../utils/mongoUtil');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../service/AuthenticationService');

jest.mock('../utils/mongoUtil');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let dbMock;

  beforeAll(() => {
    dbMock = {
      collection: jest.fn().mockReturnThis(),
      findOne: jest.fn(),
      insertOne: jest.fn()
    };
    getDB.mockReturnValue(dbMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authLoginPOST', () => {
    it('should login a user and return a token', async () => {
      const user = { _id: '60f1b7e7c50b02b4c8cfc047', email: 'test@example.com', password: 'hashedPassword', isAdmin: false };
      dbMock.findOne.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await AuthService.authLoginPOST({ email: 'test@example.com', password: 'password' });
      expect(result).toEqual({ token: 'token' });
      expect(dbMock.collection).toHaveBeenCalledWith('users');
      expect(dbMock.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcryptjs.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: user._id, isAdmin: user.isAdmin }, expect.any(String), { expiresIn: '1h' });
    });

    it('should throw an error if user not found', async () => {
      dbMock.findOne.mockResolvedValue(null);

      await expect(AuthService.authLoginPOST({ email: 'test@example.com', password: 'password' })).rejects.toThrow('User not found');
    });

    it('should throw an error if password is invalid', async () => {
      const user = { _id: '60f1b7e7c50b02b4c8cfc047', email: 'test@example.com', password: 'hashedPassword', isAdmin: false };
      dbMock.findOne.mockResolvedValue(user);
      bcryptjs.compare.mockResolvedValue(false);

      await expect(AuthService.authLoginPOST({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Invalid password');
    });

    it('should throw an error if login fails', async () => {
      dbMock.findOne.mockRejectedValue(new Error('Fetch error'));

      await expect(AuthService.authLoginPOST({ email: 'test@example.com', password: 'password' })).rejects.toThrow('Fetch error');
    });
  });

  describe('authRegisterPOST', () => {
    it('should register a new user', async () => {
      const user = { name: 'John Doe', email: 'test@example.com', password: 'password', phone: '1234567890', isAdmin: false };
      dbMock.findOne.mockResolvedValue(null);
      bcryptjs.hash.mockResolvedValue('hashedPassword');
      dbMock.insertOne.mockResolvedValue({ insertedId: '60f1b7e7c50b02b4c8cfc047' });

      const result = await AuthService.authRegisterPOST(user);
      expect(result).toEqual({ message: 'User registered successfully' });
      expect(dbMock.collection).toHaveBeenCalledWith('users');
      expect(dbMock.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(bcryptjs.hash).toHaveBeenCalledWith('password', 10);
      expect(dbMock.insertOne).toHaveBeenCalledWith({ ...user, password: 'hashedPassword' });
    });

    it('should throw an error if user already exists', async () => {
      dbMock.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(AuthService.authRegisterPOST({ email: 'test@example.com' })).rejects.toThrow('User already exists');
    });

    it('should throw an error if registration fails', async () => {
      dbMock.findOne.mockResolvedValue(null);
      bcryptjs.hash.mockResolvedValue('hashedPassword');
      dbMock.insertOne.mockRejectedValue(new Error('Insert error'));

      await expect(AuthService.authRegisterPOST({ name: 'John Doe', email: 'test@example.com', password: 'password', phone: '1234567890' })).rejects.toThrow('Insert error');
    });
  });
});