const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const access = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // 1 gün
  const refresh = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: '30d' }); // 30 gün
  return { access, refresh };
};


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Bu email artıq qeydiyyatdan keçib." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ id: user._id, name: user.name, email: user.email });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Email/sifre yanlis' });
  const { access, refresh } = generateTokens(user);
  res
    .cookie('refreshToken', refresh, { httpOnly: true, secure: true, sameSite: 'Strict' })
    .json({ access, user: { id: user._id, name: user.name, email: user.email } });
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    const access = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ access });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken').sendStatus(204);
};
