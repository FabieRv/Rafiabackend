export class CreateProductDtoRequest {
  nom_produit: string;
  description: string;
  type: string;
  prix: number;
  quantite_stock: number;
  image: string;
  categorie: number;
  id_sous_categorie: number;
  isEdit?: boolean;
}
