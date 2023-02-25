# Node Express Starter

This is a simple but complete boilerplate for a NodeJS REST API app using ExpressJS, validation with [Joi](https://joi.dev/), caching with [Redis](https://redis.io/), and database connection with [PostgreSQL](https://www.postgresql.org/).

There is clear separation between app layers to make code navigation a breeze.

# Application structure

Router -> Controller -> Service -> Persistence.

# Tokens

The app has 2 types of tokens. **Access Tokens** and **Refresh Tokens**.

Access tokens are required on every request (except when signing in/up) as a header `"Authorization": "Bearer ..."`.

The **Access Token** has an expiry. When it expires, the client is expected to use the **Refresh Token** to generate a new **Access Token** for subsequent requests.

Upon signup or signin, the client will receive both an access and a refresh token:

```json
{
  "tokens": {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

# Todo

- [x] Improve error handling
- [ ] Revisit logger use
- [x] Add JWT auth refresh. Needs error response of "expired"
- [x] Add route to refresh tokens
- [ ] Add Postgres into docker-compose
- [ ] Add persistence layer for User
- [ ] Add persistence layer for UserTokens
- [ ] Add Redis into docker-compose
- [ ] Add caching functions for UserTokens
- [ ] Add NodeJS events to do cache updates
- [ ] Add scheduled cleanup worker for orphaned tokens (refresh token validity period)
- [ ] Add all the test
