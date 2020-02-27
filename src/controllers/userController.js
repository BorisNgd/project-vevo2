var userModel = require('../models/userModel.js');
var path = require('path');
var validator = require('validator');
// var User = require(path.resolve(__dirname, '../../models/user-model'));
var ErrorMessages = require(path.resolve(__dirname, '../util/error-messages'));
var AuthToken = require(path.resolve(__dirname, '../util/application-auth/auth-tokens'));

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        
        var user = new userModel({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password

        });
    
        user.save(function (err, user) {
            if (err) {
                 return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                }); 
            }
            return res.status(201).json(user);

        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.name = req.body.name ? req.body.name : user.name;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    login : function(req, res) {
        var login = req.body.email;
        var password = req.body.password;
        console.log(login, " —— ",password)
        if(!password || !login) {
            return res.status(400).json({ message: "We need both an login and password." });
        }
        login = login.toLowerCase();
        userModel.findOne({email: login}, function(err, user) {
            if (err) {
                return res.status(500).json({ message: ErrorMessages.unknown });
            }
            if (!user) {
                return res.status(400).json({ message: "Woops, wrong login or password. Check your login : " + login });
            }
            if (user.authenticate(password)) {
                var authToken = AuthToken.create(login, user._id);
                user.authToken = authToken;
                user.save(function(err) {
                    if (err) {
                        return res.status(500).json({ message: ErrorMessages.unknown });
                    } else {
                       return res.status(200).json({message: { message: "OK", authToken: authToken} , user}
                        );
                    }
                });
            } else {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }
        });
    }
};
