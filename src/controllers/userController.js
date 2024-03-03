const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour spécifier le répertoire de stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

  async function registerUser(req, res) {
    const { username, password, email } = req.body;
  
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'votreUtilisateur',
        password: 'votreMotDePasse',
        database: 'votreBaseDeDonnees',
        port: 8000,
      });
  
      // Vérifier si le pseudo ou l'email existe déjà
      const [existingUsers] = await connection.execute('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  
      if (existingUsers.length > 0) {
        res.json({ status: 'ko', error: 'Username or email already exists' });
      } else {
        // Insérer le nouvel utilisateur dans la base de données
        await connection.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
        await connection.end();
  
        res.json({ status: 'ok' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'ko', error: 'Internal Server Error' });
    }
  }

  async function getProfile(req, res) {
    // Utilisez l'ID de l'utilisateur extrait du token pour récupérer les informations du profil
    const userId = req.user.id;
  
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'votreUtilisateur',
        password: 'votreMotDePasse',
        database: 'votreBaseDeDonnees',
        port: 8000,
      });
  
      const [user] = await connection.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);
  
      await connection.end();
  
      if (user.length > 0) {
        res.json({ id: user[0].id, username: user[0].username, email: user[0].email });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Nouvelle fonction pour gérer l'upload de fichier
async function uploadFile(req, res) {
  try {
    // Vérifiez si un fichier a été téléchargé
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Traitez le fichier comme requis (enregistrez-le dans la base de données, etc.)
    const filename = req.file.filename;

    // Vous pouvez également ajouter le code nécessaire pour enregistrer le nom du fichier dans la base de données si nécessaire

    res.json({ status: 'ok', filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'ko', error: 'Internal Server Error' });
  }
}

module.exports = {
  authenticateUser,
  registerUser,
  getProfile,
  uploadFile,
};
