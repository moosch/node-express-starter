# Node Express Starter

This is a simple but complete boilerplate for a NodeJS REST API app using ExpressJS, validation with [Joi](https://joi.dev/), caching with [Redis](https://redis.io/), and database connection with [PostgreSQL](https://www.postgresql.org/).

There is clear separation between app layers to make code navigation a breeze.

# Application structure

Router -> Controller -> Service -> Persistence.

# Todo

- [ ] Add all the test
- [ ] Improve error handling, revisit logger use
- [ ] Add JWT auth refresh. Needs error response of "expired", and route to refresh to refresh_token
- [ ] Add Postgres and Redis into docker-compose
- [ ] Add NodeJS events to do cache updates
- [ ] Add scheduled cleanup worker for orphaned tokens (refresh token validity period)
