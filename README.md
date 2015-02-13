# safariextz

Safari extansion packer for node.js

## Environment Setup

* Install [openssl](https://www.openssl.org/) and put it to path
* Download xar 1.6.1 from https://github.com/mackyle/xar
* `./configure` and `make` it
* Place xar 1.6.1 to path, make sure no other version (1.5, 1.7) takes priority

## Project Setup

You need to have your private key, developer certificate and Apple certificates in separate files.

Open Keychain Access and export your Safari Developer certificate to sd.p12. Extract the private key by

```
openssl pkcs12 -in sd.p12 -nodes | openssl rsa -out key.pem
```

and your certificate by

```
openssl pkcs12 -in sd.p12 -nodes | openssl x509 -outform der -out dev.cer
```

The Apple root and developer certificates are located in this project *apple* directory.

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
