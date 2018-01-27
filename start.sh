#!/bin/sh
PORT=8080

echo "The service will be available at http://localhost:${PORT}/"
sleep 1

#Execution of cherrypy dashboard
docker run -v $(pwd):/dashboard -p ${PORT}:${PORT} -e DASHBOARD_HOME=/dashboard -w /dashboard sparksql-dashboard:latest /opt/spark/bin/spark-submit src/Dashboard/dashboard.py
