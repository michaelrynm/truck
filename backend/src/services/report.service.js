const prisma = require('../config/database');

/**
 * Get operations report
 */
const getOperationsReport = async (startDate, endDate, contractId) => {
  const where = {
    submittedAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  };

  if (contractId) {
    where.schedule = {
      contractId,
    };
  }

  const activities = await prisma.activityLog.findMany({
    where,
    include: {
      schedule: {
        include: {
          contract: true,
          dumpTruck: true,
          driver: true,
        },
      },
      driver: true,
    },
  });

  const totalHours = activities.reduce((sum, activity) => sum + activity.workingHours, 0);
  const totalActivities = activities.length;

  const contractSummary = {};
  activities.forEach((activity) => {
    const contractName = activity.schedule.contract.clientName;
    if (!contractSummary[contractName]) {
      contractSummary[contractName] = {
        totalHours: 0,
        totalActivities: 0,
      };
    }
    contractSummary[contractName].totalHours += activity.workingHours;
    contractSummary[contractName].totalActivities += 1;
  });

  return {
    period: {
      startDate,
      endDate,
    },
    summary: {
      totalHours,
      totalActivities,
    },
    contractSummary,
    activities,
  };
};

/**
 * Get fleet efficiency report
 */
const getEfficiencyReport = async () => {
  const trucks = await prisma.dumpTruck.findMany({
    include: {
      schedules: {
        where: {
          status: 'COMPLETED',
        },
        include: {
          activityLogs: true,
        },
      },
    },
  });

  const efficiency = trucks.map((truck) => {
    const totalSchedules = truck.schedules.length;
    const totalHours = truck.schedules.reduce((sum, schedule) => {
      return sum + schedule.activityLogs.reduce((s, log) => s + log.workingHours, 0);
    }, 0);

    return {
      truckId: truck.id,
      plateNumber: truck.plateNumber,
      type: truck.type,
      status: truck.status,
      totalSchedules,
      totalHours,
      averageHoursPerSchedule: totalSchedules > 0 ? totalHours / totalSchedules : 0,
    };
  });

  return efficiency;
};

/**
 * Get driver performance report
 */
const getDriverReport = async (startDate, endDate) => {
  const drivers = await prisma.driver.findMany({
    include: {
      schedules: {
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
      activityLogs: {
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      },
    },
  });

  return drivers.map((driver) => {
    const totalSchedules = driver.schedules.length;
    const completedSchedules = driver.schedules.filter(s => s.status === 'COMPLETED').length;
    const totalLoads = driver.activityLogs.reduce((sum, log) => sum + log.numberOfLoads, 0);

    return {
      driverId: driver.id,
      driverName: driver.name,
      totalSchedules,
      completedSchedules,
      totalLoads,
    };
  });
};

/**
 * Get contract summary report
 */
const getContractReport = async (startDate, endDate) => {
  const contracts = await prisma.contract.findMany({
    include: {
      schedules: {
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        include: {
          activityLogs: true,
        },
      },
    },
  });

  return contracts.map((contract) => {
    const totalSchedules = contract.schedules.length;
    const completedSchedules = contract.schedules.filter(s => s.status === 'COMPLETED').length;
    const totalLoads = contract.schedules.reduce((sum, schedule) => {
      return sum + schedule.activityLogs.reduce((s, log) => s + log.numberOfLoads, 0);
    }, 0);

    return {
      contractId: contract.id,
      clientName: contract.clientName,
      location: contract.location,
      totalSchedules,
      completedSchedules,
      totalLoads,
    };
  });
};

module.exports = {
  getOperationsReport,
  getEfficiencyReport,
  getDriverReport,
  getContractReport,
};
