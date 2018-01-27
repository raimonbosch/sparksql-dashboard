import json
import os

queriesj = open(os.environ["DASHBOARD_HOME"] + '/resources/queries.json').read().replace('\n', ' ').replace('\t', ' ')
queries = json.loads(queriesj)

queries_hash = {}
for element in queries:
    queries_hash[element['id']] = element

if __name__ == '__main__':
    f = open(os.environ['DASHBOARD_HOME'] + '/js/queries.js', 'w')
    f.write('var queries = ' + json.dumps(queries) + ';')
    f.close()
    print "Queries.js recreated."
