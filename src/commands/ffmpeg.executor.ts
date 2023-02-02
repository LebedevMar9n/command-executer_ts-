import { FfmpegBuilder } from './ffmpeg/ffmpeg.builder';
import { IFfmpegInput, ICommandExecFfmpeg } from './ffmpeg/ffmpeg.types';
import { PromptService } from './../core/prompt/prompt.service';
import { FileService } from './../core/files/file.service';
import { IStreamLogger } from '../core/handlers/stream-logger.interface';
import { CommandExecutor } from '../core/executor/command.executor';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { StreamHandler } from '../core/handlers/stream-handlers';

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput>{
    private fileService: FileService = new FileService();
    private promptService: PromptService = new PromptService();

    constructor(logger: IStreamLogger) {
        super(logger);
    }

    protected async prompt(): Promise<IFfmpegInput> {
        const width = await this.promptService.input<number>('Enter width', 'number');
        const height = await this.promptService.input<number>('Enter height', 'number');
        const path = await this.promptService.input<string>('Enter file path', 'input');
        const name = await this.promptService.input<string>('Enter file name', 'input');
        return { width, height, path, name };
    }
    protected build({ width, height, path, name }: IFfmpegInput): ICommandExecFfmpeg {
        const output = this.fileService.getFilePath(path, name, 'mp4');
        const args = (new FfmpegBuilder)
            .input(path)
            .setVideoSize(width, height)
            .output(output);
        return { command: 'ffmpeg', args, output };
    }
    protected spawn({ output, command, args }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
        this.fileService.deleteFileIfExist(output);
        return spawn(command, args);
    }
    protected processStream(stream: ChildProcessWithoutNullStreams, logger: IStreamLogger): void {
        const handler = new StreamHandler(logger);
        handler.processOutput(stream);
    }
}