//  Safari Extension Packer
//  Copyright 2015 AVAST Software s.r.o.
//  http://www.avast.com
(function () {
    'use strict';

    var execute = require('child_process').exec;
    var when = require('when');
    var fs = require('fs');
    var path = require('path');

    // promisified child_process.exec
    function exec(command, options) {
        var hide_stdout = false;

        if (!options) {
            options = { };
        }
        if (!options.cwd) {
            options.cwd = __dirname;
        }
        if (options.hide_stdout) {
            hide_stdout = true;
            delete options['hide_stdout'];
        }

        //console.log(command);
        return when.promise(function (resolve, reject) {
            execute(command, options, function (err, stdout, stderr) {
                if (!hide_stdout && stdout) {
                    console.log(stdout);
                }
                if (stderr) {
                    console.log(stderr);
                }
                if (err) {
                    reject(err.code);
                }
                else {
                    resolve(stdout);
                }
            })
        });
    }

    // pack and sign Safari extension
    //
    // @param safariextzName name of the pcaked extension
    // @param safariextansionDir source directory
    // @param options {
    //          privateKey   Apple developer private key in PKCS8 format
    //          extensionCer Apple developer certificate in DER encoding
    //          appleDevCer  Apple Worldwide Developer Relations Certification Authority
    //          appleRootCer Apple Root CA
    //          temp [optional] temporary directory, will use cwd if not specified
    // }
    // @return promise
    // 
    function pack(safariextzName, safariextensionDir, options) {
        var temp = options.temp;
        if (!temp) {
            temp = "";
        }

        return exec('xar -cf ' + safariextzName + ' -C ' + path.dirname(safariextensionDir) + ' ' + path.basename(safariextensionDir))
            .then(function () {
                // find out the signature size by siging anything (in this case the key itself)
                return exec('openssl dgst -sign ' + options.privateKey + ' -binary ' + options.privateKey, { hide_stdout: true, encoding: 'binary' });
            })
            .then(function (signature_buffer) {
                return exec('xar --sign -f ' + safariextzName + ' --data-to-sign ' + path.join(temp, 'digest.dat') + ' --sig-size ' + signature_buffer.length +
                     ' --cert-loc ' + options.extensionCer +
                     ' --cert-loc ' + options.appleDevCer +
                     ' --cert-loc ' + options.appleRootCer);
            })
            .then(function () {
                return exec('openssl rsautl -sign -inkey ' + options.privateKey + ' -in ' + path.join(temp, 'digest.dat') + ' -out ' + path.join(temp, 'signature.dat'));
            })
            .then(function () {
                return exec('xar --inject-sig ' + path.join(temp, 'signature.dat') + ' -f ' + safariextzName);
            })
            .then(function () {
                fs.unlink(path.join(temp, 'signature.dat'));
                fs.unlink(path.join(temp, 'digest.dat'));
            });
    }

    module.exports = pack;

})();
