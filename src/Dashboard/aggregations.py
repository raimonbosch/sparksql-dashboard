
import time
import shutil
import os

from pyspark.sql import SQLContext
from pyspark import  SparkContext
from udfs import *

def initSparkContext():
    sc = SparkContext()
    sqlContext = SQLContext(sc)
    sqlContext = registerUdfs(sqlContext)

    tableContext = sqlContext.read.json(os.environ["DASHBOARD_HOME"] + '/db/json/dataset*/*')
    tableContext.registerTempTable("googleanalytics")

    return sqlContext

def create_table_from_query(sqlContext, query, table):
    df = sqlContext.sql(query)
    path = os.environ['DASHBOARD_HOME'] + '/db/parquet/' + table
    if os.path.exists(path):
        shutil.rmtree(path)
    df.write.parquet(path)

start = time.time()
sqlContext = initSparkContext()

create_table_from_query(
     sqlContext, 
     """
     SELECT 
         sum(sessions) as sum_sessions, 
         avg(sessions) as avg_sessions, 
         date 
     FROM googleanalytics 
     GROUP BY date 
     ORDER BY date asc 
     """, 
     "googleanalytics_by_date"
)

create_table_from_query(
      sqlContext,
      """
      SELECT 
          sum(sessions) as sum_sessions, 
          avg(sessions) as avg_sessions, 
          date, 
          site 
      FROM googleanalytics 
      GROUP BY date, site 
      ORDER BY sum_sessions desc 
      """, 
      "googleanalytics_by_date_site"
)

print("Import took %s seconds." % (time.time() - start))
