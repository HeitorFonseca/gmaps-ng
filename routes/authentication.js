var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Import User Model Schema
const config = require('../config/database')

const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.

router.post('/nova', (req, res) => {
  console.log(req.body);
  // Check if email was provided
  if (!req.body.email) {
    res.status(400).json({message: 'Voce deve fornecer um e-mail' }); // Return error
  } else {
    // Check if nome was provided
    if (!req.body.nome) {
      res.status(400).json({message: 'Voce deve fornecer um nome' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.senha) {
        res.status(400).json({ message: 'Voce deve fornecer uma senha' }); // Return error
      } else {
        if (!req.body.tipo) {
          res.status(400).json({message: 'Voce deve fornecer um tipo' }); // Return error
        }
        else {
          // Create new user object and apply user input
          let user = new User({
            email: req.body.email.toLowerCase(),
            nome: req.body.nome.toLowerCase(),
            senha: req.body.senha,
            tipo: req.body.tipo,
            hectaresContratados: req.body.hectaresContratados,
            hectaresRestantes: req.body.hectaresContratados
          });
          // Save user to database
          user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.status(400).json({message: 'Email já cadastrado' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.status(400).json({message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the nome field
                    if (err.errors.nome) {
                      res.status(400).json({message: err.errors.nome.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.senha) {
                        res.status(400).json({message: err.errors.senha.message }); // Return error
                      } else {
                        res.status(400).json({ message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.status(500).json({ message: 'Não foi possivel salvar o usuário. Erro: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.status(200).json({ message: 'Conta registrada!' }); // Return success
            }
          });
        }
      }
    }
  }
});

router.post('/login', (req, res) => {


  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

  if (!req.body.email) {
    res.status(400).json({message: 'E-mail não foi fornecido' });
  }
  else {
    if (!req.body.senha) {
      res.status(400).json({ message: 'Senha não foi fornecida' });
    }
    else {
      User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
        if (err) {
          res.status(500).json({ message: "Erro ao procurar o usuário" });
        } else {
          if (!user) {
            res.status(404).json({message: 'Não foi possivel encontrar o usuário' });
          } else {
            const validPassword = user.comparePassword(req.body.senha);
            if (!validPassword) {
              res.status(400).json({ message: 'Senha inválida' });
            } else {
              console.log("no login:", user.tipo);
              const token = jwt.sign({ userId: user._id, type: user.tipo }, config.secret, { expiresIn: '24h' });

              res.status(200).json({message: 'Successo!', token: token, user: { nome: user.nome, id: user._id, tipo: user.tipo, hectaresContratados: user.hectaresContratados } });
            }
          }
        }
      });
    }
  }
});



module.exports = router;