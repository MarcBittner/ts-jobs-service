#!/usr/bin/env bash

# Start backend server on port 4000
echo "Starting backend server on port 4000..."
PORT=4000 node ./dist/index.js &
BACKEND_PID=$!

# Start frontend server on port 3001
echo "Starting frontend server on port 3001..."
PORT=3001 npm start --prefix ./frontend &
FRONTEND_PID=$!

# Function to handle script exit
cleanup() {
  echo "Shutting down servers..."
  if ps -p $BACKEND_PID > /dev/null; then
    kill $BACKEND_PID
    echo "Backend server stopped."
  fi
  if ps -p $FRONTEND_PID > /dev/null; then
    kill $FRONTEND_PID
    echo "Frontend server stopped."
  fi
}

# Trap exit signals to clean up
trap cleanup EXIT

# Wait for both processes to exit
wait $BACKEND_PID
wait $FRONTEND_PID

# Call cleanup to ensure both servers are stopped
cleanup
