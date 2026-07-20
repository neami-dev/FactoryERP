import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const categories = new Map<string, number>()
console.log("seeder starting... ")
  // Step 1: Create categories and store their IDs
  const categoryNames = [
    "Poids du poisson dans une expédition",
    "Expédition",
    "Poids du poisson dans un emballage",
    "Poisson",
    "Facture de traçabilité",
    "Poids du poisson dans une réception",
    "Emballage",
    "reception",
    "rôle",
    "Utilisateur",
    "Qualité du poisson",
    "traçabilité",
  ]

  for (const name of categoryNames) {
    const ifExists = await prisma.permission_category.findFirst({
      where:{name}
    })
    if (ifExists) {
      categories.set(name, ifExists.id)
      
    }else{
      const category = await prisma.permission_category.create({
      data: { name },
    })
    categories.set(name, category.id)
    }
   
  }

  // Step 2: Create permissions with category_id
  await prisma.permission.createMany({
   data: [
  { name: "details:weight_fish_shipping", description: "voir détails poids poisson expédition", category_id: categories.get("Poids du poisson dans une expédition")! },
  { name: "delete:weight_fish_shipping", description: "supprimer poids poisson expédition", category_id: categories.get("Poids du poisson dans une expédition")! },
  { name: "update:weight_fish_shipping", description: "modifier poids poisson expédition", category_id: categories.get("Poids du poisson dans une expédition")! },

  { name: "update:shipping", description: "modifier expédition", category_id: categories.get("Expédition")! },
  { name: "details:shipping", description: "voir détails expédition", category_id: categories.get("Expédition")! },
  { name: "delete:shipping", description: "supprimer expédition", category_id: categories.get("Expédition")! },
  { name: "create:shipping", description: "créer expédition", category_id: categories.get("Expédition")! },
  { name: "validate:shipping", description: "valider expédition", category_id: categories.get("Expédition")! },
  { name: "download_invoice:shipping", description: "télécharger facture expédition", category_id: categories.get("Expédition")! },

  { name: "show:weight_fish_wrapping", description: "voir poids emballage", category_id: categories.get("Poids du poisson dans un emballage")! },
  { name: "delete:weight_fish_wrapping", description: "supprimer poids emballage", category_id: categories.get("Poids du poisson dans un emballage")! },
  { name: "update:weight_fish_wrapping", description: "modifier poids emballage", category_id: categories.get("Poids du poisson dans un emballage")! },

  { name: "manage:fish_category", description: "gérer catégorie poisson", category_id: categories.get("Poisson")! },

  { name: "delete:traceability_invoice", description: "supprimer facture traçabilité", category_id: categories.get("Facture de traçabilité")! },
  { name: "update:traceability_invoice", description: "modifier facture traçabilité", category_id: categories.get("Facture de traçabilité")! },
  { name: "create:traceability_invoice", description: "créer facture traçabilité", category_id: categories.get("Facture de traçabilité")! },
  { name: "show:traceability_invoice", description: "voir facture traçabilité", category_id: categories.get("Facture de traçabilité")! },

  { name: "show:weight_fish_reception", description: "voir poids réception", category_id: categories.get("Poids du poisson dans une réception")! },
  { name: "delete:weight_fish_reception", description: "supprimer poids réception", category_id: categories.get("Poids du poisson dans une réception")! },
  { name: "update:weight_fish_reception", description: "modifier poids réception", category_id: categories.get("Poids du poisson dans une réception")! },

  { name: "download_invoice:wrapping", description: "télécharger facture emballage", category_id: categories.get("Emballage")! },
  { name: "update:wrapping", description: null, category_id: categories.get("Emballage")! },
  { name: "details:wrapping", description: null, category_id: categories.get("Emballage")! },
  { name: "validate:wrapping", description: "valider emballage", category_id: categories.get("Emballage")! },
  { name: "create:wrapping", description: "créer emballage", category_id: categories.get("Emballage")! },
  { name: "delete:wrapping", description: "supprimer emballage", category_id: categories.get("Emballage")! },

  { name: "download_invoice:reception", description: "télécharger facture réception", category_id: categories.get("reception")! },
  { name: "update_price:reception", description: "modifier prix réception", category_id: categories.get("reception")! },
  { name: "show_price_details:reception", description: null, category_id: categories.get("reception")! },
  { name: "edit_price:reception", description: "éditer prix réception", category_id: categories.get("reception")! },
  { name: "details:reception", description: "détails réception", category_id: categories.get("reception")! },
  { name: "update:reception", description: "modifier réception", category_id: categories.get("reception")! },
  { name: "show_price:reception", description: "voir prix réception", category_id: categories.get("reception")! },
  { name: "show:reception", description: "voir réception", category_id: categories.get("reception")! },
  { name: "add_price:reception", description: "ajouter prix", category_id: categories.get("reception")! },
  { name: "validate:reception", description: "valider réception", category_id: categories.get("reception")! },
  { name: "create:reception", description: "créer réception", category_id: categories.get("reception")! },
  { name: "delete:reception", description: "supprimer réception", category_id: categories.get("reception")! },

  { name: "delete:role", description: "supprimer rôle", category_id: categories.get("rôle")! },
  { name: "update:role", description: "modifier rôle", category_id: categories.get("rôle")! },
  { name: "create:role", description: "créer rôle", category_id: categories.get("rôle")! },

  { name: "show:user", description: "voir utilisateurs", category_id: categories.get("Utilisateur")! },
  { name: "delete:user", description: "supprimer utilisateur", category_id: categories.get("Utilisateur")! },
  { name: "update:user", description: "modifier utilisateur", category_id: categories.get("Utilisateur")! },
  { name: "create:user", description: "créer utilisateur", category_id: categories.get("Utilisateur")! },

  { name: "manage:quality_fish", description: "gérer qualité poisson", category_id: categories.get("Qualité du poisson")! },

  { name: "create:traceability", description: "créer traçabilité", category_id: categories.get("traçabilité")! },
], skipDuplicates: true,
  })
  const allPermissions = await prisma.permission.findMany()

  async function createSuperAdmin(){
    const ifExistsSuperAdmin = await prisma.role.findFirst({
    where:{
      name: "super_admin",
    }
    })

    if (ifExistsSuperAdmin) {
    await prisma.role.update({
      data:{
        permissions: {
          connect: allPermissions.map((p) => ({ id: p.id })),
        },
      },
      where:{
        id:ifExistsSuperAdmin.id
      }
    })
    return
    }
    const superAdminRole = await prisma.role.create({
      data: {
        is_active:true,
        name: "super_admin",
        description: "Full system access",
        permissions: {
          connect: allPermissions.map((p) => ({ id: p.id })),
        },
      },
    })
    // Create Person (required for User)
    const person = await prisma.person.create({
      data: {
        firstname: "super",
        lastname: "admin",
      },
    })

    // Create User and assign super_admin role
    await prisma.user.create({
      data: {
        username: "superadmin",
        email: "admin@example.com",
        password: "$2b$10$7mFsS8CgitsESJZU2GyIKeEJidBrM4V0XwQQxwIOExrBVezLRsaZK", // hashed "Test@#123"
        person_id: person.id,
        role_id: superAdminRole.id,
        auth_allowed: true,
      },
    })

  }

  await createSuperAdmin()
  console.log("✅ Seeded categories and permissions successfully.")
}



main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
