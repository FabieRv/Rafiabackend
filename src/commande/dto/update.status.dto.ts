// update-status.dto.ts
import { CommandeStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(CommandeStatus)
  status: CommandeStatus;
}
