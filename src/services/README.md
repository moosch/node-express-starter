# Services

Services are domain-specific in what they handle. For example a `user-service` will _only_ handle user based requests.

Services either return what is expected, of they throw specific error types that the caller must handle.

They _could_ also return runtime errors, which, again, should be handled by the caller.

For this reason, there should be no need for `try/catch` in the service layer, with the exception of calling components that could have multiple error types, and wanting to bubble up specific error types. Think of error types as values.

Services should avoid calling other services directly. The calling controller should be where multiple services are called.
