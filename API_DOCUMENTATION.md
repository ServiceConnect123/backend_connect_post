# 📖 API Documentation - BackConnectPost

## Base URL
```
http://localhost:3001
```

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "emailConfirmed": false
  },
  "session": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresAt": 1234567890
  }
}
```

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin User",
    "emailConfirmed": true
  },
  "session": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresAt": 1234567890
  }
}
```

### 3. Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "emailConfirmed": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastSignIn": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### 5. Forgot Password
**POST** `/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

### 6. Reset Password
**POST** `/auth/reset-password`

**Request Body:**
```json
{
  "accessToken": "reset_token_from_email",
  "newPassword": "newPassword123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

## 📝 Posts Endpoints

### 1. Get All Posts
**GET** `/posts`

**Query Parameters:**
- `published` (boolean, optional): Filter by publication status
- `limit` (number, optional, default: 10): Number of posts per page
- `offset` (number, optional, default: 0): Pagination offset
- `search` (string, optional): Search in title, content, or tags

**Example:**
```
GET /posts?published=true&limit=5&offset=0&search=nestjs
```

**Response:**
```json
{
  "posts": [
    {
      "id": "post_1",
      "title": "Welcome to BackConnectPost",
      "content": "This is your first post in the new hexagonal architecture blog platform...",
      "authorId": "admin-user-id",
      "isPublished": true,
      "tags": ["welcome", "nestjs", "architecture"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 5,
    "offset": 0,
    "hasMore": false
  }
}
```

### 2. Get Single Post
**GET** `/posts/:id`

**Response:**
```json
{
  "post": {
    "id": "post_1",
    "title": "Welcome to BackConnectPost",
    "content": "This is your first post...",
    "authorId": "admin-user-id",
    "isPublished": true,
    "tags": ["welcome", "nestjs", "architecture"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Post
**POST** `/posts`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my new post...",
  "tags": ["new", "post", "example"]
}
```

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "post_new_id",
    "title": "My New Post",
    "content": "This is the content of my new post...",
    "authorId": "user_id",
    "isPublished": false,
    "tags": ["new", "post", "example"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Post
**PUT** `/posts/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content...",
  "tags": ["updated", "post"]
}
```

**Response:**
```json
{
  "message": "Post updated successfully",
  "post": {
    "id": "post_id",
    "title": "Updated Post Title",
    "content": "Updated content...",
    "authorId": "user_id",
    "isPublished": false,
    "tags": ["updated", "post"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Publish Post
**PUT** `/posts/:id/publish`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Post published successfully",
  "post": {
    "id": "post_id",
    "title": "My Post",
    "content": "Post content...",
    "authorId": "user_id",
    "isPublished": true,
    "tags": ["example"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 6. Unpublish Post
**PUT** `/posts/:id/unpublish`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Post unpublished successfully",
  "post": {
    "id": "post_id",
    "title": "My Post",
    "content": "Post content...",
    "authorId": "user_id",
    "isPublished": false,
    "tags": ["example"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 7. Delete Post
**DELETE** `/posts/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

### 8. Get My Posts
**GET** `/posts/my-posts`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "posts": [
    {
      "id": "post_1",
      "title": "My First Post",
      "content": "Content of my first post...",
      "authorId": "user_id",
      "isPublished": true,
      "tags": ["personal", "first"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 🔒 Authentication Requirements

### Protected Endpoints
The following endpoints require authentication (Bearer token):

- **POST** `/posts` - Create post
- **PUT** `/posts/:id` - Update post
- **PUT** `/posts/:id/publish` - Publish post  
- **PUT** `/posts/:id/unpublish` - Unpublish post
- **DELETE** `/posts/:id` - Delete post
- **GET** `/posts/my-posts` - Get user's posts
- **GET** `/auth/profile` - Get user profile
- **POST** `/auth/logout` - Logout

### Public Endpoints
The following endpoints are public (no authentication required):

- **GET** `/posts` - Get all posts
- **GET** `/posts/:id` - Get single post
- **POST** `/auth/register` - Register user
- **POST** `/auth/login` - Login user
- **POST** `/auth/forgot-password` - Request password reset
- **POST** `/auth/reset-password` - Reset password

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## 🧪 Testing Examples

### Test Authentication Flow
```bash
# 1. Register a new user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 2. Login to get access token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Use the access token for authenticated requests
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Posts Flow
```bash
# 1. Get all posts (public)
curl -X GET http://localhost:3001/posts

# 2. Create a new post (authenticated)
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"My Test Post","content":"This is a test post","tags":["test"]}'

# 3. Publish the post (authenticated)
curl -X PUT http://localhost:3001/posts/POST_ID/publish \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🚀 Architecture Features

This API implements:

- **Hexagonal Architecture** with clean separation of concerns
- **Vertical Slice Architecture** for feature-based organization
- **SOLID Principles** throughout the codebase
- **Domain-Driven Design** patterns
- **Repository Pattern** for data access
- **Use Case Pattern** for business logic
- **JWT Authentication** with Supabase integration
- **Input Validation** with class-validator
- **Global Exception Handling**
- **TypeScript** for type safety

## 📝 Notes

**Current Implementation Status:**
- ✅ Authentication module with Supabase integration
- ✅ Posts module with full CRUD operations
- ✅ In-memory repository (for development/testing)
- ✅ JWT-based authentication guards
- ✅ Input validation and error handling
- ✅ Hexagonal + Vertical Slice architecture
- 🔄 Supabase database integration (requires valid API keys)
- 🔄 Email verification and password reset (requires Supabase setup)

To enable full Supabase functionality, update the API keys in `.env` file with valid credentials from your Supabase dashboard.
