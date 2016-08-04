// `karma` will run this script before running the test scripts.
// In the browser, `ga` is a global variable loaded trough a `script` tag.
// If we don't make `ga` a dummmy global variable here, Webpack won't associate
// it to the `google-analytics` "module" in `getConfiguredStore` and the tests will fail
// even though we don't use the real Google Analytics in testing:
var ga = function() {
  console.log('This global function should have been mocked out.');
}
