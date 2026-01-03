const express = require('express');
const reportController = require('../controllers/report.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');

const router = express.Router();

router.use(authenticate);
router.use(roleCheck(['ADMIN', 'MANAGER']));

router.get('/operations', reportController.getOperationsReport);
router.get('/efficiency', reportController.getEfficiencyReport);
router.get('/drivers', reportController.getDriverReport);
router.get('/contracts', reportController.getContractReport);
router.get('/export', reportController.exportReport);

module.exports = router;
