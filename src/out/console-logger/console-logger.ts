import { IStreamLogger } from '../../core/handlers/stream-logger.interface';

export class ConsoleLogger implements IStreamLogger {
    // implenting  SingleTone pattern(one instance)
    private static logger: ConsoleLogger;
    public static getInstance() {
        if (!ConsoleLogger.logger) {
            ConsoleLogger.logger = new ConsoleLogger();
        }
        return ConsoleLogger.logger;
    }

    log(...args: any[]): void {
        console.log(...args);
    }
    error(...args: any[]): void {
        console.log(...args);
    }
    end(): void {
        console.log('Done');
    }

}