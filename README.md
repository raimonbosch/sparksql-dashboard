# sparksql-dashboard
Provides a cherrypy dashboard to bind access to Spark SQL.

## About
The SparkSQL-Dashboard is a dashboard designed for Spark. You can generate graphs and compose data analytics dashboards from Spark SQL queries.

## Installation instructions
In the first step we create aggregated tables. The aim of aggregated tables is to generate faster and smaller tables i.e. creating a table with the results of a GROUP BY of a bigger table:

    export DASHBOARD_HOME=$(pwd)
    spark-submit src/Dashboard/aggregations.py

Once you have this aggregated data, you can run the dashboard:

    export DASHBOARD_HOME=$(pwd)
    spark-submit src/Dashboard/dashboard.py

The dashboard by default will connect to your host IP into the port 8080.

## Docker Installation instructions
If you prefer you can use Docker scripts to perform the installation (have a careful
read of the scripts to understand the installation steps):

    ./install.sh
    ./start.sh

Docker scripts will launch the dashboard on http://localhost:8080/
