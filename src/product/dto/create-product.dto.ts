export class CreateProductDto {
  nom_produit: string;
  description: string;
  type: string;
  prix: number;
  quantite_stock: number;
  image: string;
  id_sous_categorie: number;
}
