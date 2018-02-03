console.log('JWT Bearer Token From Azure AD Example');

var jwt = require('jsonwebtoken');

var token = '<Base64 Bearer token string goes here, without the "Bearer " prefix>';
var x5tString = 'MIIDBTCCAe2gAwIBAgIQaD0+a2FNl5JMaE2/7KUP5zANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTE3MTEyODAwMDAwMFoXDTE5MTEyOTAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKdx4TELKpoEo3og7GdWsvlABYBTHQWIBhpBmti9HsOv6t29sfQnHa7v2pladR11dhVcG6StB2LE0kb1iIgkUU/gIDEiJWqe6pYPPomL3RSCbKK3/OPrETfSKtxdaSg/lvb6rIrXBG85Yxwi0ktr1Ckm+4rcI3PwCo5Mt3F+Z3TLqUBEmTU24sGpzPXQCeyvO6VEVzeupUv6vbu8MVr43N4ixKduT1P9OpqBgzHuQVrg+kW/6XRTNaZZthTlITG8VEa8I02S2Q4VyosdzcrMQmRp75MTA2YKdqTexTKmWKaXFIcGCbvMEm35sIfIVziQ8YMSEC+7GBoh3k2g2BFRgtECAwEAAaMhMB8wHQYDVR0OBBYEFGpho/kx4FeBzTTBIbYVWfFdGIblMA0GCSqGSIb3DQEBCwUAA4IBAQBgaeYvuV4sYJZNPXbxN6FIc0oA4bCg1+DFalT3qzW0bFbl7pXP5YPY/adZlT8+cTznjMgzPPvcXaQdcytR16YqHJVX0ik67NrrQ3g0TtGLc42SuzE+6awryiLQY0Zd799bJwrRcDZUqm/6jKOEOd+utf+3o+VU57w+n7iQLuSL1mKYGMsyzMYCj6xVtYl75iam86leT0/tlXHJ8oqxU5w3xVY6P7v0Sz2UteQNQvhKi6R1/cjfiJUp+OzHpaEor6ls7HSvojY2zm1DIaH6EBp2L9TBFt8IALAEN5hX6XYpKmCHRUlzYwoWo7YwzKiot0XdbDW+zPKGPKtIlbg6cw/+';
var publicKey = '-----BEGIN CERTIFICATE-----\n' + x5tString + '\n-----END CERTIFICATE-----';
var verifyOptions = {
  // algorithms: ['RS256'],
  // audience: '<Your audience (aud) GUID>',
  // issuer: '<Your issuer (iss) value>'
};

// Verify
var verifiedToken = jwt.verify(token, publicKey) //, verifyOptions);
console.log(verifiedToken);