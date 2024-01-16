const knex = require("../database/knex");
const { compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsCotroller {
  async create(request, response) {
    const { email, password } = request.body;

    const [user] = await knex("users").where({ email });

    if (!user) {
      throw new AppError("Email e/ou senha incorretos.");
    }

    const matchingPassword = await compare(password, user.password);

    if (!matchingPassword) {
      throw new AppError("Email e/ou senha incorretos.");
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return response.json({ user, token });
  }
}

module.exports = SessionsCotroller;
