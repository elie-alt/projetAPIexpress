const jwt = require('jsonwebtoken');
const secretKey = '3b6d2e359073f3d2a27e8daad1acbd215d4d357020e6ac0291398a675a06ad86';

async function authenticate(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = authenticate;
