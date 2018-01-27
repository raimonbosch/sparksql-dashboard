# Creates parquet tables with the main aggregations used by the dashboard
# Run: /opt/spark-2.1.0-bin-hadoop2.7/bin/spark-submit aggregations.py

def getSite(url):
    if "nightnyc.net" in url:
        return 'nyc'
    if "nightlondon.co.uk" in url:
        return 'lon'

    return 'none'
