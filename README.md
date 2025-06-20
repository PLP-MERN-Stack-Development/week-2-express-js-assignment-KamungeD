# Express.js RESTful API Assignment

This project is a RESTful API built with Express.js for managing a product resource. It demonstrates proper routing, middleware, error handling, and advanced features like filtering, pagination, and search.

---

## Objective

Build a RESTful API using Express.js that implements standard CRUD operations, proper routing, middleware implementation, and error handling.

---

## Features

- CRUD operations for a `products` resource
- Custom middleware for logging, authentication, and validation
- Global error handling with custom error classes
- Filtering products by category
- Pagination support for product listing
- Search endpoint for products by name
- Product statistics (count by category)

---

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the server:**
   ```bash
   npm start
   ```
   The server will start on [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### Basic Health Check
- `GET /`  
  Returns: `"Hello World"`

### Products Resource

- `GET /api/products`  
  List all products. Supports filtering by category and pagination:  
  - `?category=electronics&page=1&limit=10`

- `GET /api/products/:id`  
  Get a specific product by ID.

- `POST /api/products`  
  Create a new product.  
  **Requires**:  
  - `x-api-key` header  
  - JSON body:  
    ```json
    {
      "name": "string",
      "description": "string",
      "price": number,
      "category": "string",
      "inStock": boolean
    }
    ```

- `PUT /api/products/:id`  
  Update an existing product.  
  **Requires**:  
  - `x-api-key` header  
  - Same JSON body as POST

- `DELETE /api/products/:id`  
  Delete a product.  
  **Requires**:  
  - `x-api-key` header

- `GET /api/products/search?name=...`  
  Search products by name (case-insensitive).

- `GET /api/products/stats`  
  Get product statistics (count by category and total).

---

## Middleware

- **Logger:** Logs request method, URL, and timestamp.
- **Body Parser:** Parses JSON request bodies.
- **Authentication:** Checks for a valid API key in the `x-api-key` header.
- **Validation:** Ensures product data is valid for POST and PUT requests.

---

## Error Handling

- Custom error classes for 404 (NotFoundError) and 400 (ValidationError)
- Global error handler returns JSON with status and message
- All errors use appropriate HTTP status codes

---

## Example Requests

**Create a Product**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: secret-key1234" \
  -d '{"name":"Tablet","description":"A new tablet","price":300,"category":"electronics","inStock":true}'
```

**Get All Products (with pagination)**
```bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=2"
```

**Search Products**
```bash
curl "http://localhost:3000/api/products/search?name=coffee"
```

---

## Requirements

- Node.js (v18 or higher)
- npm

---

## License

This project is for educational purposes as part of the PLP MERN Stack