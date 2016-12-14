import {existsSync} from "fs";
import {execSync} from "child_process";

export class XCodeBuild {

    protected sdk: string;
    protected projectRoot: string;
    protected configuration: ConfigurationName;
    protected codeSignIdentity: string;
    protected developmentTeam: string;
    protected configurationBuildDir: string;
    protected podInstall: boolean;

    constructor(config: IXCodeBuildConfig) {
        this.sdk = config.sdk;
        this.projectRoot = config.projectRoot;
        this.configuration = config.configuration || ConfigurationName.Release;
        this.codeSignIdentity = config.codeSignIdentity || null;
        this.developmentTeam = config.developmentTeam || null;
        this.configurationBuildDir = config.configurationBuildDir || null;
        this.podInstall = config.podInstall !== false;
    }

    public run(): Promise<void> {
        return this.validate()
            .then((r: IValidationResult[]) => r.filter(a => a.hasError))
            .then((errors: IValidationResult[]) => {

                return new Promise((resolve, reject) => {
                    if (errors.length > 0) {
                        reject(errors);
                        return;
                    }

                    resolve(this.installPods().then(() => this.build({
                        sdk: this.sdk,
                        configuration: ConfigurationName[this.configuration]
                    })));
                });
            }).then(() => null);
    }

    protected build(config: IXCodeBuildCliOptions) : Promise<void> {
        const args = Object.keys(config).map(k => `-${k} ${config[k]}`);

        let cmdSections = ['xcodebuild'].concat(args);

        if (this.codeSignIdentity) {
            cmdSections.push(`CODE_SIGN_IDENTITY="${this.codeSignIdentity}"`);
        }

        if (this.developmentTeam) {
            cmdSections.push(`DEVELOPMENT_TEAM="${this.developmentTeam}"`);
        }

        if (this.configurationBuildDir) {
            cmdSections.push(`CONFIGURATION_BUILD_DIR="${this.configurationBuildDir}"`);
        }

        const cmd = cmdSections.join(' ');

        this.execSync(cmd);
        return Promise.resolve();
    }

    protected validate(): Promise<IValidationResult[]> {
        return Promise.resolve([]);
    }

    protected installPods(): Promise<void> {
        if (this.podInstall && existsSync(this.projectRoot + '/Podfile')) {
            this.execSync('pod install');
        }

        return Promise.resolve();
    }

    protected execSync(cmd: string) {
        execSync(`cd ${this.projectRoot} && ${cmd}`, {stdio: [0, 1, 2]});
    }
}

export interface IXCodeBuildConfig {
    sdk: string;
    projectRoot: string;
    configuration: ConfigurationName;
    podInstall?: boolean;
    codeSignIdentity?: string;
    developmentTeam?: string;
    configurationBuildDir?: string;
}

export interface IXCodeBuildCliOptions {
    sdk: string;
    configuration: string;
    scheme?: string;
    destination?: string;
    'destination-timeout'?: string;
}

export enum ConfigurationName {
    Release,
    Debug
}

export interface IValidationResult {
    hasError: boolean;
    message?: string;
}