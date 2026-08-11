import * as dotenv from 'dotenv'
dotenv.config()

import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
console.log('Connection string:', connectionString?.substring(0, 60) + '...')

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Use HTTP-based neon() - works over port 443 (bypasses corporate firewall blocking 5432)
const sql = neon(connectionString)

async function main() {
  console.log('Starting seed with HTTP-based connection...')

  // Clear existing data
  await sql`DELETE FROM "feedback_scores"`
  await sql`DELETE FROM "feedback"`
  await sql`DELETE FROM "feedback_cycles"`
  await sql`DELETE FROM "manager_relationships"`
  await sql`DELETE FROM "feedback_parameters"`
  await sql`DELETE FROM "users"`
  await sql`DELETE FROM "companies"`
  console.log('Cleared existing data')

  // Create the 5 feedback parameters
  const params = await sql`
    INSERT INTO "feedback_parameters" (name, description, display_order)
    VALUES 
      ('ownership', 'Takes responsibility for work and outcomes', 1),
      ('communication', 'Clearly expresses ideas and keeps stakeholders informed', 2),
      ('quality_of_work', 'Delivers accurate, thorough, high-quality work', 3),
      ('teamwork', 'Collaborates effectively and supports team members', 4),
      ('initiative', 'Proactively seeks opportunities for improvement', 5)
    RETURNING id, name
  `
  console.log('Created feedback parameters')

  const passwordHash = await bcrypt.hash('password123', 10)

  // Create Ashoka Textiles
  const [ashoka] = await sql`
    INSERT INTO "companies" (name) VALUES ('Ashoka Textiles') RETURNING id
  `

  // Create Ashoka users
  const [rohan] = await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles)
    VALUES (${ashoka.id}, 'rohan@ashoka.com', ${passwordHash}, 'Rohan Sharma', ARRAY['employee', 'manager'])
    RETURNING id
  `
  const [priya] = await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles)
    VALUES (${ashoka.id}, 'priya@ashoka.com', ${passwordHash}, 'Priya Patel', ARRAY['employee', 'manager'])
    RETURNING id
  `
  await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles)
    VALUES (${ashoka.id}, 'hr@ashoka.com', ${passwordHash}, 'Meera Singh', ARRAY['employee', 'hr'])
  `

  // 6 employees for Ashoka
  const ashokaEmps = await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles) VALUES
      (${ashoka.id}, 'amit@ashoka.com', ${passwordHash}, 'Amit Kumar', ARRAY['employee']),
      (${ashoka.id}, 'neha@ashoka.com', ${passwordHash}, 'Neha Gupta', ARRAY['employee']),
      (${ashoka.id}, 'vikram@ashoka.com', ${passwordHash}, 'Vikram Reddy', ARRAY['employee']),
      (${ashoka.id}, 'ananya@ashoka.com', ${passwordHash}, 'Ananya Iyer', ARRAY['employee']),
      (${ashoka.id}, 'rahul@ashoka.com', ${passwordHash}, 'Rahul Verma', ARRAY['employee']),
      (${ashoka.id}, 'pooja@ashoka.com', ${passwordHash}, 'Pooja Desai', ARRAY['employee'])
    RETURNING id
  `
  console.log('Created Ashoka Textiles users')

  // Manager relationships for Ashoka
  await sql`INSERT INTO "manager_relationships" (company_id, manager_id, direct_report_id, start_date)
    VALUES (${ashoka.id}, ${rohan.id}, ${priya.id}, '2024-01-01')`
  
  for (const emp of ashokaEmps) {
    await sql`INSERT INTO "manager_relationships" (company_id, manager_id, direct_report_id, start_date)
      VALUES (${ashoka.id}, ${priya.id}, ${emp.id}, '2024-01-01')`
  }
  console.log('Created Ashoka manager relationships')


  // Create Bright Path Consulting
  const [brightPath] = await sql`
    INSERT INTO "companies" (name) VALUES ('Bright Path Consulting') RETURNING id
  `
  const [founder] = await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles)
    VALUES (${brightPath.id}, 'sarah@brightpath.com', ${passwordHash}, 'Sarah Johnson', ARRAY['employee', 'manager'])
    RETURNING id
  `
  await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles)
    VALUES (${brightPath.id}, 'hr@brightpath.com', ${passwordHash}, 'David Chen', ARRAY['employee', 'hr'])
  `

  // 8 employees for Bright Path
  const bpEmps = await sql`
    INSERT INTO "users" (company_id, email, password_hash, name, roles) VALUES
      (${brightPath.id}, 'michael@brightpath.com', ${passwordHash}, 'Michael Brown', ARRAY['employee']),
      (${brightPath.id}, 'emily@brightpath.com', ${passwordHash}, 'Emily Davis', ARRAY['employee']),
      (${brightPath.id}, 'james@brightpath.com', ${passwordHash}, 'James Wilson', ARRAY['employee']),
      (${brightPath.id}, 'lisa@brightpath.com', ${passwordHash}, 'Lisa Anderson', ARRAY['employee']),
      (${brightPath.id}, 'robert@brightpath.com', ${passwordHash}, 'Robert Martinez', ARRAY['employee']),
      (${brightPath.id}, 'jennifer@brightpath.com', ${passwordHash}, 'Jennifer Taylor', ARRAY['employee']),
      (${brightPath.id}, 'william@brightpath.com', ${passwordHash}, 'William Thomas', ARRAY['employee']),
      (${brightPath.id}, 'amanda@brightpath.com', ${passwordHash}, 'Amanda Garcia', ARRAY['employee'])
    RETURNING id
  `
  console.log('Created Bright Path users')

  for (const emp of bpEmps) {
    await sql`INSERT INTO "manager_relationships" (company_id, manager_id, direct_report_id, start_date)
      VALUES (${brightPath.id}, ${founder.id}, ${emp.id}, '2024-01-01')`
  }
  console.log('Created Bright Path manager relationships')


  // Create feedback cycles for both companies
  const now = new Date()
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  
  const createCycles = async (companyId: string) => {
    const cycles = []
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endD = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      const name = `${months[d.getMonth()]} ${d.getFullYear()}`
      const [cycle] = await sql`
        INSERT INTO "feedback_cycles" (company_id, name, start_date, end_date)
        VALUES (${companyId}, ${name}, ${d.toISOString()}, ${endD.toISOString()})
        RETURNING id, end_date
      `
      cycles.push(cycle)
    }
    return cycles
  }

  const ashokaCycles = await createCycles(ashoka.id)
  const bpCycles = await createCycles(brightPath.id)
  console.log('Created feedback cycles')

  // Helper to create feedback with scores
  const createFeedback = async (
    companyId: string, managerId: string, employeeId: string, 
    cycleId: string, submittedAt: Date
  ) => {
    const [fb] = await sql`
      INSERT INTO "feedback" (company_id, manager_id, employee_id, feedback_cycle_id, submitted_at)
      VALUES (${companyId}, ${managerId}, ${employeeId}, ${cycleId}, ${submittedAt.toISOString()})
      RETURNING id
    `
    const justifications = [
      'Consistently demonstrates strong performance in this area.',
      'Meets expectations and shows good progress.',
      'Excellent work, exceeds expectations regularly.'
    ]
    for (const p of params) {
      const score = Math.floor(Math.random() * 3) + 3
      const j = justifications[Math.floor(Math.random() * 3)]
      await sql`INSERT INTO "feedback_scores" (feedback_id, parameter_id, score, justification)
        VALUES (${fb.id}, ${p.id}, ${score}, ${j})`
    }
  }


  // Historical feedback for Ashoka - Rohan to Priya (past 2 cycles)
  await createFeedback(ashoka.id, rohan.id, priya.id, ashokaCycles[0].id, new Date(ashokaCycles[0].end_date))
  await createFeedback(ashoka.id, rohan.id, priya.id, ashokaCycles[1].id, new Date(ashokaCycles[1].end_date))

  // Priya to employees (past 2 cycles)
  for (const emp of ashokaEmps) {
    await createFeedback(ashoka.id, priya.id, emp.id, ashokaCycles[0].id, new Date(ashokaCycles[0].end_date))
    await createFeedback(ashoka.id, priya.id, emp.id, ashokaCycles[1].id, new Date(ashokaCycles[1].end_date))
  }

  // Current cycle - Priya has given feedback to 3 of 6 (partial)
  for (let i = 0; i < 3; i++) {
    await createFeedback(ashoka.id, priya.id, ashokaEmps[i].id, ashokaCycles[2].id, new Date())
  }
  console.log('Created Ashoka feedback')

  // Historical feedback for Bright Path (past 2 cycles)
  for (const emp of bpEmps) {
    await createFeedback(brightPath.id, founder.id, emp.id, bpCycles[0].id, new Date(bpCycles[0].end_date))
    await createFeedback(brightPath.id, founder.id, emp.id, bpCycles[1].id, new Date(bpCycles[1].end_date))
  }

  // Current cycle - founder has given feedback to 4 of 8 (partial)
  for (let i = 0; i < 4; i++) {
    await createFeedback(brightPath.id, founder.id, bpEmps[i].id, bpCycles[2].id, new Date())
  }
  console.log('Created Bright Path feedback')

  console.log('\n========================================')
  console.log('Seed completed successfully!')
  console.log('========================================')
  console.log('\nDemo Credentials (password: password123):')
  console.log('\nAshoka Textiles:')
  console.log('  Manager: rohan@ashoka.com, priya@ashoka.com')
  console.log('  HR: hr@ashoka.com')
  console.log('  Employees: amit@ashoka.com, neha@ashoka.com, etc.')
  console.log('\nBright Path Consulting:')
  console.log('  Manager: sarah@brightpath.com')
  console.log('  HR: hr@brightpath.com')
  console.log('  Employees: michael@brightpath.com, emily@brightpath.com, etc.')
}

main().catch((e) => {
  console.error('Seed error:', e)
  process.exit(1)
})
