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
#LOG_FILE="${logFileName-"${me}.$(date +%FT%T%Z).log"}"
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


  importModules=(
              "dotenv"
              "node-schedule"
              "axios"
              "csv-writer"
              "ffs"
              "linkedin-api-client"
              )

# Optionally set -x with a friendly variable

[[ bash_debug -gt 0 ]] && set -x

# Clear old builds
_bashlog info "$(rm -f ./dist/*.js 2>&1 | tee /dev/tty)"
_bashlog info "$(rm -f ./src/*.js 2>&1 | tee /dev/tty)"

# Install dependencies
_bashlog info "$(npm install 2>&1 | tee /dev/tty)"

# Compile TypeScript files
_bashlog info "$(npx tsc --build --listEmittedFiles 2>&1 | tee /dev/tty)"
