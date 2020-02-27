var express = require('express');

var userController = require('../controllers/userController.js');


module.exports= (router) => {
/*
 * GET
 */
router.get('/users', userController.list);

/*
 * GET
 */
router.get('/users/:id', userController.show);

/*
 * POST
 */
router.post('/users', userController.create);


/*
 * POST
 */
router.post('/login', userController.login);

/*
 * PUT
 */
router.put('/users/:id', userController.update);

/*
 * DELETE
 */
router.delete('/users/:id', userController.remove);

}

