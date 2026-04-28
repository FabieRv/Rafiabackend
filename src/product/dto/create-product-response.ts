import { Category } from "@prisma/client";

export class CreateProductDtoRequest {
    nom_produit: string;
    description: string;
    type: string;
    prix: number;
    quantite_stock: number;
    image: string;
    id_sous_categorie: number;
    category: Category
  }
  