<div align="center">
    <img src="https://images.emojiterra.com/twitter/512px/1f355.png" alt="JavaScriptLogo" width="100">
  </a>

  <h3 align="center">Valex</h3>
  <div align="center">
    18th Project of Driven Education
    <br />
  </div>
  <div align="center">
    An API Project to manage benefit cards
    <br />
  </div>
</div>

<div align="center">
  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" height="30px" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px" />
  

  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<!-- Table of Contents -->

<div align="center" style="margin-top: 50px">
    <h1> Project Guide</h1>
</div>

## Features

-   Get the card balance and transactions
-   Create cards
-   Activate / Block / Unlock a card
-   Recharge a card
-   Make card payments with online payment option

</br>

<div align="center" >
    <h1> API Reference</h1>
</div>

<details style="margin-bottom: 10px">
<summary style="font-size: 20px; color: #7E7E7E">TL;DR</summary>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #9FE58A">POST</span> /cards/:employeeId/create</summary>

Header:
```json
{
    "x-api-key": string
}
```

Body:
```json
{
    "type": string
}

```

Response: 
```json
{
  "id": 1,
  "number": "1111-1111-1111-1111",
  "employeeId": 1,
  "cardholderName": "FULANO R SILVA",
  "securityCode": "111",
  "expirationDate": "09/27",
  "isVirtual": false,
  "isBlocked": true,
  "type": "education"
}
```
</details>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #76B1F8">PATCH</span> /cards/:cardId/active</summary>
Body:


```json
{
    "secutiryCode": string,
    "password": string
}
```
</details>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #76B1F8">PATCH</span> /cards/:cardId/block</summary>

Body: 

```json
{
    "password": string
}
```
</details>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #76B1F8">PATCH</span> /cards/:cardId/unlock</summary>

Body:

```json
{
    "password": string
}
```
</details>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #F0F170">GET</span> /cards/:cardId</summary>

Response:

```json
{
  "balance": 35000,
  "transactions": [
		{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 }
	]
  "recharges": [
		{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
	]
}
```
</details>
  
<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #9FE58A">POST</span> recharges/:cardId/recharge</summary>

Header:
```json
{
    "x-api-key": string
}
```

Body:

```json
{
    "amount": integer,
}
```
</details>

<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #9FE58A">POST</span> /payments/:cardId/:businessId/pos</summary>

Body: 
```json
{
    "password": string,
    "amount": integer 
}
```
</details>
  
<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #9FE58A">POST</span> /cards/virtual/:employeeId/create</summary>

Body:
  
```json
{
    "password": string
}

```

Response: 
  
```json
{
  "id": 2,
  "number": "1111-1111-1111-1111",
  "employeeId": 1,
  "cardholderName": "FULANO R SILVA",
  "securityCode": "111",
  "expirationDate": "09/27",
  "isVirtual": true,
  "isBlocked": false,
  "originalCardId": 1,
  "type": "education"
}
```
</details>
  
<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #F0F170">DELETE</span> /cards/virtual/:cardId</summary>

Body:

```json
{
  "password": string
}
```
</details>
  
<details style="margin: 10px">
<summary style="font-size: 18px"> <span style="font-weight:700; margin-right:10px; color: #9FE58A">POST</span> /payments/:cardId/:businessId/online</summary>

Body: 
```json
{
  "amount": number,
  "number": "1111-1111-1111-1111",
  "cardholderName": string,
  "expirationDate": "09/27",
  "securityCode": "111"
}
```
</details>

</details>




# 

### Create a card

```http
POST /cards/:cardId/create
```

#### Request:

| Body         | Type     | Description                              |
| :------------| :------- | :--------------------------------------- |
| `type`       | `string` | **Required**. type of card benefit       |

`Valid types: [groceries, restaurant, transport, education, health]`

####

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

</br>

#### Response:

