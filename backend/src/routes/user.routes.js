const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema } = require('../validations/user.validation');

const router = express.Router();

router.use(authenticate);
router.use(roleCheck(['ADMIN']));

router.get('/', userController.getAllUsers);
router.post('/', validate(createUserSchema), userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
