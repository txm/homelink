# HomeLINK IoT Device Management API

A simple RESTful API for managing smart home IoT devices such as lights, thermostats, and cameras. Built with **Next.js App Router**, in-memory storage, and validated using **Zod**.

⚠️ I spent far too long — perhaps half the total time — trying to generate an OpenAPI spec.  
Zod may not have been the right choice for this task, or perhaps this will resolve with `zod@v8` and `zod-to-openapi@4`.  
A framework like NestJS might have provided this out of the box, without the pain or workaround overhead.

A Message Queue will help with scalability.

---

## ✅ Features

- Register a new device by type
- List all registered devices
- Get details of a specific device by ID
- Update a device’s status or name
- Delete a device

---

## 📦 Tech Stack

- **Next.js** (App Router, server handlers in `src/app/api`)
- **TypeScript**
- **Zod** for schema validation
- **Vitest** for unit testing
- **In-memory store** (`Map`) to manage device state

---

## 🔮 Future Enhancements

- 🔁 Shared or persistent datastore (e.g. SQLite, Redis, etc.)
- 🧪 Supertest for endpoint integration tests
- 📄 OpenAPI spec generation
- 🐳 Docker containerisation
- 🔐 Husky for precommit/test automation
- ❌ Remove unused React runtime
- 🧪 GitHub Actions or CI pipelines
- 🌐 Dev / QA / UAT / Prod environments

---

## 🚀 Getting Started

```bash
# Move into the API project directory
cd hub

# Install dependencies
npm install

# Run the dev server (Next.js)
npm run dev

# Run all unit tests
npm test

# 📚 API Endpoints

## ➕ Register a Device

**POST** `/api/devices/[type]`

Registers a new device of type `light`, `thermostat`, or `camera`.

### Request Body

```json
{
  "name": "Living Room Light",
  "status": { "on": true }
}
```

### Response `201 Created`

```json
{
  "id": "uuid-1234",
  "name": "Living Room Light",
  "type": "light",
  "status": { "on": true }
}
```

### Errors

* `400 Bad Request` — Invalid device type or missing fields
* `500 Internal Server Error` — Unexpected failure

---

## 📄 List All Devices

**GET** `/api/devices`

Retrieves all registered devices.

### Response `200 OK`

```json
[
  {
    "id": "uuid-1234",
    "name": "Living Room Light",
    "type": "light",
    "status": { "on": true }
  },
  ...
]
```

---

## 🔍 Get Device by ID

**GET** `/api/devices/[id]`

Returns the details of a specific device.

### Response `200 OK`

```json
{
  "id": "uuid-1234",
  "name": "Living Room Light",
  "type": "light",
  "status": { "on": true }
}
```

### Errors

* `404 Not Found` — Device not found

---

## 🔧 Update Device

**PATCH** `/api/devices/[id]`

Partially updates a device's name or status.

### Request Body

```json
{
  "name": "Updated Name",
  "status": { "on": false }
}
```

### Response `200 OK`

```json
{
  "id": "uuid-1234",
  "name": "Updated Name",
  "type": "light",
  "status": { "on": false }
}
```

### Errors

* `400 Bad Request` — Invalid request body
* `404 Not Found` — Device not found

---

## ❌ Delete Device

**DELETE** `/api/devices/[id]`

Removes a device from the system.

### Response `200 OK`

```json
{ "success": true }
```

### Errors

* `404 Not Found` — Device not found
