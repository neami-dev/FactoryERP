import { Box_type, InvoiceStatus, PrismaClient, Wrapping_type } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from '@faker-js/faker'
// 1x1 transparent PNG, used [as a placeholder image for Fish_category.img
const PLACEHOLDER_IMG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
)
const WEIGHT_GRADES = [
  { name: 'Gros', order: 1 },
  { name: 'Moyen', order: 2 },
  { name: 'Petit', order: 3 },
  { name: 'Calibre spécial', order: 4 },
]
const SUPPLIER_COUNT = 15
const CLIENT_COUNT = 10
const USER_COUNT = 6
const RECEPTION_COUNT = 30
const WRAPPING_COUNT = 20
const SHIPPING_COUNT = 15

const MOROCCAN_PORTS = [
  'Safi',
  'Agadir',
  'Essaouira',
  'Casablanca',
  'Dakhla',
  'Tan-Tan',
  'El Jadida',
  'Larache',
]
function randomPlateNumber(): string {
  // Moroccan-style plate format e.g. "12345|A|6"
  const num = faker.number.int({ min: 10000, max: 99999 })
  const letter = faker.string.alpha({ length: 1, casing: 'upper' })
  const region = faker.number.int({ min: 1, max: 99 })
  return `${num}-${letter}-${region}`
}
async function createSuperAdmin() {
  const categories = new Map<string, number>()

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
      where: { name }
    })
    if (ifExists) {
      categories.set(name, ifExists.id)

    } else {
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
  const ifExistsSuperAdmin = await prisma.role.findFirst({
    where: {
      name: "super_admin",
    }
  })

  if (ifExistsSuperAdmin) {
    await prisma.role.update({
      data: {
        permissions: {
          connect: allPermissions.map((p) => ({ id: p.id })),
        },
      },
      where: {
        id: ifExistsSuperAdmin.id
      }
    })
    return
  }
  const superAdminRole = await prisma.role.create({
    data: {
      is_active: true,
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

async function seedQuality() {
  const qualities = [
    { title: 'Extra', code: 'EXT' },
    { title: 'Premium', code: 'PRM' },
    { title: 'Standard', code: 'STD' },
    { title: 'Économique', code: 'ECO' },
  ]



  for (const q of qualities) {
    const exists = await prisma.quality.findFirst({ where: { code: q.code } })
    if (!exists) {
      await prisma.quality.create({ data: q })
    }
  }
  console.log(`✅ Quality seeded (${qualities.length})`)
}

async function seedCompany() {
  const companies = [
    { name: 'Atlas Seafood SARL', code: 'ATL-SF' },
    { name: 'Océan Bleu Export', code: 'OCB-EX' },
    { name: 'Marée Fraîche SA', code: 'MFR-SA' },
  ]

  for (const c of companies) {
    const exists = await prisma.company.findFirst({ where: { name: c.name } })
    if (!exists) {
      await prisma.company.create({ data: c })
    }
  }
  console.log(`✅ Company seeded (${companies.length})`)
}

async function seedFishCategory() {
  // 9 common fish/seafood categories relevant to Moroccan processing/export
  const categoryNames = [
    'Sardine',
    'Anchois',
    'Maquereau',
    'Merlu',
    'Poulpe',
    'Calamar',
    'Crevette',
    'Thon',
    'Dorade',
  ]

  for (const name of categoryNames) {
    const exists = await prisma.fish_category.findFirst({ where: { name } })
    if (!exists) {
      await prisma.fish_category.create({
        data: {
          name,
          img: PLACEHOLDER_IMG,
        },
      })
    }
  }
  console.log(`✅ Fish_category seeded (${categoryNames.length})`)
}


async function seedWeightType() {
  const fishCategories = await prisma.fish_category.findMany()

  if (fishCategories.length === 0) {
    console.warn('⚠️  No Fish_category found — run the Fish_category seeder first.')
    return
  }

  let count = 0
  for (const category of fishCategories) {
    for (const grade of WEIGHT_GRADES) {
      const exists = await prisma.weight_type.findFirst({
        where: { fish_category_id: category.id, name: grade.name },
      })
      if (!exists) {
        await prisma.weight_type.create({
          data: {
            name: grade.name,
            order: grade.order,
            fish_category_id: category.id,
          },
        })
        count++
      }
    }
  }
  console.log(`✅ Weight_type seeded (${count} new rows across ${fishCategories.length} categories)`)
}

async function seedWrappingWeightType() {
  const fishCategories = await prisma.fish_category.findMany()

  if (fishCategories.length === 0) {
    console.warn('⚠️  No Fish_category found — run the Fish_category seeder first.')
    return
  }

  let count = 0
  for (const category of fishCategories) {
    for (const grade of WEIGHT_GRADES) {
      const exists = await prisma.wrapping_weight_type.findFirst({
        where: { fish_category_id: category.id, name: grade.name },
      })
      if (!exists) {
        await prisma.wrapping_weight_type.create({
          data: {
            name: grade.name,
            order: grade.order,
            fish_category_id: category.id,
          },
        })
        count++
      }
    }
  }
  console.log(`✅ Wrapping_weight_type seeded (${count} new rows across ${fishCategories.length} categories)`)
}


async function seedOperationalRoles() {
  const roles = [
    { name: 'weigher', description: 'Peseur - accès réception/emballage/expédition' },
    { name: 'manager', description: 'Responsable - supervision des opérations' },
  ]

  const roleIds: Record<string, number> = {}

  for (const r of roles) {
    let role = await prisma.role.findFirst({ where: { name: r.name } })
    if (!role) {
      role = await prisma.role.create({
        data: { name: r.name, description: r.description, is_active: true },
      })
    }
    roleIds[r.name] = role.id
  }

  console.log('✅ Operational roles ensured (weigher, manager)')
  return roleIds
}

async function seedSuppliers() {
  let created = 0
  for (let i = 0; i < SUPPLIER_COUNT; i++) {
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()

    const person = await prisma.person.create({
      data: {
        firstname,
        lastname,
        phone_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
        date_of_birth: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
      },
    })

    await prisma.supplier.create({
      data: { person_id: person.id },
    })
    created++
  }
  console.log(`✅ Supplier seeded (${created})`)
}

async function seedClients() {
  const clientTypes = ['STOCK', 'BUYER', 'SUPPLIER'] as const
  let created = 0
  for (let i = 0; i < CLIENT_COUNT; i++) {
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()

    const person = await prisma.person.create({
      data: {
        firstname,
        lastname,
        phone_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
        date_of_birth: faker.date.birthdate({ min: 22, max: 60, mode: 'age' }),
      },
    })

    await prisma.client.create({
      data: {
        person_id: person.id,
        client_type: faker.helpers.arrayElement(clientTypes),
      },
    })
    created++
  }
  console.log(`✅ Client seeded (${created})`)
}

async function seedUsers(roleIds: Record<string, number>) {
  const availableRoles = [roleIds.weigher, roleIds.manager]
  let created = 0

  for (let i = 0; i < USER_COUNT; i++) {
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    const username = faker.internet.username({ firstName: firstname, lastName: lastname }).toLowerCase()
    const email = faker.internet.email({ firstName: firstname, lastName: lastname }).toLowerCase()

    const existingUser = await prisma.user.findFirst({ where: { username } })
    if (existingUser) continue

    const person = await prisma.person.create({
      data: {
        firstname,
        lastname,
        phone_number: faker.phone.number(),
        address: faker.location.streetAddress(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
        date_of_birth: faker.date.birthdate({ min: 20, max: 55, mode: 'age' }),
      },
    })

    await prisma.user.create({
      data: {
        username,
        email,
        // hashed "Test@#123" — same placeholder hash used for super admin
        password: '$2b$10$7mFsS8CgitsESJZU2GyIKeEJidBrM4V0XwQQxwIOExrBVezLRsaZK',
        person_id: person.id,
        role_id: faker.helpers.arrayElement(availableRoles),
        auth_allowed: true,
      },
    })
    created++
  }
  console.log(`✅ User seeded (${created})`)
}

async function seedReceptions() {
  const suppliers = await prisma.supplier.findMany()
  const fishCategories = await prisma.fish_category.findMany()
  const users = await prisma.user.findMany()
  const companies = await prisma.company.findMany()
  const qualities = await prisma.quality.findMany()

  if (!suppliers.length || !fishCategories.length || !users.length) {
    console.warn('⚠️  Missing Supplier, Fish_category, or User — run earlier seeders first.')
    return
  }

  let receptionCount = 0
  let pricingCount = 0
  let weightFishCount = 0
  let invoiceCount = 0

  for (let i = 0; i < RECEPTION_COUNT; i++) {
    const supplier = faker.helpers.arrayElement(suppliers)
    const fishCategory = faker.helpers.arrayElement(fishCategories)
    const weigher = faker.helpers.arrayElement(users)

    const isFinished = faker.datatype.boolean({ probability: 0.7 })
    const isValid = isFinished ? true : faker.datatype.boolean({ probability: 0.5 })
    const invoiceStatus: InvoiceStatus = isFinished
      ? faker.helpers.arrayElement<InvoiceStatus>(['FULL', 'HAVENOT'])
      : 'NONE'

    const reception = await prisma.reception.create({
      data: {
        supplier_id: supplier.id,
        fish_category_id: fishCategory.id,
        weigher_id: weigher.id,
        plate_number: randomPlateNumber(),
        origin: faker.helpers.arrayElement(MOROCCAN_PORTS),
        tare_weight: faker.number.float({ min: 200, max: 2000, fractionDigits: 2 }),
        paid_price: faker.number.float({ min: 5, max: 60, fractionDigits: 2 }),
        untraced_price_kg: faker.number.float({ min: 3, max: 50, fractionDigits: 2 }),
        isValid,
        isFinished,
        isFinished_add_trace: false,
        isTrace: false,
        is_wrapped: false,
        invoiceStatus,
      },
    })
    receptionCount++

    // Reception_pricing: one entry per weight_type in this fish category
    const weightTypes = await prisma.weight_type.findMany({
      where: { fish_category_id: fishCategory.id },
    })

    for (const wt of weightTypes) {
      await prisma.reception_pricing.create({
        data: {
          weight_type_name: wt.name,
          reception_id: reception.id,
          price_kg: faker.number.float({ min: 5, max: 60, fractionDigits: 2 }),
        },
      })
      pricingCount++
    }

    // Reception_weight_fish: 2-5 line items
    const lineItemCount = faker.number.int({ min: 2, max: 5 })
    for (let j = 0; j < lineItemCount; j++) {
      const weightType = faker.helpers.arrayElement(weightTypes)
      const quality = qualities.length
        ? faker.helpers.arrayElement(qualities)
        : null

      await prisma.reception_weight_fish.create({
        data: {
          reception_id: reception.id,
          quality_id: quality ? quality.id : 1,
          weight: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
          crate: faker.number.int({ min: 1, max: 50 }),
          weight_type_id: weightType.id,
        },
      })
      weightFishCount++
    }

    // Invoice: only for finished receptions with invoiceStatus FULL
    if (isFinished && invoiceStatus === 'FULL' && companies.length) {
      const company = faker.helpers.arrayElement(companies)
      await prisma.invoice.create({
        data: {
          total_weight: faker.number.float({ min: 100, max: 3000, fractionDigits: 2 }),
          trace_code: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
          reception_id: reception.id,
          company_id: company.id,
        },
      })
      invoiceCount++
    }
  }

  console.log(
    `✅ Reception seeded (${receptionCount}), Reception_pricing (${pricingCount}), Reception_weight_fish (${weightFishCount}), Invoice (${invoiceCount})`
  )
}

async function seedWrappings() {
  const clients = await prisma.client.findMany()
  const users = await prisma.user.findMany()
  const qualities = await prisma.quality.findMany()

  if (!clients.length || !users.length) {
    console.warn('⚠️  Missing Client or User — run earlier seeders first.')
    return
  }

  let wrappingCount = 0
  let receptionWrappingCount = 0
  let weightFishCount = 0

  for (let i = 0; i < WRAPPING_COUNT; i++) {
    const client = faker.helpers.arrayElement(clients)
    const weigher = faker.helpers.arrayElement(users)

    // Pick a fish category that has at least one finished reception
    const finishedReceptions = await prisma.reception.findMany({
      where: { isFinished: true },
      select: { id: true, fish_category_id: true },
    })

    if (!finishedReceptions.length) {
      console.warn('⚠️  No finished Reception found — run the reception seeder first.')
      return
    }

    const fishCategoryId = faker.helpers.arrayElement(finishedReceptions).fish_category_id
    const eligibleReceptions = finishedReceptions.filter(
      (r) => r.fish_category_id === fishCategoryId
    )

    const isFinished = faker.datatype.boolean({ probability: 0.6 })
    const isValid = isFinished ? true : faker.datatype.boolean({ probability: 0.5 })

    const wrapping = await prisma.wrapping.create({
      data: {
        client_id: client.id,
        fish_category_id: fishCategoryId,
        weigher_id: weigher.id,
        storage_location: `Chambre froide ${faker.number.int({ min: 1, max: 6 })}`,
        isValid,
        isFinished,
      },
    })
    wrappingCount++

    // Link 1-3 receptions of the same fish category
    const linkedReceptions = faker.helpers.arrayElements(
      eligibleReceptions,
      Math.min(faker.number.int({ min: 1, max: 3 }), eligibleReceptions.length)
    )

    for (const r of linkedReceptions) {
      const exists = await prisma.reception_wrapping.findFirst({
        where: { reception_id: r.id, wrapping_id: wrapping.id },
      })
      if (!exists) {
        await prisma.reception_wrapping.create({
          data: { reception_id: r.id, wrapping_id: wrapping.id },
        })
        receptionWrappingCount++
      }
    }

    // Wrapping_weight_fish: 2-4 line items
    const wrappingWeightTypes = await prisma.wrapping_weight_type.findMany({
      where: { fish_category_id: fishCategoryId },
    })

    if (!wrappingWeightTypes.length) continue

    const lineItemCount = faker.number.int({ min: 2, max: 4 })
    for (let j = 0; j < lineItemCount; j++) {
      const weightType = faker.helpers.arrayElement(wrappingWeightTypes)
      const quality = qualities.length ? faker.helpers.arrayElement(qualities) : null

      await prisma.wrapping_weight_fish.create({
        data: {
          wrapping_id: wrapping.id,
          quality_id: quality ? quality.id : 1,
          wrapping_weight_type_id: weightType.id,
          weight: faker.number.float({ min: 5, max: 300, fractionDigits: 2 }),
          box: faker.number.int({ min: 1, max: 40 }),
          box_type: faker.helpers.arrayElement<Box_type>(['CELLOPHANE', 'CARTON']),
          wrapping_type: faker.helpers.arrayElement<Wrapping_type>(['BLOCK', 'IQF']),
        },
      })
      weightFishCount++
    }
  }

  console.log(
    `✅ Wrapping seeded (${wrappingCount}), Reception_wrapping (${receptionWrappingCount}), Wrapping_weight_fish (${weightFishCount})`
  )
}

async function seedShippings() {
  const clients = await prisma.client.findMany()
  const users = await prisma.user.findMany()
  const fishCategories = await prisma.fish_category.findMany()
  const qualities = await prisma.quality.findMany()

  if (!clients.length || !users.length || !fishCategories.length) {
    console.warn('⚠️  Missing Client, User, or Fish_category — run earlier seeders first.')
    return
  }

  let shippingCount = 0
  let shippingFishCategoryCount = 0
  let palletCount = 0
  let weightFishCount = 0

  for (let i = 0; i < SHIPPING_COUNT; i++) {
    const client = faker.helpers.arrayElement(clients)
    const weigher = faker.helpers.arrayElement(users)
    const isFinished = faker.datatype.boolean({ probability: 0.6 })
    const isValid = isFinished ? true : faker.datatype.boolean({ probability: 0.5 })

    const shipping = await prisma.shipping.create({
      data: {
        client_id: client.id,
        weigher_id: weigher.id,
        plate_number: randomPlateNumber(),
        isValid,
        isFinished,
      },
    })
    shippingCount++

    // 1-3 fish categories for this shipment
    const shipmentCategories = faker.helpers.arrayElements(
      fishCategories,
      faker.number.int({ min: 1, max: Math.min(3, fishCategories.length) })
    )

    const shippingFishCategoryRecords: { id: number; fish_category_id: number }[] = []
    for (const fc of shipmentCategories) {
      const sfc = await prisma.shipping_Fish_category.create({
        data: {
          shipping_id: shipping.id,
          fish_category_id: fc.id,
        },
      })
      shippingFishCategoryRecords.push({ id: sfc.id, fish_category_id: fc.id })
      shippingFishCategoryCount++
    }

    // 2-4 pallets per shipment
    const palletTotal = faker.number.int({ min: 2, max: 4 })
    for (let p = 1; p <= palletTotal; p++) {
      const pallet = await prisma.pallet.create({
        data: {
          shipping_id: shipping.id,
          pallet_number: p,
          is_closed: faker.datatype.boolean({ probability: 0.5 }),
          is_validated: isFinished,
        },
      })
      palletCount++

      // 1-3 weight-fish line items per pallet
      const lineItemCount = faker.number.int({ min: 1, max: 3 })
      for (let j = 0; j < lineItemCount; j++) {
        const sfc = faker.helpers.arrayElement(shippingFishCategoryRecords)

        const wrappingWeightTypes = await prisma.wrapping_weight_type.findMany({
          where: { fish_category_id: sfc.fish_category_id },
        })
        if (!wrappingWeightTypes.length) continue

        const weightType = faker.helpers.arrayElement(wrappingWeightTypes)
        const quality = qualities.length ? faker.helpers.arrayElement(qualities) : null

        await prisma.shipping_weight_fish.create({
          data: {
            shipping_Fish_category_id: sfc.id,
            wrapping_weight_type_id: weightType.id,
            pallet_id: pallet.id,
            quality_id: quality ? quality.id : 1,
            weight: faker.number.float({ min: 5, max: 300, fractionDigits: 2 }),
            box: faker.number.int({ min: 1, max: 40 }),
            box_type: faker.helpers.arrayElement<Box_type>(['CELLOPHANE', 'CARTON']),
            wrapping_type: faker.helpers.arrayElement<Wrapping_type>(['BLOCK', 'IQF']),
          },
        })
        weightFishCount++
      }
    }
  }

  console.log(
    `✅ Shipping seeded (${shippingCount}), Shipping_Fish_category (${shippingFishCategoryCount}), Pallet (${palletCount}), Shipping_weight_fish (${weightFishCount})`
  )
}

async function main() {
  console.log("seeder starting... ")

  await createSuperAdmin()
  await seedQuality()
  await seedCompany()
  await seedFishCategory()
  await seedWeightType()
  await seedWrappingWeightType()
  const roleIds = await seedOperationalRoles()
  await seedSuppliers()
  await seedClients()
  await seedUsers(roleIds)
  await seedReceptions()
  await seedWrappings()
  await seedShippings()
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
