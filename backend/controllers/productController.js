
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      sizes,
      colors,
    } = req.body;

    const product = new Product({
      name,
      price,
      description,
      images: images || [],
      brand,
      category,
      stock: stock || 0,
      sizes: sizes || [],
      colors: colors || [],
      rating: 0,
      reviewCount: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      sizes,
      colors,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
