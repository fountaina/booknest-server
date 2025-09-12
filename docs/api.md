# 📚 BookNest API Documentation

Base URL:

```
/api/books
```

---

## **Endpoints Overview**

| Method | Endpoint | Description             | Access    |
| ------ | -------- | ----------------------- | --------- |
| GET    | `/`      | Get all books           | Public    |
| GET    | `/:id`   | Get a single book by ID | Public    |
| POST   | `/`      | Create a new book       | Private\* |
| PATCH  | `/:id`   | Update an existing book | Private\* |
| DELETE | `/:id`   | Delete a book           | Private\* |

> **Private\***: Requires authentication (JWT or session-based authentication recommended).

---

## **1. Get All Books**

**Request**

```http
GET /api/books
```

**Description**
Retrieves all books in the store, including metadata like pricing, stock, ratings, etc.

**Response Example**

```json
[
  {
    "_id": "64d1234567abcd8901ef1234",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "ISBN": "9780743273565",
    "publisher": "Scribner",
    "publishedDate": "1925-04-10T00:00:00.000Z",
    "edition": "1st",
    "language": "English",
    "genres": ["Fiction", "Classic"],
    "description": "A novel set in the Jazz Age exploring themes of wealth, society, and the American Dream.",
    "pageCount": 218,
    "coverImage": {
      "url": "https://example.com/images/gatsby.jpg",
      "altText": "The Great Gatsby book cover"
    },
    "price": 4500,
    "currency": "NGN",
    "stock": 12,
    "ratings": {
      "average": 4.5,
      "count": 320
    },
    "createdAt": "2025-08-11T12:00:00.000Z",
    "updatedAt": "2025-08-11T12:10:00.000Z"
  }
]
```

**Status Codes**

* `200 OK` – Books retrieved successfully
* `500 Internal Server Error` – Server error

---

## **2. Get a Book by ID**

**Request**

```http
GET /api/books/:id
```

**Path Parameter**

* `id` *(string, required)* – MongoDB ObjectId of the book

**Response Example**

```json
{
  "_id": "64d1234567abcd8901ef1234",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "ISBN": "9780743273565",
  "publisher": "Scribner",
  "publishedDate": "1925-04-10T00:00:00.000Z",
  "edition": "1st",
  "language": "English",
  "genres": ["Fiction", "Classic"],
  "description": "A novel set in the Jazz Age exploring themes of wealth, society, and the American Dream.",
  "pageCount": 218,
  "coverImage": {
    "url": "https://example.com/images/gatsby.jpg",
    "altText": "The Great Gatsby book cover"
  },
  "price": 4500,
  "currency": "NGN",
  "stock": 12,
  "ratings": {
    "average": 4.5,
    "count": 320
  },
  "createdAt": "2025-08-11T12:00:00.000Z",
  "updatedAt": "2025-08-11T12:10:00.000Z"
}
```

**Status Codes**

* `200 OK` – Book found
* `404 Not Found` – No book found with the given ID
* `500 Internal Server Error` – Server error

---

## **3. Create a New Book**

**Request**

```http
POST /api/books
Content-Type: application/json
```

**Required Fields**

* `title` *(string)*
* `author` *(string)*
* `price` *(number, ≥ 0)*

**Optional Fields**

* `ISBN`, `publisher`, `publishedDate`, `edition`, `language` (default: `"English"`),
  `genres` (array of strings), `description`, `pageCount` (≥ 1),
  `coverImage` (object with `url` & `altText`), `currency` (default: `"NGN"`),
  `stock` (≥ 0), `ratings` (average 0–5, count ≥ 0)

**Example Request Body**

```json
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "ISBN": "9780061120084",
  "publisher": "J.B. Lippincott & Co.",
  "publishedDate": "1960-07-11",
  "edition": "1st",
  "language": "English",
  "genres": ["Fiction", "Classic"],
  "description": "A timeless novel about racial injustice in the Deep South.",
  "pageCount": 281,
  "coverImage": {
    "url": "https://example.com/images/mockingbird.jpg",
    "altText": "To Kill a Mockingbird cover"
  },
  "price": 5500,
  "currency": "NGN",
  "stock": 25,
  "ratings": {
    "average": 4.8,
    "count": 500
  }
}
```

**Response Example**

```json
{
  "message": "Book Created successfully",
  "createdBook" : {
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "ISBN": "2332",
      "language": "English",
      "genres": [],
      "price": 5500,
      "currency": "NGN",
      "stock": 25,
      "ratings": {
        "average": 4.6,
        "count": 20
      },
      "_id": "689cc3f582e78e04fcd6b645",
      "createdAt": "2025-08-13T16:57:25.952Z",
      "updatedAt": "2025-08-13T16:57:25.952Z"
  }
}
```

**Status Codes**

* `201 Created` – Book added
* `400 Bad Request` – Missing required fields or invalid data
* `500 Internal Server Error` – Server error

---

## **4. Update a Book**

**Request**

```http
PATCH /api/books/:id
Content-Type: application/json
```

**Path Parameter**

* `id` *(string, required)* – Book ID

**Example Request Body (Partial Update)**

```json
{
  "stock": 30,
  "price": 6000
}
```

**Response Example**

```json
{
  "message": "Book Updated successfully",
  "updatedBook": {
    "_id": "64d1234567abcd8901ef1234",
    "title": "The Great Gatsby",
    "price": 6000,
    "stock": 30,
    "updatedAt": "2025-08-11T13:00:00.000Z"
  }
}
```

**Status Codes**

* `200 OK` – Updated successfully
* `404 Not Found` – Book not found!
* `500 Internal Server Error` – Server error

---

## **5. Delete a Book**

**Request**

```http
DELETE /api/books/:id
```

**Path Parameter**

* `id` *(string, required)* – Book ID

**Response Example**

```json
{
  "message": "Book deleted successfully"
}
```

**Status Codes**

* `204 No Content` – Deleted successfully
* `404 Not Found` – Book not found!
* `500 Internal Server Error` – Server error

---

## **Notes**

* **Timestamps**: `createdAt` and `updatedAt` are automatically managed.
* **Currency** defaults to `"NGN"` but can be changed.
* **ISBN** is optional but unique when provided.
* **Ratings**: average is between 0–5, count ≥ 0.
* All IDs are MongoDB ObjectIds.

---
