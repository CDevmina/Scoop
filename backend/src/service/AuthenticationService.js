'use strict';

const { getDB } = require('../utils/mongoUtil');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

/**
 * Login a user
 *
 * body UserLogin 
 * no response value expected for this operation
 **/
exports.authLoginPOST = async function (body) {
  const db = getDB();
  const { email, password } = body;

  try {
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
    return { token };
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Register a new user
 *
 * body UserRegister 
 * no response value expected for this operation
 **/
exports.authRegisterPOST = async function (body) {
  const db = getDB();
  const { firstName, lastName, email, password, phone, isAdmin = false } = body;

  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      isAdmin
    };

    await db.collection('users').insertOne(newUser);
    return { message: 'User registered successfully' };
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Update user password
 *
 * userId String ID of the user
 * body Object containing oldPassword and newPassword
 * no response value expected for this operation
 **/
exports.updatePassword = async function (userId, body) {
  const db = getDB();
  const { oldPassword, newPassword } = body;

  try {
    const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(userId) });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    await db.collection('users').updateOne({ _id: ObjectId.createFromHexString(userId) }, { $set: { password: hashedNewPassword } });

    return { message: 'Password updated successfully' };
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Get user details
 *
 * userId String ID of the user
 * returns UserDetails
 **/
exports.getUserDetails = async function (userId) {
  const db = getDB();

  try {
    const user = await db.collection('users').findOne(
      { _id: ObjectId.createFromHexString(userId) },
      { projection: { firstName: 1, lastName: 1, email: 1, phone: 1 } }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Delete user profile
 *
 * userId String ID of the user
 * no response value expected for this operation
 **/
exports.deleteUserProfile = async function (userId) {
  const db = getDB();
  try {
    const result = await db.collection('users').deleteOne({ _id: ObjectId.createFromHexString(userId) });
    if (result.deletedCount === 0) {
      throw new Error('User not found or you do not have permission to delete this profile');
    }
  } catch (err) {
    throw new Error('Error deleting user profile: ' + err.message);
  }
};

/**
 * Check if user is an admin
 *
 * userId String ID of the user
 * returns Object
 **/
exports.isAdmin = async function (userId) {
  const db = getDB();

  try {
    const user = await db.collection('users').findOne(
      { _id: ObjectId.createFromHexString(userId) },
      { projection: { isAdmin: 1 } }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return { isAdmin: user.isAdmin || false };
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Update user profile
 *
 * userId String ID of the user
 * body UserDetails Updated user information
 * returns Object
 **/
exports.updateUserProfile = async function (userId, body) {
  const db = getDB();
  const { firstName, lastName, phone } = body;

  try {
    // Input validation
    if (!firstName || !lastName || !phone) {
      throw new Error('Missing required fields');
    }

    // Validate phone number format (using the same regex from frontend)
    const phoneRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }

    const result = await db.collection('users').updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $set: {
          firstName,
          lastName,
          phone,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: { firstName, lastName, phone }
    };
  } catch (err) {
    throw new Error(`Error updating profile: ${err.message}`);
  }
};