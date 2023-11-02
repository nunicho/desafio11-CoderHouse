const modeloUsers = require("../dao/DB/models/users.modelo.js");

class UserService {
  async createUser(userData) {
    try {
      const user = await modeloUsers.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await modeloUsers.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await modeloUsers.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const updatedUser = await modeloUsers.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await modeloUsers.findByIdAndDelete(userId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
