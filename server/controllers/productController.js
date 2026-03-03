
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, category, price, brands, rating, sort } = req.query;

  let query = {};

  if (search) {
    query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (price) {
    query.price = { $lte: Number(price) };
  }

  if (brands) {
    query.brand = { $in: brands.split(',') };
  }
  
  if (rating) {
      query.rating = { $gte: Number(rating) };
  }

  let sortOptions = {};
  switch (sort) {
      case 'price_asc':
          sortOptions = { price: 1 };
          break;
      case 'price_desc':
          sortOptions = { price: -1 };
          break;
      case 'rating':
          sortOptions = { rating: -1 };
          break;
      case 'newest':
          sortOptions = { createdAt: -1 };
          break;
      default: // popularity
          sortOptions = { reviewCount: -1 };
          break;
  }


  try {
    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
     res.status(404).json({ message: 'Product not found' });
  }
};

export { getProducts, getProductById };
