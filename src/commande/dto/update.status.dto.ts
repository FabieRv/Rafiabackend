import { Commande, CommandeStatus } from '@prisma/client';

export class UpdateStatusDto {
  status: CommandeStatus;
}
