const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const secretKey = '3b6d2e359073f3d2a27e8daad1acbd215d4d357020e6ac0291398a675a06ad86';

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

async function authenticateUser(req, res) {
    const { username, password } = req.body;
  
    try {
      // Créez une connexion à la base de données
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'votreUtilisateur',
        password: 'votreMotDePasse',
        database: 'votreBaseDeDonnees',
        port: 8000, // Assurez-vous que le port est correct
      });
  
      // Recherchez l'utilisateur dans la base de données
      const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  
      // Fermez la connexion après avoir effectué la requête
      await connection.end();
  
      if (rows.length > 0) {
        const user = rows[0];
        const token = await generateToken(user);
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Bad credentials/Incorrect user' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = {
  authenticateUser,
};
