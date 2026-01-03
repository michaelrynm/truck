const express = require('express');
const activityController = require('../controllers/activity.controller');
const authenticate = require('../middlewares/auth.middleware');
const roleCheck = require('../middlewares/roleCheck.middleware');
const validate = require('../middlewares/validate.middleware');
const { createActivitySchema, updateActivitySchema } = require('../validations/activity.validation');

const router = express.Router();

router.use(authenticate);

router.get('/', roleCheck(['ADMIN', 'MANAGER']), activityController.getAllActivities);
router.get('/my-activities', roleCheck(['DRIVER']), activityController.getMyActivities);
router.post('/', validate(createActivitySchema), activityController.createActivity);
router.get('/:id', activityController.getActivityById);
router.put('/:id', validate(updateActivitySchema), activityController.updateActivity);
router.delete('/:id', roleCheck(['ADMIN', 'MANAGER']), activityController.deleteActivity);

module.exports = router;
