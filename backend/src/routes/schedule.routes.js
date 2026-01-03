const express = require('express');
const scheduleController = require('../controllers/schedule.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createScheduleSchema, updateScheduleSchema } = require('../validations/schedule.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', scheduleController.getAllSchedules);
router.get('/availability/check', scheduleController.checkAvailability);
router.get('/:id', scheduleController.getScheduleById);

router.use(roleCheck(['ADMIN', 'MANAGER']));

router.post('/', validate(createScheduleSchema), scheduleController.createSchedule);
router.put('/:id', validate(updateScheduleSchema), scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
