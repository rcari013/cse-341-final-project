const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// GET
router.get('/', usersController.getAll);
router.get('/:id', usersController.getSingle);

// POST
router.post('/', usersController.createUser);

// PUT
router.put('/:id', usersController.updateUser);

// DELETE
router.delete('/:id', usersController.deleteUser);

module.exports = router;