import Debug from 'debug'

const error = Debug('error')

export class Log {
    reportError = (errorToReport: unknown) => {
        if (errorToReport instanceof Error) {
            error(`${errorToReport.name}: ${errorToReport.message}`);
        } else {
            error('Unknown Error');
        }
    }
}