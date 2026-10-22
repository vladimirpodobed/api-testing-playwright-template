
// Импортируем expect для проверок и test для создания автотестов Playwright.
import { expect, test } from '@playwright/test'

// Импортируем константы HTTP-статусов.
import { StatusCodes } from 'http-status-codes'

// Импортируем DTO-класс для создания аккаунта.
import { AccountDto } from '../../dto/account-dto'

// Тест 1: проверяем получение информации об аккаунте с ID 1.
test('get account info with correct id should receive code 200', async ({ request }) => {
  // Отправляем GET-запрос для получения информации об аккаунте.
  const response = await request.get('https://shop.tl-academy.ee/api/accounts/1', {
    // Передаём API-ключ в HTTP-заголовке.
    headers: { 'X-API-KEY': 'my-api-key' },
  })

  // Читаем тело ответа и преобразуем JSON в JavaScript-объект.
  const responseBody = await response.json()

  // Получаем HTTP-статус ответа.
  const statusCode = response.status()

  // Выводим тело ответа в терминал для проверки.
  console.log('response body:', responseBody)

  // Проверяем, что сервер вернул статус 200 OK.
  expect(statusCode).toBe(StatusCodes.OK)
})

// Тест 2: создаём аккаунт и пополняем его баланс.
test('create account with correct payload should receive code 201', async ({ request }) => {
  // Отправляем POST-запрос для создания нового аккаунта.
  const response = await request.post('https://shop.tl-academy.ee/api/accounts', {
    // Передаём API-ключ для авторизации запроса.
    headers: { 'X-API-KEY': 'my-api-key' },

    // Передаём данные аккаунта с помощью DTO-класса.
    data: new AccountDto('Mark', 'USD'),
  })

  // Преобразуем тело ответа в JavaScript-объект.
  const responseBody = await response.json()

  // Выводим ответ сервера в терминал.
  console.log('response body:', responseBody)

  // Получаем HTTP-статус создания аккаунта.
  const statusCode = response.status()

  // Сохраняем ID созданного аккаунта из ответа.
  const accountId = responseBody.id

  // Выводим ID аккаунта в терминал.
  console.log('account id:', accountId)

  // Проверяем, что сервер подтвердил создание аккаунта статусом 201 Created.
  expect(statusCode).toBe(StatusCodes.CREATED)

  // Проверяем, что сервер вернул ID созданного аккаунта.
  expect(accountId).toBeDefined()

  // STEP 2: пополняем баланс созданного аккаунта.

  // Собираем URL депозита из базового адреса, ID аккаунта и endpoint.
  const depositUrl = 'https://shop.tl-academy.ee/api/accounts/' + accountId + '/deposit'

  // Отправляем POST-запрос на пополнение баланса.
  const depositResponse = await request.post(depositUrl, {
    // Передаём API-ключ для авторизации запроса.
    headers: { 'X-API-KEY': 'my-api-key' },

    // Передаём предполагаемую сумму пополнения.
    data: { amount: 100 },
  })

  // Выводим HTTP-статус ответа на депозит.
  console.log('deposit status:', depositResponse.status())

  // Преобразуем JSON-ответ на депозит в JavaScript-объект.
  const depositBody = await depositResponse.json()

  // Выводим тело ответа на депозит в терминал.
  console.log('deposit response:', depositBody)

  // Проверяем, что депозит завершился со статусом 200 OK.
  expect(depositResponse.status()).toBe(StatusCodes.OK)

  // Проверяем, что баланс после пополнения равен 100.
  expect(depositBody.balance).toBe(100)

  // Проверяем, что ID аккаунта в ответе совпадает с созданным аккаунтом.
  expect(depositBody.id).toBe(accountId)

  // Проверяем, что валюта аккаунта — USD.
  expect(depositBody.currency).toBe('USD')
})

