const users = [
    {
      username: 'utilisateur1',
      password: 'motdepasse1',
    },
    {
      username: 'utilisateur2',
      password: 'motdepasse2',
    },
  ];
  
  const authenticate = async (req, res) => {
    const { username, password } = req.body;
  
    const user = users.find((u) => u.username === username);
  
    if (!user) {
      return res.status(401).send('Utilisateur incorrect');
    }
  
    if (user.password !== password) {
      return res.status(401).send('Mot de passe incorrect');
    }
  
    const token = jwt.sign({ username }, 'ma-cle-secrete', { expiresIn: '1h' });
  
    res.json({ token });
  };
  
  module.exports = { authenticate };
  