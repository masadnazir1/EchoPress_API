// /controllers/userController.js
const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
  const result = await userService.getAllUsers();
  res.status(result.status).json(result.data);
};

exports.getUserById = async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  res.status(result.status).json(result.data);
};

exports.createUser = async (req, res) => {
  const result = await userService.createUser(req.body);
  res.status(result.status).json(result.data);
};

exports.updateUser = async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.status(result.status).json(result.data);
};

exports.deleteUser = async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.status(result.status).json(result.data);
};