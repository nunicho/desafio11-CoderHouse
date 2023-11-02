const UserModel = require("../dao/DB/models/users.modelo.js");

class UserService {
  async createUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
