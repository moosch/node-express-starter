# Models

The models contain the shape of the data structures used by both the consuming client(s) and a schema for caching (only for `UserToken` in this example).

Both main classes extend `Serializable`, which defines that the models have the methods to convert to and from a JavaScript object (`dynamic`).

These do not _have_ to be classes, they could be a simple TypeScript interface and functions. Equally, they could be defined as part of whatever database ORM is used, such as MongoDB's models with [`mongooese`](https://mongoosejs.com/), or [`Sequalize`](https://sequelize.org/) schemas.
