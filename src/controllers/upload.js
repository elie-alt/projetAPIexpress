const multer = require('multer');

// Configuration de Multer pour spécifier le fichier unique à télécharger (avec le nom 'file')
const storage = multer.memoryStorage(); // Stocke le fichier en mémoire
const upload = multer({ storage: storage });

module.exports = upload;
