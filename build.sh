#!/usr/bin/env bash


unset me executionDirectory sourceDirectory runtime importFiles binaryRequirements tapRequirements
set -a
runtime="$(date +%y%m%d_%H%M%S)"
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
executionDirectory="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
sourceDirectory="$( cd -- "$(dirname -- "$(readlink -- "${BASH_SOURCE[0]}")")" >/dev/null 2>&1 && pwd )"

#SYSLOG_FACILITY='local7'
LOG_TAG='ts-jobsearch-service-build' # Optional syslog app name
LOG_LEVEL='DEBUG'
DATETIME_FORMAT="+%Y-%m-%dT%H:%M:%S%z" # "+%FT%T%Z"
LOG_FILE="${logFileName-"${me}.log"}"

# Define imports
importFiles=(
    "${variablesFile-"build.variables"}"
    "${functionsFile-"build.functions"}"
    "${bashlogFile-"build.bashlog"}"
)

[ -r ${importFile} ] && . ./lib/build.variables
[ -r ${importFile} ] && . ./lib/build.functions
[ -r ${importFile} ] && . ./lib/build.bashlog

# Backend and frontend directories
BACKEND_DIR="."
FRONTEND_DIR="./frontend"

# Optionally set -x with a friendly variable
[[ bash_debug -gt 0 ]] && set -x

# Clear old builds
_bashlog info "$(rm -f $BACKEND_DIR/dist/*.js 2>&1 | tee /dev/tty)"
_bashlog info "$(rm -f $BACKEND_DIR/src/*.js 2>&1 | tee /dev/tty)"

# Install backend dependencies
_bashlog info "Installing backend dependencies..."
_bashlog info "$(npm install --prefix $BACKEND_DIR 2>&1 | tee /dev/tty)"

# Compile backend TypeScript files
_bashlog info "Compiling backend TypeScript files..."
_bashlog info "$(npx tsc --build $BACKEND_DIR --listEmittedFiles 2>&1 | tee /dev/tty)"

# Install frontend dependencies
_bashlog info "Installing frontend dependencies..."
_bashlog info "$(npm install --prefix $FRONTEND_DIR 2>&1 | tee /dev/tty)"

# Build the frontend for production
_bashlog info "Building the frontend for production..."
_bashlog info "$(npm run --prefix $FRONTEND_DIR build 2>&1 | tee /dev/tty)"

# Finalize
_bashlog info "Build process completed."
