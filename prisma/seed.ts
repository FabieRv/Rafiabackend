import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Création du Type
  const typeArtisanat = await prisma.type.create({
    data: {
      nom_type: 'Artisanat',
      description: 'Produits en fibres naturelles',
    },
  });

  // 2. Création des Catégories
  const chapeaux = await prisma.category.create({
    data: {
      nom_categorie: 'Chapeaux',
      id_type: typeArtisanat.id_type,
    },
  });

  const paniers = await prisma.category.create({
    data: {
      nom_categorie: 'Paniers',
      id_type: typeArtisanat.id_type,
    },
  });

  // 3. Création des Sous-Catégories (Correction camelCase)
  await prisma.sousCategory.createMany({
    data: [
      // Vérifie bien si c'est id_categorie ou id_category dans ton schema.prisma
      { nom_sous_categorie: 'Capelines', id_categorie: chapeaux.id_categorie },
      { nom_sous_categorie: 'Cloches', id_categorie: chapeaux.id_categorie },
      {
        nom_sous_categorie: 'Paniers de plage',
        id_categorie: paniers.id_categorie,
      },
      { nom_sous_categorie: 'Rabane', id_categorie: paniers.id_categorie },
    ],
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
