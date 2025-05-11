const requireRole = (roles) => {
  return (req, res, next) => {
    if (!res.locals.user) {
      return res.status(403).json({ message: 'Forbidden: User not authenticated' });
    }

    const userRoles = res.locals.user.RoleUsers.map(roleUser => roleUser.role.name);

    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (hasRequiredRole) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
  };
};

module.exports = {requireRole};