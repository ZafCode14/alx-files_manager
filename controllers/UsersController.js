// controllers/UsersController.js
import dbClient from '../utils/db';

const UsersController = {
  async postNew(req, res) {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Create user using DBClient
      const newUser = await dbClient.createUser(email, password);

      // Return the new user's id and email with status code 201
      return res.status(201).json({
        id: newUser._id, // Assuming MongoDB auto-generates _id
        email: newUser.email,
      });
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.message === 'Already exist') {
        return res.status(400).json({ error: 'Already exist' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default UsersController;
