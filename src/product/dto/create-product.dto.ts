export class CreateProductDto {
  nom_produit: string;
  description: string;
  prix: number;
  quantite_stock: number;
  image: string;
  id_catalogue: number;
  id_sous_categorie: number;
}
