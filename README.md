* to run tests: `npm test`
* `./bin/www` to run app

#### Heroku

If using heroku, then run the following commands:

* `heroku create`
* `heroku info` to get name of app on heroku
* `git remote add heroku git@heroku.com:HEROKUAPPNAME.git` (TODO check on actual command arg structure)
* `git push heroku master` to deploy app to heroku environment
* `heroku config:add NODE_ENV=production` for environment specification (determines redis datastore number)
* `heroku ps:scale web=1` to create single free tier webserver
* `heroku open` to view app on heroku server

#### Redis

* for local testing, use `redis-server`