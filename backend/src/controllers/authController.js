import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, program } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un compte existe deja avec cet email.' });
    }

    const user = await User.create({ name, email, password, program });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        program: user.program
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: error.message || 'Impossible de creer le compte.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }

    return res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        program: user.program
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: error.message || 'Impossible de se connecter.'
    });
  }
};

export const getMe = async (req, res) => {
  return res.json(req.user);
};
