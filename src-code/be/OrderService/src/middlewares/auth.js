const jwt = require('jsonwebtoken');
const config = require('../config/config');
const axios = require('axios');
const db = require('../models/index');
const {Customers,Employees} = db;
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "tht"); // Hoặc config.jwtSecret nếu cần
    const iduser = decoded.iduser;

    // Gọi AuthService có kèm header Bearer token
    const authServiceUrl = config.authServiceUrl;

    try {
      const response = await axios.get(
        `${authServiceUrl}/api/v1/users/${iduser}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // <-- kèm token để xác thực với AuthService
          }
        }
      );

      const user = response.data;
      if (!user) {
        return res.status(404).json({ message: 'User not found in Auth Service' });
      }
      const customer = await Customers.findOne({where:{iduser:user.iduser}});
      const employee = await Employees.findOne({where:{iduser:user.iduser}});
      res.locals.user = {...user,roles:user.RoleUsers.map((item)=>{ return item.role.name}),customer_id:customer?.customer_id,employee_id:employee?.staff_id};

      next();
    } catch (error) {
      console.error('Error fetching user from Auth Service:', error.message);
      return res.status(500).json({ message: 'Failed to fetch user details' });
    }

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!res.locals.user || !res.locals.user.roles) {
      return res.status(403).json({ message: 'Forbidden: User roles not available' });
    }

    const userRoles = res.locals.user.roles;
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole
};
