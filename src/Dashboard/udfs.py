# Creates parquet tables with the main aggregations used by the dashboard
# Run: /opt/spark-2.1.0-bin-hadoop2.7/bin/spark-submit aggregations.py

from pyspark.sql.types import StringType

def getSite(url):
    if "nightnyc.net" in url:
        return 'nyc'
    if "nightlondon.co.uk" in url:
        return 'lon'

    return 'none'

def registerUdfs(sqlContext):
    sqlContext.udf.register("getSite", getSite, StringType())
    return sqlContext
