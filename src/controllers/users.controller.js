const UserService = require("../services/users.service.js");

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const user = await UserService.createUser(userData);
    return user; // No enviamos una respuesta JSON directamente aquí
  } catch (error) {
    throw error; // Reenviamos el error
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserService.getUserById(userId);
    return user; // No enviamos una respuesta JSON directamente aquí
  } catch (error) {
    throw error; // Reenviamos el error
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await UserService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userData = req.body;
    const updatedUser = await UserService.updateUser(userId, userData);
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await UserService.deleteUser(userId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
