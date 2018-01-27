# sparksql-dashboard
Provides a cherrypy dashboard to bind access to Spark SQL.

## About
The SparkSQL-Dashboard is a dashboard designed for Spark. With this you will be able to query
to your data based in JSON or parquet and generate graphs or tables to compose data analytics
dashboards.

## Installation instructions
To generate the aggregated tables a.k.a generate smaller tables from raw tables to
run your queries faster:

    spark-submit src/Dashboard/aggregations.py

To run the dashboard:

    spark-submit src/Dashboard/dashboard.py

If you prefer you can use Docker scripts to perform the installation (have a careful
read of the scripts to understand the installation steps):

    ./install.sh
    ./run.sh
