const express = require('express');
const driverController = require('../controllers/driver.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createDriverSchema, updateDriverSchema } = require('../validations/driver.validation');

const router = express.Router();

router.use(authenticate);
router.use(roleCheck(['ADMIN', 'MANAGER']));

router.get('/', driverController.getAllDrivers);
router.post('/', validate(createDriverSchema), driverController.createDriver);
router.get('/:id', driverController.getDriverById);
router.put('/:id', validate(updateDriverSchema), driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
