//  Safari Extension Packer
//  Copyright 2015 AVAST Software s.r.o.
//  http://www.avast.com
//
//  Packs Safari extensions without interacting with the browser.

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
    // @param safariextensionDir source directory
    // @param options {
    //          privateKey   Apple developer private key in PKCS8 format
    //          extensionCer Apple developer certificate in DER encoding
    //          appleDevCer  Apple Worldwide Developer Relations Certification Authority
    //          appleRootCer Apple Root CA
    // }
    // @return promise
    // 
    function pack(safariextzName, safariextensionDir, options) {
        var xarjsPath = path.resolve(require.resolve('xar-js'), '../../..');
        var mynode = process.argv[0];

        return exec(mynode + ' ' + path.join(xarjsPath, 'xarjs') + ' create ' + safariextzName
            + ' --cert ' + options.extensionCer + ' --cert ' + options.appleDevCer + ' --cert ' + options.appleRootCer
            + ' --private-key ' + options.privateKey + ' ' + path.basename(safariextensionDir), {
                cwd: path.dirname(safariextensionDir)
            });
    }

    module.exports = pack;

})();
