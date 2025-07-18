const builder = require("electron-builder");
const Platform = builder.Platform;

builder.build({
  targets: Platform.MAC.createTarget(),
  config: {
    "certificateFile": "/.crt/fydne.p12",
    "certificatePassword": "",
    "target": [
        {
            "target": "nsis",
            "arch": [
                "x64",
                "ia32"
            ]
        }
    ],
    "icon": "../soundcloud-app/icons/appLogo.ico"
  }
})
.then(() => {
    console.log('compiled');
})
.catch((error) => {
    console.error(error);
})