# Start development:
`npm run dev`

# Run tests:
`APIURL=http://localhost:3000/api ./run-api-tests.sh`

# About real world app's api spec:
`https://github.com/gothinkster/realworld/tree/master/api#realworld-api-spec`

# Migrations:

If you have changed an entity you can generate a migration:

`npx ts-node ./node_modules/.bin/typeorm migration:generate -n NameOfYourChanges`

It will generate the migration with necessary sql scripts.

Then you should run this migration:

`npx ts-node ./node_modules/.bin/typeorm migration:run`

It will apply your changes to the db.

If you decide to revert these changes you can run this:

`npx ts-node ./node_modules/.bin/typeorm migration:revert`

