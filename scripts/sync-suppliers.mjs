import axios from 'axios'
import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = 'https://api.test.seller-alert.com'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  console.error('ACCESS_TOKEN env var is required. Example: ACCESS_TOKEN=eyJ... npm run sync:suppliers')
  process.exit(1)
}

async function fetchSuppliers() {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${ACCESS_TOKEN}`,
    },
    withCredentials: true,
  })

  const params = {
    offset: 0,
    limit: 100,
    sort_by: 'created_at',
    order: 'DESC',
  }

  const { data } = await client.get('/suppliers', { params })
  if (!data || !Array.isArray(data.data)) {
    throw new Error('Unexpected response format from /suppliers')
  }
  return data.data
}

async function writePeopleJson(suppliers) {
  const targetPath = path.resolve(process.cwd(), 'src', 'data', 'people.json')
  const json = JSON.stringify(suppliers, null, 2) + '\n'
  await fs.writeFile(targetPath, json, 'utf-8')
  console.log(`Wrote ${suppliers.length} suppliers to ${targetPath}`)
}

try {
  const suppliers = await fetchSuppliers()
  await writePeopleJson(suppliers)
} catch (err) {
  console.error('Failed to sync suppliers:', err.response?.data || err.message)
  process.exit(1)
}


