# About real world app:

https://github.com/gothinkster/realworld

# Docker

`docker-compose up`

# Run postman's tests:

`APIURL=http://localhost:3000/api ./run-api-tests.sh`

# Migrations:

If you have changed an entity you can generate a migration:

`npx ts-node ./node_modules/.bin/typeorm migration:generate -n NameOfYourChanges`

It will generate the migration with necessary sql scripts.

Then you should run this migration:

`npx ts-node ./node_modules/.bin/typeorm migration:run`

It will apply your changes to the db.

If you decide to revert these changes you can run this:

`npx ts-node ./node_modules/.bin/typeorm migration:revert`
