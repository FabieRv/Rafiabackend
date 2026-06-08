import { CommandeItemDto } from './commande-item.dto';

export class CommandeCreateDto {
  items: CommandeItemDto[];

  adresse_livraison: string;

  ville: string;

  region: string;
}
