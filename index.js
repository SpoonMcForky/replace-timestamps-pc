const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { messages } = require('powercord/webpack');

let prefix;
const Settings = require('./Components/settings.jsx');
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
  patchMessage() { //Lighty made this better because he felt like it
    inject('timestamp', messages, 'sendMessage', args => {
      
      let char = this.settings.get('char');
      if (!char) char = '';
      char.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); 
      const regexAGlobal = new RegExp(`${char.length ? (`${ char}`) : ''}(?<!\\d)\\d{1,2}:\\d{2}(?!\\d)(am|pm)?`, 'gi');
      const regexA = new RegExp(`${char.length ? (`${ char}`) : ''}((?<!\\d)\\d{1,2}:\\d{2}(?!\\d))(am|pm)?`, 'i');
      if (args[1].content.search(regexAGlobal) !== -1) args[1].content = args[1].content.replace(regexAGlobal, x => {
        let [, time, suffix] = x.match(regexA);
        let [hours, minutes] = time.split(':').map(e => parseInt(e));
        if (suffix && suffix.toLowerCase() === 'pm' && hours < 12 && hours !== 0) {
          hours += 12;
          minutes = minutes.toString().padStart(2, '0');
          time = `${hours}:${minutes}`;
        } else if ((suffix && suffix.toLowerCase() === 'am' && hours === 12) || (hours === 24)) time = `00:${minutes}`;
        else if (minutes >= 60) {
          hours += Math.floor(minutes / 60);
          minutes = (minutes % 60);
          time = `${hours}:${minutes}`;
        }
        return this.getUnixTimestamp(time);
      });
      return args;
    }, true);
  }
  getUnixTimestamp(time) {
    const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/\d?\d:\d\d/, time);
    const then = Math.round((new Date(date)).getTime() / 1000);
    if (isNaN(then)) return time;
    if (this.settings.get('t')) prefix = 't'; else if (this.settings.get('T')) prefix = 'T'; else if (this.settings.get('d')) prefix = 'd'; else if (this.settings.get('D')) prefix = 'D'; else if (this.settings.get('f')) prefix = 'f'; else if (this.settings.get('F')) prefix = 'F'; else if (this.settings.get('R')) prefix = 'R';
    return `<t:${then}:${prefix}>`;
  }
  pluginWillUnload() {
    uninject('timestamp'); powercord.api.settings.unregisterSettings(this.entityID);
    powercord.api.settings.unregisterSettings(this.entityID);
  }
};
