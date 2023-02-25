# Controllers

The controllers are where we extract data from the request and context, calling the service layer, then sending responses to the client.

They do all of the orchestration, which can be quite a lot for the more complex requests such as signup.

Once the service call(s) are resolved, the controller constructs the appropriate response.

It's also a place to handle any specific error types for that request path.

This application uses `Error`s as values, which some believe to be an antipattern, but I like the way Golang does it, and I feel it works effectively to explicitly handle error types.
