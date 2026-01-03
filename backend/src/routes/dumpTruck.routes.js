const express = require('express');
const dumpTruckController = require('../controllers/dumpTruck.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createDumpTruckSchema, updateDumpTruckSchema } = require('../validations/dumpTruck.validation');

const router = express.Router();

router.use(authenticate);
router.use(roleCheck(['ADMIN', 'MANAGER']));

router.get('/', dumpTruckController.getAllDumpTrucks);
router.post('/', validate(createDumpTruckSchema), dumpTruckController.createDumpTruck);
router.get('/:id', dumpTruckController.getDumpTruckById);
router.put('/:id', validate(updateDumpTruckSchema), dumpTruckController.updateDumpTruck);
router.delete('/:id', dumpTruckController.deleteDumpTruck);

module.exports = router;
