#!/usr/bin/env node

const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000'
const shouldDelete = process.argv.includes('--delete')

const headers = {
  'Content-Type': 'application/json'
}

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

async function run() {
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
