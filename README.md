# Node Express Starter

This is a simple boilerplate for setting up a NodeJS app with Express that handles errors from validation (using Joi) and the controller and service layers.

# Folder structure

You'll notice that under `src/` there is a `rest` and an `service` folder. There are two reasons for this:

*To separate the rest endpoint from any services.*
Services in an app should be capable of being accessed from anywhere, not just the traditional `route -> controller -> service`. One service should be able to call another without going through this path.

*To allow for access/protocols other than rest*
An app may accept calls from HTTP, RPC, TCP etc. Separation of services from an access-specific location makes this easier.


# Todo

* Add all the test
* Improve error handling
  - stack trace
  - make sure DB errors are caught


## License

MIT Licensed. Use all you like at your own risky fun.
Go nuts.

Made from stardust ✨ [@moosch](https://github.com/moosch)
