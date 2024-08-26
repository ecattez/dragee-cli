import {lookupForDragees} from "./dragee-lookup.ts";
import {lookupForNamespaces} from "./namespace-lookup.ts";
import {lookupForAsserters} from "./namespace-asserter-lookup.ts";
import type { Asserter, Report, RuleError } from "@dragee-io/asserter-type";

type Options = {
    fromDir: string,
    toDir: string
}

export const handler = async (argument: string, options: Options) => {
    const dragees = await lookupForDragees(options.fromDir);
    const namespaces = await lookupForNamespaces(dragees);
    const asserters: Asserter[] = await lookupForAsserters(namespaces);
    const reports: Report[] = [];
    
    for (const {namespace, handler} of asserters) {
        console.log(`Running asserter for namespace ${namespace}`)
        reports.push(handler(dragees));
    }

    const reportErrors = extractErrors(reports);
    console.table(reportErrors);
    toReportFile(reportErrors, options.toDir+'/result.json')
}

const extractErrors = (reports: Report[]) => 
    reports.flatMap(report => report.errors.map((error: string) => ({
        namespace: report.namespace,
        error: error
    })));

export const toReportFile = (reportErrors: RuleError[], filePath: string) => {
    Bun.write(filePath, JSON.stringify(reportErrors, null, 4));
}
