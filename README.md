# JWT Bearer Token From Azure AD Example

Here's how to integrate Azure AD authentication with a Node.js REST API, for example. Specifically, here are the details on verifying an Azure AD-generated JWT Bearer Token.

## TL;DR

- `git clone` or download the project
- In `index.js` paste your Bearer token string (Base64, no "Bearer " prefix) into the `token` variable
- Paste your public key X.509 Certificate string (without PEM prefix/suffix) into the `x5tString` variable
- Run `npm install` and then `node .` from the command-line

If your token is printed out on the console then verification succeeded. Otherwise, an error message will be displayed.

Consider using additional [verify options](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) for improved security once you have the basic public key verification working.

## Recommended Reading - Background

Let's say that you have an API endpoint using Node.js (Express, LoopBack, Feathers, etc.) and you want to accept [JWT Bearer Tokens](https://jwt.io/introduction/#how-do-json-web-tokens-work-) issued by [Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-dev-understanding-oauth2-implicit-grant). This is a terrific, stateless way of doing single-sign-on (SSO) between say, Microsoft Office 365 or SharePoint and your own custom single-page application (SPA).

You'll find some [good examples](https://github.com/matt-ankerson/vue-adal) for using [ADAL](https://github.com/AzureAD/azure-activedirectory-library-for-js) within the browser to get the Microsoft Azure AD-signed Bearer Token.

However, what is perhaps not so clear is how to **verify** the Bearer token on the Node.js side in your API code. This little example and README is a show-and-tell on the "trick" needed to perform the JWT Bearer token verification.

## Start Down the Rabbit Hole

I'm going to say right off the bat that Microsoft seems to make this whole thing a bit more complicated than it has to be. I started by reading [this](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-token-and-claims#validating-tokens) article, which tells me to examine [this](https://login.microsoftonline.com/common/.well-known/openid-configuration) online JSON document that contains a `"jwks_uri"` value pointing to [this URI](https://login.microsoftonline.com/common/discovery/keys) where the actual public keys are stored.

The public keys are provided in JSON format as well, and you must cross-reference into them to find the right one for your particular Office 365 tenancy presumably.

Let me explain what I mean by "cross-reference". Here's what the public keys JSON file looks like. Notice that there are 3 elements (objects) in the array of public key data (as of this writing).

```javascript
{
  "keys": [
    {
      "kty":"RSA",
      "use":"sig",
      "kid":"z44wMdHu8wKsumrbfaK98qxs5YI",
      "x5t":"z44wMdHu8wKsumrbfaK98qxs5YI",
      "n":"p3HhMQsqmgSjeiDsZ1ay...",
      "e":"AQAB",
      "x5c": ["MIIDBTCCAe2gAwIBAgIQaD0..."]
    },
    {
      "kty":"RSA",
      "use":"sig",
      "kid":"SSQdhI1cKvhQEDSJxE2gGYs40Q0",
      "x5t":"SSQdhI1cKvhQEDSJxE2gGYs40Q0",
      "n":"pJUB90EMxiNjgkVz5CLL...",
      "e":"AQAB",
      "x5c":["MIIDBTCCAe2gAwIBAgIQHJ7yHxN..."]
    },
    {
      "kty":"RSA",
      "use":"sig",
      "kid":"2S4SCVGs8Sg9LS6AqLIq6DpW-g8",
      "x5t":"2S4SCVGs8Sg9LS6AqLIq6DpW-g8",
      "n":"oZ-QQrNuB4ei9ATYrT61ebPt...",
      "e":"AQAB",
      "x5c":["MIIDKDCCAhCgAwIBAgIQBH..."]
    }
  ]
}
```

The main index into the objects in the array is the `"x5t"` value:

- `z44wMdHu8wKsumrbfaK98qxs5YI`,
- `SSQdhI1cKvhQEDSJxE2gGYs40Q0`, or
- `2S4SCVGs8Sg9LS6AqLIq6DpW-g8`

Following so far? Great.

## Cross-Reference Azure AD-Issued Token to get the Correct Public Key

To determine which public key your particular Bearer token can be verified with, examine the corresponding `"x5t"` value in the **header** section of **your** Bearer token.

Then, from the matching object in the `keys` array (shown above and as mentioned above, available [here]((https://login.microsoftonline.com/common/discovery/keys))), take the `"x5c"` value to construct your actual public key for token verification purposes.

## Construct the Public Key

Now that you have the correct `"x5c"` string you're almost ready to verify your Bearer token! Wow, right?

The "trick" in this final step is to note that the `"x5c"` string is, as the label implies, an [X.509 Certificate](https://en.wikipedia.org/wiki/X.509).

Therefore, to successfully use this `"x5c"` string as a public key argument to a JWT token verification call, you need to perform a small string concatenation to put it into the [expected PEM format](https://en.wikipedia.org/wiki/X.509#Certificate_filename_extensions) (also see [here](https://en.wikipedia.org/wiki/Privacy-enhanced_Electronic_Mail)).

```javascript
var token = '...';
var x5tString = '...';
var publicKey = '-----BEGIN CERTIFICATE-----\n' + x5tString + '\n-----END CERTIFICATE-----';
...

// Verify
verifiedToken = jwt.verify(token, publicKey);

```

