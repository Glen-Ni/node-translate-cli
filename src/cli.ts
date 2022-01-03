import * as commander from 'commander';
import {translate} from "./main";

const pkg = require("../package.json");

const program = new commander.Command();

program
  .version(pkg.version)
  .usage('<Content>')
  .action((source, destination) => {
      if (destination.args.length === 0) {
        return console.log("Content is needed!");
      }
      translate(destination.args.join(' '));
    }
  );

program.parse(process.argv);

