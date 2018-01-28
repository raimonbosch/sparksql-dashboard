#!/bin/sh

# To use this installation script you will need Docker.
# For a manual installation follow the steps defined into the Dockerfile.

echo "Building docker sparksql-dashboard container..."
docker build -t sparksql-dashboard:latest .

echo "Creating aggregated tables..."
docker run -v $(pwd):/dashboard -e DASHBOARD_HOME=/dashboard -w /dashboard sparksql-dashboard:latest /opt/spark/bin/spark-submit src/Dashboard/aggregations.py
