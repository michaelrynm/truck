const express = require('express');
const contractController = require('../controllers/contract.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createContractSchema, updateContractSchema } = require('../validations/contract.validation');

const router = express.Router();

router.use(authenticate);
router.use(roleCheck(['ADMIN', 'MANAGER']));

router.get('/', contractController.getAllContracts);
router.post('/', validate(createContractSchema), contractController.createContract);
router.get('/:id', contractController.getContractById);
router.put('/:id', validate(updateContractSchema), contractController.updateContract);
router.delete('/:id', contractController.deleteContract);

module.exports = router;