```json
{
  "id": 1,
  "number": "1111-1111-1111-1111",
  "employeeId": 1,
  "cardholderName": "FULANO R SILVA",
  "securityCode": "111",
  "expirationDate": "09/27",
  "isVirtual": false,
  "isBlocked": true,
  "type": "education"
}
```

#

### Activate a card

```http
PATCH /cards/:cardId/active
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `securityCode`   | `string` | **Required**. card cvv             |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

`CVV max length: 3`

`CVV pattern: only numbers`

### Block a card

```http
PATCH /cards/:cardId/block
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

#

### Unlock a card

```http
PATCH /cards/:cardId/unlock
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

#

### Get card balance

```http
GET /cards/:cardId
```

### Response:

```json
{
"balance": 35000,
"transactions": [
{ "id": 1, "cardId": 1, "businessId": 1, "businessName": "DrivenEats", "timestamp": "22/01/2022", "amount": 5000 },{...},{...}
],
"recharges": [
{ "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 },{...},{...}
]
}
```

#

### Card payment pos

```http
POST /payments/:cardId/:businessId/pos
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `password`   | `string`  | **Required**. card password        |
| `amount`          | `integer` | **Required**. payment value        |

#

#

### Recharge a card

```http
POST /recharges/:cardId/recharge
```

#### Request:

| Headers     | Type     | Description           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. api key |

####

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `amount`          | `integer` | **Required**. recharge amount      |


#

# 

### Create a virtual card

```http
POST /cards/virtual/:cardId/create
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `password`   | `string`  | **Required**. card password        |

#### Response:

```json
{
  "id": 2,
  "number": "1111-1111-1111-1111",
  "employeeId": 1,
  "cardholderName": "FULANO R SILVA",
  "securityCode": "111",
  "expirationDate": "09/27",
  "isVirtual": false,
  "isBlocked": true,
  "originalCardId": 1,
  "type": "education"
}
```

#

#

### Delete a virtual card

```http
DELETE /cards/virtual/:cardId
```

#### Request:

| Body             | Type     | Description                        |
| :--------------- | :------- | :--------------------------------- |
| `password`       | `string` | **Required**. card password        |

`Password length: 4`

`Password pattern: only numbers`

#

# 

### Card payment online

```http
POST /payments/:cardId/:businessId/online
```

#### Request:

| Body             | Type      | Description                        |
| :--------------- | :-------- | :--------------------------------- |
| `amount`          | `integer` | **Required**. recharge amount     |
| `number`          | `string` | **Required**. card number     |
| `cardholderName`          | `string` | **Required**. card holder name     |
| `expirationDate`          | `string` | **Required**. card expiration date     |
| `securityCode`          | `string` | **Required**. card cvv     |


#### Response:

```json
{
  "amount": number,
  "number": "1111-1111-1111-1111",
  "cardholderName": string,
  "expirationDate": "09/27",
  "securityCode": "111"
}
```

#

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL = postgres://YOUR-USER-NAME:YOUR-PASSWORD@Hostname:5432/DatabaseName`

`PORT = number `

`CRYPTR_SECRET_KEY = any string`

`MODE = 'DEV'`


# 

## Run Locally

Clone the project

```bash
  git clone https://github.com/DanielL29/projeto18-valex
```

Go to the project directory

```bash
  cd projeto18-valex/
```

Install dependencies

```bash
  npm install
```

Create database

```bash
  cd src/database
```
```bash
  bash ./create-database
```
```bash
  cd ../../
```

Start the server

```bash
  npm run dev
```

</br>

# 

## Lessons Learned
- API Architecture
- TypeScript interfaces
- TypeScript types
- Classes
- Constructor
- Object Literals
# 

## Acknowledgements

-   [Badges for Github](https://dev.to/envoy_/150-badges-for-github-pnk)
-   [README inspiration](https://github.com/andrezopo/projeto18-valex#readme)

#

## Authors

-   Daniel Lucas Ederli


