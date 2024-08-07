
# ts-jobs-service

## Summary

The `ts-jobs-service` is a job search service application that allows users to create and manage job search configurations, view search results, and check application logs. The application is built with a TypeScript backend using Express and Sequelize for database management, and a React frontend for the user interface.

## Build Instructions

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

## Setting Up Environment Variables

To properly configure your application, you'll need to set up environment variables. This guide will walk you through the steps to create a `.env` file and set the necessary variables.

### Step 1: Copy the Sample Environment File

First, you need to copy the sample environment file. This file usually contains example environment variables and their respective values. Run the following command to copy the sample file to a new `.env` file:

```sh
cp env .env
```

### Step 2: Set the Environment Variables

Open the newly created `.env` file in a text editor. You'll need to set various environment variables that the application uses. Below are the variables you need to set and a brief explanation of each:

#### LinkedIn API Configuration

You need to provide your LinkedIn access token to enable the application to interact with the LinkedIn API.

```env
LINKEDIN_ACCESS_TOKEN=your_access_token_here
```

#### Job Search Interval

This variable sets the interval for job searches. The value is in milliseconds.

```env
JOB_SEARCH_INTERVAL=60000 # Interval in milliseconds
```

#### Database Configuration

Set the database configuration variables to connect to your database.

```env
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_HOST=your_database_host
DB_PORT=your_database_port
```

#### Logging Configuration

Specify the path where the log file will be stored.

```env
LOG_FILE_PATH=./logs/app.log
```

#### React Application Configuration

These variables are used to configure the React application, such as setting the application name and version.

```env
REACT_APP_NAME=ts-jobs-service
REACT_APP_VERSION=0.1.0
```

### Example `.env` File

Here is an example of what your `.env` file might look like after setting the variables:

```env
# LinkedIn API configuration
LINKEDIN_ACCESS_TOKEN=your_access_token_here

# Job search interval
JOB_SEARCH_INTERVAL=60000 # Interval in milliseconds

# Database configuration
DB_USERNAME=postgres
DB_PASSWORD=""
DB_NAME=job_service
DB_HOST=localhost
DB_PORT=5432

# Logging configuration
LOG_FILE_PATH=./logs/app.log

# React application configuration
REACT_APP_NAME=ts-jobs-service
REACT_APP_VERSION=0.1.0
```

### Final Steps

After setting the environment variables, save the `.env` file and restart your application to ensure the new configurations are loaded. This setup will ensure that your application is correctly configured with the necessary environment variables.

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
