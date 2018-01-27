#Creates parquet tables with the main aggregations used by the dashboard
#Run: spark-submit performance.py

import json
import shutil
import os
import time

from pyspark.sql import SQLContext
from pyspark import SparkConf, SparkContext

def init_spark_context():
    sc = SparkContext()
    sqlContext = SQLContext(sc)

    tableContext = sqlContext.read.json(os.environ["DASHBOARD_HOME"] + "/db/json/dataset1/*")
    tableContext.registerTempTable("googleanalytics")
    return sqlContext

def run_query(query):
    return sqlContext.sql(query)

start = time.time()
sqlContext = init_spark_context()

df = run_query("""
     SELECT 
         sum(sessions) as sum_sessions, 
         avg(sessions) as avg_sessions, 
         date 
     FROM googleanalytics 
     GROUP BY date 
     ORDER BY date asc
     """)

print("============================================")
print("Performance test took %s seconds." % (time.time() - start))
print("============================================")
