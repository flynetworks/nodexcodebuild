"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var XCodeBuild_1 = require("./XCodeBuild");
var fs_1 = require("fs");
var WorkspaceBuild = (function (_super) {
    __extends(WorkspaceBuild, _super);
    function WorkspaceBuild(config) {
        var _this = _super.call(this, config) || this;
        _this.config = config;
        return _this;
    }
    Object.defineProperty(WorkspaceBuild.prototype, "absoluteWorkspace", {
        get: function () {
            return this.projectRoot + "/" + this.config.workspace;
        },
        enumerable: true,
        configurable: true
    });
    WorkspaceBuild.prototype.build = function (config) {
        return _super.prototype.build.call(this, Object.assign({}, config, {
            workspace: this.config.workspace,
            scheme: this.config.scheme
        }));
    };
    WorkspaceBuild.prototype.validate = function () {
        return Promise.all([
            this.validateWorkspace(),
        ]);
    };
    WorkspaceBuild.prototype.validateWorkspace = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!fs_1.existsSync(_this.absoluteWorkspace)) {
                resolve({
                    hasError: true,
                    message: _this.absoluteWorkspace + " doesn't exists!"
                });
                return;
            }
            if (!fs_1.statSync(_this.absoluteWorkspace).isDirectory()) {
                resolve({
                    hasError: true,
                    message: _this.absoluteWorkspace + " is not a directory!"
                });
                return;
            }
            resolve({ hasError: false });
        });
    };
    return WorkspaceBuild;
}(XCodeBuild_1.XCodeBuild));
exports.WorkspaceBuild = WorkspaceBuild;
