
# Loads configuration variables defined in the context.yml

# Also, it generates the queries.js (used by the admin-graph.html) if it is executed via "python queries.py".
# If it is used as an import "import queries" it loads all queries - defined in resources/queries.json - in a variable.


import json
import yaml
import os

context = {}
with open(os.environ['DASHBOARD_HOME'] + '/conf/context.yml', 'r') as stream:
    try:
        context = yaml.load(stream)
    except yaml.YAMLError as exc:
        print(exc)

queriesj = open(os.environ['DASHBOARD_HOME'] + '/resources/queries.json').read().replace('\n', ' ').replace('\t', ' ')
queries = json.loads(queriesj)

queries_hash = {}
for element in queries:
    queries_hash[element['id']] = element

if __name__ == '__main__':
    f = open(os.environ['DASHBOARD_HOME'] + '/js/queries.js', 'w')
    f.write('var queries = ' + json.dumps(queries) + ';')
    f.write('var context = ' + json.dumps(context) + ';')
    f.close()
    print "Queries.js recreated."
