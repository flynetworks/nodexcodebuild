# NodeXCodeBuild

This package provides a programmatic interface to [xcodebuild](https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html) developed by Apple. 

## Installation

npm install nodexcodebuild --save-dev

## Usage

### Build workspace

| option                | type      | required | default | possible values
| --------------------- | --------- | -------- | ------- | ------------------------------------
| sdk                   | string    | yes      | -       | see "xcodebuild -showsdks"
| projectRoot           | string    | yes      | -       | the path where your project root is
| configuration         | string    | no       | Release | Release, Debug
| podInstall            | boolean   | no       | true    | true, false
| codeSignIdentity      | string    | no       | -       | The name of your code-sign-identity
| developmentTeam       | string    | no       | -       | The id of your development team
| configurationBuildDir | string    | no       | -       | the path where the compiled app should be stored
| workspace             | string    | yes      | -       | the name of the workspace to build
| scheme                | string    | yes      | -       | the name of the scheme to build
| destination           | string    | no       | -       | the destination device
| destinationTimeout    | number    | no       | -       | timeout when searching a devices

```javascript
var resolve = require('path').resolve;
var xcb = require('nodexcodebuild');

new xcb.WorkspaceBuild({
  sdk: 'iphoneos10.2',
  projectRoot: resolve('my/path'),
  workspace: 'MyCoolWorkspace.xcworkspace',
  scheme: 'MyAppScheme',
  codeSignIdentity: 'iPhone Developer',
  developmentTeam: 'A1B2C3D4',
  configurationBuildDir: resolve('build/ios'),
}).run();
```

### Build project (not implemented yet)

```javascript
var resolve = require('path').resolve;
var xcb = require('nodexcodebuild');
new xcb.ProjectBuild({/* @todo implement this */}).run();
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT