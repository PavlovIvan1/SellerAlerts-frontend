import axios from 'axios'
import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = 'https://api.test.seller-alert.com'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

if (!ACCESS_TOKEN) {
  console.error('ACCESS_TOKEN env var is required. Example: ACCESS_TOKEN=eyJ... npm run sync:dashboards')
  process.exit(1)
}

async function fetchDashboards(supplierId) {
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
    supplier_id: supplierId,
    offset: 0,
    limit: 100,
    sort_by: 'created_at',
    order: 'DESC',
  }

  const { data } = await client.get('/dashboards', { params })
  if (!data || !Array.isArray(data.data)) {
    throw new Error('Unexpected response format from /dashboards')
  }
  return data.data
}

async function writeDashboardJson(dashboards, supplierId) {
  const targetPath = path.resolve(process.cwd(), 'src', 'data', `dashboard-${supplierId}.json`)
  const json = JSON.stringify(dashboards, null, 2) + '\n'
  await fs.writeFile(targetPath, json, 'utf-8')
  console.log(`Wrote ${dashboards.length} dashboards for supplier ${supplierId} to ${targetPath}`)
}

async function main() {
  const supplierId = process.argv[2]
  
  if (!supplierId) {
    console.error('Usage: npm run sync:dashboards <supplier_id>')
    console.error('Example: npm run sync:dashboards supplier-123')
    process.exit(1)
  }

  try {
    const dashboards = await fetchDashboards(supplierId)
    await writeDashboardJson(dashboards, supplierId)
  } catch (err) {
    console.error('Failed to sync dashboards:', err.response?.data || err.message)
    process.exit(1)
  }
}

main()
