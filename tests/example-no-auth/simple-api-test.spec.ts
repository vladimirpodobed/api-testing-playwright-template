import { StatusCodes } from 'http-status-codes'
import { expect, test } from '@playwright/test'

test('get product with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://shop.tl-academy.ee/api/products/1')

  // Parse raw response body to JSON
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response body
  console.log('response body:', responseBody)

  // Check that the response status is 200
  expect(statusCode).toBe(StatusCodes.OK)
})

test('post product with correct data should receive code 201', async ({ request }) => {
  // Prepare request body with only mandatory fields
  const requestBody = {
    name: 'Orange',
    category: 'Fruit',
    price: 2.39,
  }

  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
  })

  // Parse raw response body to JSON
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)

  // Check that the response status is 201
  expect(statusCode).toBe(StatusCodes.CREATED)

  // Check that body.name is string type
  expect(typeof responseBody.name).toBe('string')

  // Check that body.price is number type
  expect(typeof responseBody.price).toBe('number')
})

test('post product with correct mandatory data and quantity should receive code 201', async ({
  request,
}) => {
  // Prepare request body with mandatory fields
  const requestBody = {
    name: 'Kiwi',
    category: 'Fruit',
    price: 2.39,
    quantity: 25, // optional field set explicitly
  }

  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
  })

  // Parse raw response body to JSON
  const responseBody = await response.json()
  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  console.log('response body:', responseBody)

  expect(statusCode).toBe(StatusCodes.CREATED)
  expect(responseBody.quantity).toBe(25)
  expect(responseBody.available).toBeTruthy()
})

test('failed to create product with missing mandatory name should receive code 400', async ({
  request,
}) => {
  // Prepare request body with only mandatory fields
  const requestBody = {
    // name: 'Kiwi',
    category: 'Fruit',
    price: 2.39,
  }

  // Send a POST request to the server
  const response = await request.post('https://shop.tl-academy.ee/api/products', {
    data: requestBody,
  })

  // Parse raw response body to JSON
  // const responseBody = await response.json()

  const statusCode = response.status()

  // Log the response status and body
  console.log('response status:', statusCode)
  // console.log('response body:', responseBody)

  expect(statusCode).toBe(StatusCodes.BAD_REQUEST)

  // expect(responseBody.quantity).toBe(25)
  // expect(responseBody.available).toBeTruthy()
})
