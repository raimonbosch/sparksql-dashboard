
# From here you can define all the udfs that you want to use from your Spark SQL queries.
# getSite(url) is intended as an example of what can be accomplished with UDFs.

def getSite(url):
    if "nightnyc.net" in url:
        return 'nyc'
    if "nightlondon.co.uk" in url:
        return 'lon'

    return 'none'
