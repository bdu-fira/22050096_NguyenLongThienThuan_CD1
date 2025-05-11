const jwt = require('jsonwebtoken');
const config = require('../config');
const axios = require('axios');

const authenticate = async(req, res, next) => {
 const authHeader = req.headers.authorization;
 
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
     return res.status(401).json({ message: 'Authentication required' });
   }
 
   const token = authHeader.split(' ')[1];
 
   try {
     const decoded = jwt.verify(token, "tht"); // Hoặc config.jwtSecret nếu cần
     const iduser = decoded.iduser;
 
     // Gọi AuthService có kèm header Bearer token
     const authServiceUrl = config.database.authServiceUrl;

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
       
       res.locals.user = {...user,roles:user.RoleUsers.map((item)=>{ return item.role.name})};
 
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
    const user = res.locals.user;

    if (!user || !user.roles) {
      return res.status(403).json({ message: 'Unauthorized - Missing roles' });
    }

    const hasRequiredRole = roles.some(role => user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Unauthorized - Insufficient role' });
    }

    next();
  };
};

module.exports = {
  authenticate,
  requireRole
};
