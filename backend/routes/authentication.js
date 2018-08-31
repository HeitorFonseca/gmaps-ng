var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Import User Model Schema
const config = require('../config/database')
const crypto = require('crypto') // TODO: REMOVE
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS
var async = require('async');
var nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.

router.post('/nova', (req, res) => {
  console.log(req.body);
  // Check if email was provided
  if (!req.body.email) {
    res.status(400).json({ message: 'Voce deve fornecer um e-mail' }); // Return error
  } else {
    // Check if nome was provided
    if (!req.body.nome) {
      res.status(400).json({ message: 'Voce deve fornecer um nome' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.senha) {
        res.status(400).json({ message: 'Voce deve fornecer uma senha' }); // Return error
      } else {
        if (!req.body.tipo) {
          res.status(400).json({ message: 'Voce deve fornecer um tipo' }); // Return error
        }
        else {
          var user;

          if (req.body.tipo == "produtor") {
            user = new User({
              email: req.body.email.toLowerCase(),
              nome: req.body.nome.toLowerCase(),
              senha: req.body.senha,
              tipo: req.body.tipo,
              hectaresContratados: req.body.hectaresContratados,
              hectaresRestantes: req.body.hectaresContratados
            });
          }
          else {
            user = new User({
              email: req.body.email.toLowerCase(),
              nome: req.body.nome.toLowerCase(),
              senha: req.body.senha,
              tipo: req.body.tipo,
            });
          }

          // Save user to database
          user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.status(400).json({ message: 'Email já cadastrado' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.status(400).json({ message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the nome field
                    if (err.errors.nome) {
                      res.status(400).json({ message: err.errors.nome.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.senha) {
                        res.status(400).json({ message: err.errors.senha.message }); // Return error
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
              res.status(201).send(); // Return success
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
    res.status(400).json({ message: 'E-mail não foi fornecido' });
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
            res.status(404).json({ message: 'Não foi possivel encontrar o usuário' });
          } else {
            const validPassword = user.comparePassword(req.body.senha);
            if (!validPassword) {
              res.status(400).json({ message: 'Senha inválida' });
            } else {
              console.log("no login:", user.tipo);
              const token = jwt.sign({ userId: user._id, type: user.tipo }, config.secret, { expiresIn: '24h' });

              res.status(200).json({ token: token, user: { nome: user.nome, id: user._id, tipo: user.tipo, hectaresContratados: user.hectaresContratados } });
            }
          }
        }
      });
    }
  }
});

router.post('/redefinir-senha', (req, res, next) => {

  if (!req.body.email) {
    res.status(400).json({ message: 'E-mail não foi fornecido' });
  }
  else {
    async.waterfall([
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
          return;
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            res.status(404).json({ message: "Email não encontrado" });
            return;
          } else {
            console.log("achou usuario");
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
              return;
            });
          }
        });
      },
      function (token, user, done) {

        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: 'heitorfonseca.araujo@gmail.com', // generated gmail user
            pass: 'Hfa!180693' // generated gmail account password
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'heitorfonseca.araujo@gmail.com',
          subject: 'Digital Farms Password Reset',
          text: 'Clique no link para resetar a sua senha\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            '\n'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            done(error);
            return;
          }
          else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.status(204).send();
            return;
          }
        });

      }
    ], function (err) {

      return res.status(500).json({ message: "Erro ao redirecionar senha" });
    });
  }
});

router.get('/reset/:token', (req, res, next) => {

  console.log("reset token:", req.params);
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {

    if (err) {
      res.status(500).json({ message: 'Erro ao encontrar o token!' });
    } else {
      if (!user) {
        res.status(500).json({ message: 'Token invalido ou expirou!' });
      } else {
        res.status(204).send();
      }
    }
  });
});


router.post('/alterar-senha', (req, res, next) => {

  User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).exec(function (err, user) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: 'Erro ao redefinir senha' });
    }
    else {
      if (!user) {
        console.log(req.body);
        res.status(400).send({ message: 'Token inválido ou expirou.' });
      }
      else {
        user.senha = req.body.senhaNova;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save(function (err) {
          if (err) {
            res.status(500).json({ message: "Erro ao redefinir senha" });
          } else {

            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 587,
              secure: false, // true for 465, false for other ports
              auth: {
                user: 'heitorfonseca.araujo@gmail.com', // generated gmail user
                pass: 'Hfa!180693' // generated gmail account password
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'heitorfonseca.araujo@gmail.com',
              subject: 'Confirmação de mudança de senha',
              text: 'Senha mudada com sucesso!! \n\n'
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return res.status(500).json({ message: "Erro ao enviar e-mail de confirmação de senha" });
              } else {

                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                return res.status(204).send();
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;