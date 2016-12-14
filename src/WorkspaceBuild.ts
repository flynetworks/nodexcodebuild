import {IXCodeBuildConfig, XCodeBuild, IValidationResult, IXCodeBuildCliOptions} from "./XCodeBuild";
import {statSync, existsSync} from "fs";

export class WorkspaceBuild extends XCodeBuild {

    private config: IWorkspaceBuildConfig;

    constructor(config: IWorkspaceBuildConfig) {
        super(config);
        this.config = config;
    }

    get absoluteWorkspace() {
        return `${this.projectRoot}/${this.config.workspace}`;
    }

    protected build(config: IXCodeBuildCliOptions): Promise<void> {
        return super.build(Object.assign({}, config, {
            workspace: this.escapeString(this.config.workspace),
            scheme: this.escapeString(this.config.scheme)
        }));
    }

    private escapeString(str: string) : string {
        return str.split(' ').join('\\ ');
    }

    protected validate(): Promise<IValidationResult[]> {
        return Promise.all([
            this.validateWorkspace(),
        ]);
    }

    private validateWorkspace(): Promise<IValidationResult> {
        return new Promise(resolve => {
            if (!existsSync(this.absoluteWorkspace)) {
                resolve({
                    hasError: true,
                    message: `${this.absoluteWorkspace} doesn't exists!`
                });

                return;
            }

            if (!statSync(this.absoluteWorkspace).isDirectory()) {
                resolve({
                    hasError: true,
                    message: `${this.absoluteWorkspace} is not a directory!`
                });

                return;
            }

            resolve({hasError: false});
        });

    }
}

export interface IWorkspaceBuildConfig extends IXCodeBuildConfig {
    workspace: string;
    scheme: string;
    destination: string;
    destinationTimeout: number;
}