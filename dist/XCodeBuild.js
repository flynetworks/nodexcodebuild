"use strict";
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var XCodeBuild = (function () {
    function XCodeBuild(config) {
        this.sdk = config.sdk;
        this.projectRoot = config.projectRoot;
        this.configuration = config.configuration || ConfigurationName.Release;
        this.codeSignIdentity = config.codeSignIdentity || null;
        this.developmentTeam = config.developmentTeam || null;
        this.configurationBuildDir = config.configurationBuildDir || null;
        this.podInstall = config.podInstall !== false;
    }
    XCodeBuild.prototype.run = function () {
        var _this = this;
        return this.validate()
            .then(function (r) { return r.filter(function (a) { return a.hasError; }); })
            .then(function (errors) {
            return new Promise(function (resolve, reject) {
                if (errors.length > 0) {
                    reject(errors);
                    return;
                }
                resolve(_this.installPods().then(function () { return _this.build({
                    sdk: _this.sdk,
                    configuration: ConfigurationName[_this.configuration]
                }); }));
            });
        }).then(function () { return null; });
    };
    XCodeBuild.prototype.build = function (config) {
        var args = Object.keys(config).map(function (k) { return "-" + k + " " + config[k]; });
        var cmdSections = ['xcodebuild'].concat(args);
        if (this.codeSignIdentity) {
            cmdSections.push("CODE_SIGN_IDENTITY=\"" + this.codeSignIdentity + "\"");
        }
        if (this.developmentTeam) {
            cmdSections.push("DEVELOPMENT_TEAM=\"" + this.developmentTeam + "\"");
        }
        if (this.configurationBuildDir) {
            cmdSections.push("CONFIGURATION_BUILD_DIR=\"" + this.configurationBuildDir + "\"");
        }
        var cmd = cmdSections.join(' ');
        this.execSync(cmd);
        return Promise.resolve();
    };
    XCodeBuild.prototype.validate = function () {
        return Promise.resolve([]);
    };
    XCodeBuild.prototype.installPods = function () {
        if (this.podInstall && fs_1.existsSync(this.projectRoot + '/Podfile')) {
            this.execSync('pod install');
        }
        return Promise.resolve();
    };
    XCodeBuild.prototype.execSync = function (cmd) {
        child_process_1.execSync("cd " + this.projectRoot + " && " + cmd, { stdio: [0, 1, 2] });
    };
    return XCodeBuild;
}());
exports.XCodeBuild = XCodeBuild;
var ConfigurationName;
(function (ConfigurationName) {
    ConfigurationName[ConfigurationName["Release"] = 0] = "Release";
    ConfigurationName[ConfigurationName["Debug"] = 1] = "Debug";
})(ConfigurationName = exports.ConfigurationName || (exports.ConfigurationName = {}));
