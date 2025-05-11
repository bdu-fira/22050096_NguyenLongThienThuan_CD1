const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, "tht", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }

      const iduser = decoded.iduser;

      try {
        const user = await db.Users.findByPk(iduser, {
          include: [
            {
              model: db.RoleUsers,
              as: 'RoleUsers',
              include: [  
                {
                  model: db.Roles,
                  as: 'role',
                },
              ],
            },
          ],
        });

        if (!user) {
          return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        res.locals.user = user;
        next();
      } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

module.exports = {authenticate};