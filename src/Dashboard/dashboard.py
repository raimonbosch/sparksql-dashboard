
# Contains the cherrypy server necessary to start the dashboard server.
# This is the bridge between Spark SQL and the frontend.
# Run: spark-submit dashboard.py

import cherrypy
import json
import os
import time
import re
import socket

from pyspark.sql import SQLContext
from pyspark import SparkConf, SparkContext
from queries import *
from udfs import *

def initSparkContext(tables):
    conf = SparkConf().set("spark.driver.allowMultipleContexts", "true")
    sc = SparkContext(conf=conf)
    sqlContext = SQLContext(sc)
    sqlContext = registerUdfs(sqlContext)

    return sqlContext

def doQuery(sql):
    sql = re.sub('[\s\n\r]+', ' ', sql)
    sql = sql.strip()
    key = time.strftime("%Y%m%d") + ' ' + sql

    if key in cache:
        print "[DEBUG] Query in cache" + key
        result = cache[key]
    else:
        print "[DEBUG] Query not in cache" + key
        loadTablesInQuery(sql)
        df = sqlContext.sql(sql)
        result = map(lambda x: x.asDict(), df.collect())
        cache[key] = result
    return result

def loadContexts():
    return context['tables']

def loadTablesInQuery(sql):
    subject = ' ' + sql + ' '
    tables = list(set(re.findall(' FROM ([^\s]+) ', subject) + re.findall(' from ([^\s]+) ', subject)))
    for table in tables:
        if len(list(set([table]) & set(sqlContext.tableNames()))) == 0:
            initTableContext(table)

def initTableContext(table):
    contexts = loadContexts()
    if table in contexts:
        if "parquet" in contexts[table]:
            tableContext = sqlContext.read.parquet(contexts[table])
        else:
            tableContext = sqlContext.read.json(contexts[table])
        tableContext.registerTempTable(table)
 
def prepareUi(id):
    ui = {}
    if 'shared' in queries_hash[id]:
        ui['shared'] = queries_hash[id]['shared']
    else:
        ui['shared'] = False
    
    if 'type' in queries_hash[id]:
        ui['type'] = queries_hash[id]['type']
    else:
        ui['type'] = 'line'
    
    if 'filter' in queries_hash[id]:
        ui['filter'] = queries_hash[id]['filter'].copy()
    else:
        ui['filter'] = {}
    
    return ui

def filterResults(results, filters, params):
    for key in filters.keys():
        filters[key] = replaceFilters(filters[key], params)
    
    resultListOut = []
    filterSet = set(filters.values())
    
    for (i, result) in enumerate(results):
        resultsOut = []
        for (j, element) in enumerate(result):
            if filterSet.issubset(set(element.values())) == True:
                #now the filtered field is redundant
                elementNew = element.copy()
                for key in filters.keys():
                    del elementNew[key]
                resultsOut.append(elementNew)
        
        resultListOut.append(resultsOut)
    
    return resultListOut  

def replaceFilters(str, params):
    for key in context['parameters']:
        paramName = context['parameters'][key]
        if 'params[' + key + ']' in params:
            str = str.replace(paramName, params['params[' + key + ']'])
    
    return str

def getIpAddress():
    return socket.gethostbyname(socket.gethostname())

class DashboardSpark(object):
    
    def __init__(self, sqlContext):
        self.sqlContext = sqlContext
    
    @cherrypy.expose
    def sql(self, sql):
        result = doQuery(sql)
        return json.dumps(result, sort_keys=True)
    
    @cherrypy.expose
    def queries(self, **params):
        ui = {}
        sql = params['sql']
        if sql.startswith("id:"):
            id = sql.replace("id:", "")
            sql = queries_hash[id]['query']
            ui = prepareUi(id)

        if 'params[id]' in params:
            ui = prepareUi(params['params[id]'])

        sql = re.sub(r'[\n\t\r]+', ' ', sql)
        sql = replaceFilters(sql, params)
            
        results = []
        for query in sql.split(';'):
            results.append(doQuery(query))

        if 'filter' in ui and len(ui['filter']) > 0:
            results = filterResults(results, ui['filter'], params)

        return json.dumps({'results': results, 'ui': ui}, sort_keys=True)

    @cherrypy.expose
    def graph(self, site="all", date="2017-11-10"):
        return file(os.environ["DASHBOARD_HOME"] + "/app/html/admin-graph.html")

    @cherrypy.expose
    def index(self, site="all", date="2017-11-10"):
        return file(os.environ["DASHBOARD_HOME"] + "/app/html/summary.html")

    @cherrypy.expose
    def year(self, site="all", year="2017"):
        return file(os.environ["DASHBOARD_HOME"] + "/app/html/year-summary.html")


sqlContext = initSparkContext([])
cherrypy.server.socket_host = getIpAddress()

cache = {}

conf = {
    '/js': {
        'tools.staticdir.on': True, 
        'tools.staticdir.dir': os.environ['DASHBOARD_HOME'] + '/app/js/'
    },
    '/css': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.environ['DASHBOARD_HOME'] + '/app/css/'
    },
    '/images': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.environ['DASHBOARD_HOME'] + '/app/images/'
    },
    '/html': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.environ['DASHBOARD_HOME'] + '/app/html/'
    }
}

cherrypy.quickstart(DashboardSpark(sqlContext), '/', config=conf)
