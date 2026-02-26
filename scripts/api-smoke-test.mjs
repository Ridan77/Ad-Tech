#!/usr/bin/env node

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
const shouldDelete = process.argv.includes('--delete')
const seedIndex = process.argv.indexOf('--seed')
const seedCount = seedIndex > -1 ? Number(process.argv[seedIndex + 1] || '20') : 0

const headers = {
  'Content-Type': 'application/json'
}

const funnyOwners = [
  'Captain Whiskerbeard',
  'Sir Barksalot',
  'Lady Meowington',
  'Professor Fluff',
  'Count Droolula',
  'Noodle McSniff',
  'Pickle von Paws',
  'Biscuit Thunder',
  'Duke Wigglebottom',
  'Sassy Pants',
  'Cheddar McZoom',
  'Muffin Stardust',
  'Banjo Sprinkles',
  'Chaos Potato',
  'Yeti McFuzzy',
  'Tofu Rocket',
  'Pancake Ninja',
  'Waffle Bandit',
  'Taco Stardog',
  'Fuzzy McGee'
]

const funnyPets = [
  'Borkzilla',
  'Meowzart',
  'Fluffernutter',
  'Captain Snoot',
  'Biscotti',
  'Chewbecca',
  'Purrito',
  'Nugget',
  'Wiggles',
  'Ziggy Zoom',
  'Sir Hops',
  'Pickles',
  'Donut',
  'Nacho',
  'Mochi',
  'Tater Tot',
  'Snickers',
  'Boop',
  'Crouton',
  'Bubbles'
]

const petTypes = ['dog', 'cat', 'parrot']

function logStep(title, data) {
  console.log(`\n[${title}]`)
  console.log(JSON.stringify(data, null, 2))
}

async function callApi(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options)
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      `Request failed: ${options.method || 'GET'} ${path} -> ${response.status}\n${JSON.stringify(body, null, 2)}`
    )
  }

  return body
}

function formatPhone(index) {
  const middleDigit = index % 10
  const lastSeven = String((index * 7919) % 10000000).padStart(7, '0')
  return `05${middleDigit}-${lastSeven}`
}

function makeBirthDate(index) {
  const year = 2014 + (index % 10)
  const month = String((index % 12) + 1).padStart(2, '0')
  const day = String(((index * 3) % 28) + 1).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildSeedPayload(index) {
  const owner = funnyOwners[index % funnyOwners.length]
  const pet = funnyPets[index % funnyPets.length]
  const petType = petTypes[index % petTypes.length]

  return {
    name: owner,
    phone: formatPhone(index + 100),
    petName: pet,
    petBirthDate: makeBirthDate(index),
    petType,
    notes: `demo seed #${index + 1}`
  }
}

async function runSeed(count) {
  const total = Number.isFinite(count) && count > 0 ? Math.floor(count) : 20
  console.log(`Seeding ${total} demo clients via API at ${baseUrl}`)

  for (let index = 0; index < total; index += 1) {
    const payload = buildSeedPayload(index)
    const created = await callApi('/api/clients', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
    console.log(`Created ${index + 1}/${total}: ${created?.data?.name} -> ${created?.data?.petName}`)
  }

  const listed = await callApi('/api/clients')
  logStep('SEEDED_TOTAL', { count: listed?.data?.length || 0 })
  console.log('\nSeed completed successfully')
}

async function run() {
  if (seedCount > 0) {
    await runSeed(seedCount)
    return
  }

  console.log(`Running API smoke test against ${baseUrl}`)

  const createPayload = {
    name: 'Smoke Test Owner',
    phone: '050-1234567',
    petName: 'Pixel',
    petBirthDate: '2021-06-10',
    petType: 'dog',
    notes: 'created by smoke test'
  }

  const created = await callApi('/api/clients', {
    method: 'POST',
    headers,
    body: JSON.stringify(createPayload)
  })
  logStep('CREATE', created)

  const createdId = created?.data?.id
  if (!createdId) {
    throw new Error('Create response does not include data.id')
  }

  const listed = await callApi('/api/clients')
  logStep('LIST', listed)

  const single = await callApi(`/api/clients/${createdId}`)
  logStep('GET_BY_ID', single)

  const updatePayload = {
    notes: 'updated by smoke test'
  }
  const updated = await callApi(`/api/clients/${createdId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updatePayload)
  })
  logStep('UPDATE', updated)

  if (shouldDelete) {
    const deleted = await callApi(`/api/clients/${createdId}`, {
      method: 'DELETE'
    })
    logStep('DELETE', deleted)
  }

  console.log('\nSmoke test completed successfully')
}

run().catch(error => {
  console.error('\nSmoke test failed')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
