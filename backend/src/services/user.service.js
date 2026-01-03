const prisma = require('../config/database');
const { hashPassword } = require('../utils/bcrypt.util');
const { calculatePagination, paginatedResponse } = require('../utils/pagination.util');

/**
 * Get all users with pagination
 */
const getAllUsers = async (page, limit) => {
  const total = await prisma.user.count();
  const pagination = calculatePagination(page, limit, total);

  const users = await prisma.user.findMany({
    skip: pagination.skip,
    take: pagination.limit,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      driver: {
        select: {
          id: true,
          licenseNumber: true,
          phone: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return paginatedResponse(users, pagination);
};

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      driver: {
        select: {
          id: true,
          licenseNumber: true,
          phone: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Create user
 */
const createUser = async (data) => {
  const hashedPassword = await hashPassword(data.password);
  const { driverInfo, ...userData } = data;

  // If role is DRIVER, create both User and Driver in a transaction
  if (data.role === 'DRIVER' && driverInfo) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      await tx.driver.create({
        data: {
          name: userData.name,
          licenseNumber: driverInfo.licenseNumber,
          phone: driverInfo.phone,
          userId: user.id,
        },
      });

      return await tx.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          driver: {
            select: {
              id: true,
              licenseNumber: true,
              phone: true,
              status: true,
            },
          },
        },
      });
    });
  }

  // For non-DRIVER roles, just create the user
  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      driver: {
        select: {
          id: true,
          licenseNumber: true,
          phone: true,
          status: true,
        },
      },
    },
  });
};

/**
 * Update user
 */
const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  const { driverInfo, ...userData } = data;

  return await prisma.$transaction(async (tx) => {
    // Update user
    const user = await tx.user.update({
      where: { id },
      data: userData,
    });

    // Handle driver info if role is DRIVER
    if (user.role === 'DRIVER' && driverInfo) {
      const existingDriver = await tx.driver.findFirst({
        where: { userId: id },
      });

      if (existingDriver) {
        // Update existing driver
        await tx.driver.update({
          where: { id: existingDriver.id },
          data: {
            name: userData.name || existingDriver.name,
            licenseNumber: driverInfo.licenseNumber,
            phone: driverInfo.phone,
          },
        });
      } else {
        // Create new driver profile
        await tx.driver.create({
          data: {
            name: user.name,
            licenseNumber: driverInfo.licenseNumber,
            phone: driverInfo.phone,
            userId: user.id,
          },
        });
      }
    }

    // If role changed from DRIVER to something else, set userId to null on driver
    if (data.role && data.role !== 'DRIVER') {
      await tx.driver.updateMany({
        where: { userId: id },
        data: { userId: null },
      });
    }

    // Return updated user with driver relation
    return await tx.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        driver: {
          select: {
            id: true,
            licenseNumber: true,
            phone: true,
            status: true,
          },
        },
      },
    });
  });
};

/**
 * Delete user
 */
const deleteUser = async (id) => {
  return await prisma.$transaction(async (tx) => {
    const driver = await tx.driver.findFirst({
      where: { userId: id },
      include: {
        schedules: {
          where: {
            status: 'SCHEDULED',
          },
        },
      },
    });

    if (driver && driver.schedules.length > 0) {
      throw new Error('Cannot delete user linked to driver with active schedules');
    }

    // Set userId to null on driver to preserve history
    if (driver) {
      await tx.driver.update({
        where: { id: driver.id },
        data: { userId: null },
      });
    }

    return await tx.user.delete({
      where: { id },
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
