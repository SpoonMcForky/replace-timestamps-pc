const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { messages } = require("powercord/webpack");
const Formats = require("./util/formats.js");

module.exports = class ReplaceTimestamps extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: "timestamp",
      description: "Command to generate Discord timestamps",
      usage: "{c} <prefix> <timesamp>",
      executor: (args) => {
        const prefixes = {
          0: "t",
          1: "T",
          2: "d",
          3: "D",
          4: "f",
          5: "F",
          6: "R",
        };
        const regexAGlobal = /(?<!\d)\d{1,2}:\d{2}(?!\d)(am|pm)?/gi;
        const regexA = /((?<!\d)\d{1,2}:\d{2}(?!\d))(am|pm)?/i;
        let output = "";
        if (args[1].search(regexAGlobal) !== -1) {
          output = args[1].replace(regexAGlobal, (x) => {
            let [, time, suffix] = x.match(regexA);
            let [hours, minutes] = time.split(":").map((e) => parseInt(e));
            if (
              suffix &&
              suffix.toLowerCase() === "pm" &&
              hours < 12 &&
              hours !== 0
            ) {
              hours += 12;
              minutes = minutes.toString().padStart(2, "0");
              time = `${hours}:${minutes}`;
            } else if (
              (suffix && suffix.toLowerCase() === "am" && hours === 12) ||
              hours === 24
            ) {
              time = `00:${minutes}`;
            } else if (minutes >= 60) {
              hours += Math.floor(minutes / 60);
              minutes = minutes % 60;
              time = `${hours}:${minutes}`;
            }
            return this.getUnixTimestamp(
              time,
              prefixes[Formats.indexOf(args[0])]
            );
          });
        }
        return {
          send: true,
          result: `${output}`,
        };
      },
      autocomplete: (args) => {
        if (args[0] == void 0 || args[0] == undefined || args[0] == "") {
          return {
            commands: Array.from(Formats).map((format) => {
              return {
                command: format,
                description: `Format ${format}`,
              };
            }),
            header: "formats",
          };
        }
        if (
          Array.from(Formats).filter(
            (x) => x.toLowerCase() === args[0].toLowerCase()
          )[0] !== undefined
        ) {
          return { commands: false };
        }
        return {
          commands: Array.from(Formats)
            .filter((x) => x.toLowerCase().includes(args[0].toLowerCase()))
            .map((format) => {
              return {
                command: format,
                description: `Format ${format}`,
              };
            }),
          header: "formats",
        };
      },
    });
  }
  getUnixTimestamp(time, suppliedPrefix) {
    const date = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(/\d?\d:\d\d/, time);
    const then = Math.round(new Date(date).getTime() / 1000);
    if (isNaN(then)) return time;
    return `<t:${then}:${suppliedPrefix}>`;
  }
  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("timestamp");
  }
};
