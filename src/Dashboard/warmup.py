
# Reads from config/queries.json and launches the cacheable queries (indexed=true) against the dashboard.
# This way, some Spark SQL queries will be cached during all day and no extra work will be done.
# Run: python warmup.py

import httplib, urllib
import time

from queries import *

def launch_query_to_dashboard(query):
    params = urllib.urlencode({'sql': query})
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

    conn = httplib.HTTPConnection("localhost:8080")
    conn.request("POST", "/sql", params, headers)

    response = conn.getresponse()
    print response.status, response.reason
    data = response.read()
    conn.close()
    return data

start = time.time()

for query in queries:
    if "indexed" in query and query["indexed"] == True:
        sqls = query["query"].split(';')
        for sql in sqls:
            data = launch_query_to_dashboard(sql)
            print(data)

print("Warmup took %s seconds." % (time.time() - start))
