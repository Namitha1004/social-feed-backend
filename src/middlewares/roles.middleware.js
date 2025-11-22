export const isAdmin = (req, res, next) => {
  if (req.user.role === 'ADMIN' || req.user.role === 'OWNER') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Admin access required',
  });
};

export const isOwner = (req, res, next) => {
  if (req.user.role === 'OWNER') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Owner access required',
  });
};

export const isSelfOrAdmin = (req, res, next) => {
  const userId = req.params.id || req.params.userId;
  if (req.user.id === userId || req.user.role === 'ADMIN' || req.user.role === 'OWNER') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied',
  });
};

