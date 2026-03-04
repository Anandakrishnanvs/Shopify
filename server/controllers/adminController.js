import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ['user', 'admin', 'seller'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

// @desc    Delete user by admin
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent admin from deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const sellerCount = await User.countDocuments({ role: 'seller' });
    const userCount = await User.countDocuments({ role: 'user' });

    const totalProducts = await Product.countDocuments();
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.json({
      stats: {
        totalUsers,
        adminCount,
        sellerCount,
        userCount,
        totalProducts,
        outOfStockProducts,
      },
      recentUsers,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

// @desc    Get analytics data for charts
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    // 1. Product count by category
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 2. Stock distribution
    const inStock = await Product.countDocuments({ stock: { $gt: 10 } });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const stockDistribution = [
      { label: 'In Stock', value: inStock },
      { label: 'Low Stock', value: lowStock },
      { label: 'Out of Stock', value: outOfStock },
    ];

    // 3. Price range distribution
    const under500 = await Product.countDocuments({ price: { $lt: 500 } });
    const range500to1000 = await Product.countDocuments({ price: { $gte: 500, $lt: 1000 } });
    const range1000to2000 = await Product.countDocuments({ price: { $gte: 1000, $lt: 2000 } });
    const above2000 = await Product.countDocuments({ price: { $gte: 2000 } });
    const priceDistribution = [
      { label: '<₹500', value: under500 },
      { label: '₹500–1K', value: range500to1000 },
      { label: '₹1K–2K', value: range1000to2000 },
      { label: '>₹2K', value: above2000 },
    ];

    // 4. User role breakdown
    const userCount = await User.countDocuments({ role: 'user' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const sellerCount = await User.countDocuments({ role: 'seller' });
    const roleBreakdown = [
      { label: 'Users', value: userCount },
      { label: 'Admins', value: adminCount },
      { label: 'Sellers', value: sellerCount },
    ];

    // 5. User registration trend — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Fill in missing months with 0
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendMap = {};
    registrationTrend.forEach(({ _id, count }) => {
      trendMap[`${_id.year}-${_id.month}`] = count;
    });
    const now = new Date();
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      trend.push({ label: monthNames[d.getMonth()], value: trendMap[key] || 0 });
    }

    // 6. Top 5 rated products
    const topRated = await Product.find({})
      .sort({ rating: -1 })
      .limit(5)
      .select('name rating reviewCount category');

    res.json({
      categoryBreakdown,
      stockDistribution,
      priceDistribution,
      roleBreakdown,
      registrationTrend: trend,
      topRated,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

export { getAllUsers, getUserById, updateUserRole, deleteUserByAdmin, getDashboardStats, getAnalytics };
