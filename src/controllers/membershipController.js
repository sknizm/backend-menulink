const prisma = require('../../prisma/client');
const { addDays } = require('date-fns');

// ✅ Check if membership is active (pure function)
exports.isActiveMembership = (membership) => {
  if (!membership) return false;
  return (
    membership.status === 'ACTIVE' &&
    new Date(membership.endDate) > new Date()
  );
};

// ✅ Create membership
exports.createMembership = async (req, res) => {
  try {
    const {
      restaurantId,
      planId,
      status = 'ACTIVE',
      startDate = new Date(),
      endDate,
      renewsAt,
    } = req.body;

    const _endDate = endDate ? new Date(endDate) : addDays(new Date(startDate), 1);
    const _renewsAt = renewsAt ? new Date(renewsAt) : _endDate;

    const membership = await prisma.membership.create({
      data: {
        restaurantId,
        planId,
        status,
        startDate: new Date(startDate),
        endDate: _endDate,
        renewsAt: _renewsAt,
      },
    });

    res.status(201).json(membership);
  } catch (error) {
    console.error('Error creating membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Check if a restaurant’s membership is active
exports.isMembershipActive = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const membership = await prisma.membership.findUnique({
      where: { restaurantId },
    });

    const isActive =
      membership?.status === 'ACTIVE' &&
      new Date(membership.endDate) > new Date();

    res.status(200).json({ active: isActive });
  } catch (error) {
    console.error('Error checking membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ✅ Get restaurant membership
exports.getRestaurantMembership = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const membership = await prisma.membership.findUnique({
      where: { restaurantId },
    });

    res.status(200).json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
