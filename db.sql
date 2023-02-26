-- Drop and create the database. Definitely ONLY for local development.
DROP DATABASE IF EXISTS node_app;
CREATE DATABASE node_app;

-- Use the database
\c node_app

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT uuid_generate_v4 (),
  email varchar UNIQUE NOT NULL,
  password varchar,
  salt varchar,
  created_at BIGINT DEFAULT CAST (EXTRACT (epoch from current_timestamp) AS bigint),
  updated_at BIGINT,
  deleted_at BIGINT,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS user_tokens (
  id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL REFERENCES users(id),
  token varchar NOT NULL,
  created_at BIGINT DEFAULT CAST (EXTRACT (epoch from current_timestamp) AS bigint),
  PRIMARY KEY(token)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_tokens_token_idx ON user_tokens (token);

-- Sometimes need to change owner to postgres
ALTER TABLE users OWNER to postgres;
ALTER TABLE user_tokens OWNER to postgres;

-- To use uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
