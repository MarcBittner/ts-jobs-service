
# ts-jobs-service

## Summary

The `ts-jobs-service` is a job search service application that allows users to create and manage job search configurations, view search results, and check application logs. The application is built with a TypeScript backend using Express and Sequelize for database management, and a React frontend for the user interface.

## Project Layout


ts-jobs-service/
├── backend/
│   ├── src/
│   ├── dist/
│   ├── build.sh
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── public/
    ├── src/
    ├── build/
    ├── package.json
    ├── tsconfig.json
    └── .env


## Instructions on How to Build

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

### Building the Project

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/ts-jobs-service.git
   cd ts-jobs-service
   ```

2. Build the backend and frontend:

   ```sh
   ./build.sh
   ```

   The `build.sh` script supports the following command-line switches:

   - `--major`: Increment the major version.
   - `--minor`: Increment the minor version.
   - `--patch`: Increment the patch version.

   Example:

   ```sh
   ./build.sh --minor --patch
   ```

3. Start the backend and frontend servers:

   ```sh
   ./run.sh
   ```

   This will start the backend server on port 4000 and the frontend server on port 3001.

## API Documentation

### Health Check

- **URL:** `/api/health`
- **Method:** `GET`
- **Description:** Returns a simple message indicating the API is up and running.
- **Response:**
  - Status: `200 OK`
  - Body: `API is up and running`

### Searches

#### Get All Searches

- **URL:** `/api/searches`
- **Method:** `GET`
- **Description:** Retrieves all search configurations.
- **Response:**
  - Status: `200 OK`
  - Body: Array of search configurations

#### Create a Search

- **URL:** `/api/searches`
- **Method:** `POST`
- **Description:** Creates a new search configuration.
- **Request Body:**
  - `keyword`: string (required)
  - `location`: string (required)
  - `refreshInterval`: number (required)
- **Response:**
  - Status: `201 Created`
  - Body: Created search configuration

#### Update a Search

- **URL:** `/api/searches/:id`
- **Method:** `PUT`
- **Description:** Updates an existing search configuration.
- **Request Body:**
  - `keyword`: string (optional)
  - `location`: string (optional)
  - `refreshInterval`: number (optional)
- **Response:**
  - Status: `200 OK`
  - Body: Updated search configuration

#### Delete a Search

- **URL:** `/api/searches/:id`
- **Method:** `DELETE`
- **Description:** Deletes an existing search configuration.
- **Response:**
  - Status: `200 OK`
  - Body: Deletion confirmation message

### Search Results

#### Get Search Results

- **URL:** `/api/searches/:id/results`
- **Method:** `GET`
- **Description:** Retrieves results for a specific search configuration.
- **Response:**
  - Status: `200 OK`
  - Body: Array of search results
```
