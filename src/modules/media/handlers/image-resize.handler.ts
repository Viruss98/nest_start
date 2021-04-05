import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImageResizeCommand } from '../commands/image-resize.command';
import { SharpService } from '../services/sharp.service';

@CommandHandler(ImageResizeCommand)
export class ImageResizeHandler implements ICommandHandler<ImageResizeCommand> {
  constructor(private sharpService: SharpService) {}

  async execute(command: ImageResizeCommand) {
    const { imgPath, fileName } = command;
    return this.sharpService.resize(imgPath, fileName, {
      height: 400,
      width: 200,
      quality: 60,
    });
  }
}
