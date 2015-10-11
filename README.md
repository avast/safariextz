# safariextz

Safari extension packer for node.js.

Just a JavaScript interface for [xar-js](https://www.npmjs.com/package/xar-js)

## Project Setup

You need to have your private key, developer certificate and Apple certificates in separate files.
Install [openssl](https://www.openssl.org/) and put it to path if needed.

Open Keychain Access and export your Safari Developer certificate to sd.p12. Extract the private key by

```
openssl pkcs12 -in sd.p12 -nodes | openssl rsa -out key.pem
```

and your certificate by

```
openssl pkcs12 -in sd.p12 -nodes | openssl x509 -outform der -out dev.cer
```

The Apple root and developer certificates are located in this project *apple* directory. Or you can export them from your keychain.

### Alternative: get all the certificates from an existing package

This assumes you have your extension developer certificate set up and Safari can produce .safariextz packages.

* Download xar 1.6.1 from https://github.com/mackyle/xar (precisely this one or its fork, not 1.5.x, not 1.7.x)
* `./configure` and `make` it
* `xar -f package.safariextz  --extract-certs .`

## Usage

```
npm install -D safariextz
```

```
var safariextz = require('safariextz');

safariextz(packageName, extensionSrcDir, {
    privateKey:   'key.pem',
    extensionCer: 'dev.cer',
    appleDevCer:  'apple/apple1.cer',
    appleRootCer: 'apple/apple2.cer',
    temp:         '/tmp'
});
```

## Recent changes

* Switched from xar 1.6.1 to xar-js
