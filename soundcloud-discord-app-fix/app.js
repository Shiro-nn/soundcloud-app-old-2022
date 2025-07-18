const electr = require("electron");
const path = require('path');
const sce = electr.app.commandLine.getSwitchValue('soundcloud');
if(sce) require(path.join(electr.app.getAppPath(), "..", "discord.asar"));
else require(path.join(electr.app.getAppPath(), "..", "soundcloud.asar"))