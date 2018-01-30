
# From here you can define all the udfs that you want to use from your Spark SQL queries.
# getSite(url) is intended as an example of what can be accomplished with UDFs.

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
