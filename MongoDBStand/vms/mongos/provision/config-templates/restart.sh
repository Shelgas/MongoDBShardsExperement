mongo "admin" --quiet --eval "db.items.remove({})"
mongo "test" --quiet --eval "db.dropDatabase()"
mongo "admin" --quiet --eval "sh.enableSharding('test'); db.runCommand({ shardCollection: 'test.items', key: { shardKey: 'hashed' } })"