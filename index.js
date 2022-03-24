const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { messages } = require('powercord/webpack');

let prefix;

const Settings = require('./components/settings.jsx');
module.exports = class timestamp extends Plugin {
  startPlugin() {
    this.setDefault('t', true);
    powercord.api.settings.registerSettings(this.entityID, {
      category: this.entityID,
      label: 'Replace Timestamps',
      render: Settings
    });
    this.patchMessage();
  }
  setDefault(name, defaultValue) {
    this.settings.set(name, this.settings.get(name, defaultValue));
    prefix = name;
  }
  patchMessage() {
    inject('timestamp', messages, 'sendMessage', args => {
      if (args[1].content.search(/(?<!\d)\d{1,2}:\d{2}(?!\d)/) !== -1) args[1].content = args[1].content.replace(/\d?\d:\d\d/g, x => (this.getUnixTimestamp(x)));
      return args;
    }, true);
  }
  getUnixTimestamp(time) {
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/\d?\d:\d\d/, time);
    const then = Math.round((new Date(date)).getTime() / 1000);
    if (isNaN(then)) return time;
    if (this.settings.get('t')) prefix = 't'; else if (this.settings.get('T')) prefix = 'T'; else if (this.settings.get('d')) prefix = 'd'; else if (this.settings.get('D')) prefix = 'D'; else if (this.settings.get('f')) prefix = 'f'; else if (this.settings.get('F')) prefix = 'F';  else if (this.settings.get('R'))  prefix = 'R'
    return `<t:${then}:${prefix}>`; //To change the time format, refer to https://github.com/discord/discord-api-docs/blob/master/docs/Reference.md#timestamp-styles
  }
  pluginWillUnload() {
    uninject('timestamp'); powercord.api.settings.unregisterSettings(this.entityID);
    powercord.api.settings.unregisterSettings(this.entityID);
  }
};
