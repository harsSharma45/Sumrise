const { Router } = require("express");
const router = Router();

const userController = require('../Controllers/userController'); // added controller import

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
