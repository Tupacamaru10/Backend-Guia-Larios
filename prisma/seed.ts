import 'dotenv/config'
import { PrismaClient, Role } from '../generated/prisma/index.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import * as bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // 1. Limpiar datos existentes (orden importante por las FK)
  console.log('Cloning existing data...')
  await prisma.user.deleteMany()
  console.log('Users deleted')
  await prisma.tenant.deleteMany()
  console.log('Tenants deleted')

  // 2. Crear tenants
  console.log('Creating tenants...')
  const techSolutions = await prisma.tenant.create({
    data: { name: 'Tech Solutions S.A.' },
  })
  const marketingPro = await prisma.tenant.create({
    data: { name: 'Marketing Pro' },
  })
  const consultingExp = await prisma.tenant.create({
    data: { name: 'Consulting Experts' },
  })

  // 3. Encriptar contraseñas
  const hashedPassword = await bcrypt.hash('Password123!', 10)

  // 4. Crear usuarios asociados a cada tenant
  console.log('Creating users...')
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@techsolutions.com',
        name: 'Ana Admin',
        password: hashedPassword,
        telephone: '+50688881111',
        role: Role.ADMIN,
        tenantId: techSolutions.id,
      },
      {
        email: 'user@techsolutions.com',
        name: 'Pedro Pérez',
        password: hashedPassword,
        telephone: '+50688882222',
        role: Role.USER,
        tenantId: techSolutions.id,
      },
      {
        email: 'manager@marketingpro.com',
        name: 'María Manager',
        password: hashedPassword,
        telephone: '+50688883333',
        role: Role.ADMIN,
        tenantId: marketingPro.id,
      },
      {
        email: 'user@marketingpro.com',
        name: 'Luis López',
        password: hashedPassword,
        telephone: '+50688884444',
        role: Role.USER,
        tenantId: marketingPro.id,
      },
      {
        email: 'admin@consulting.com',
        name: 'Carlos Consultor',
        password: hashedPassword,
        telephone: '+50688885555',
        role: Role.ADMIN,
        tenantId: consultingExp.id,
      },
    ],
  })

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })