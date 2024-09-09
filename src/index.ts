import { Command } from 'commander';
import { handler } from "./command.handler.ts";
import { generateAsserter } from "@dragee-io/asserter-generator";
   
const report = new Command('report')
    .alias('r')
    .option('--from, --from-dir <path-to-dir>', 'directory in where to lookup for dragees', '.')
    .option('--to --to-dir <path-to-dir>', 'directory in where to store reports', './dragee/reports')
    .action(handler);

new Command()
    .addCommand(generateAsserter)
    .addCommand(report)
    .showHelpAfterError()
    .showSuggestionAfterError()
    .parse(process.argv);