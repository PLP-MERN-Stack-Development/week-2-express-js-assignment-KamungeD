// server.js - Express.js RESTful API for Week 2 assignment (PLP MERN Stack)

// ----- Imports -----
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'secret-key1234';

// ----- Custom Error Classes -----
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

// ----- Middleware -----

// Logger middleware: logs HTTP method, URL, and timestamp for each request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Authentication middleware: checks for valid API key in headers
function authenticate(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return next(new ValidationError('Unauthorized: Invalid API Key'));
  }
  next();
}

// Validation middleware: ensures product data is valid for POST/PUT
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return next(new ValidationError('Invalid product data'));
  }
  next();
}

// ----- In-memory Products Database -----
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// ----- Routes -----

// Root route: basic health check
app.get('/', (req, res) => {
  res.send('Hello World');
});

// GET /api/products - List all products (supports filtering by category and pagination)
app.get('/api/products', (req, res, next) => {
  try {
    let result = products;
    if (req.query.category) {
      result = result.filter(p => p.category === req.query.category);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || result.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = result.slice(start, end);
    res.json({
      total: result.length,
      page,
      limit,
      products: paginated
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id - Retrieve a product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products - Create a new product (requires authentication)
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id - Update a product (requires authentication)
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    const { name, description, price, category, inStock } = req.body;
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.inStock = inStock;
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id - Delete a product (requires authentication)
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      throw new NotFoundError('Product not found');
    }
    products.splice(index, 1);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search - Search products by name
app.get('/api/products/search', (req, res, next) => {
  try {
    const name = req.query.name ? req.query.name.toLowerCase() : '';
    const found = products.filter(p => p.name.toLowerCase().includes(name));
    res.json(found);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats - Get product statistics by category
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json({ countByCategory: stats, total: products.length });
  } catch (err) {
    next(err);
  }
});

// ----- Error Handling Middleware -----
// Global error handler: formats error responses with status and message
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong!'
  });
});

// ----- Start the Express server -----
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;