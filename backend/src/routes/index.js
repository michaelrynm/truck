const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const driverRoutes = require('./driver.routes');
const dumpTruckRoutes = require('./dumpTruck.routes');
const contractRoutes = require('./contract.routes');
const scheduleRoutes = require('./schedule.routes');
const activityRoutes = require('./activity.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drivers', driverRoutes);
router.use('/dump-trucks', dumpTruckRoutes);
router.use('/contracts', contractRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/activities', activityRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
