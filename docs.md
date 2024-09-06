## API Docs

_localhost:8001_

### Authentication:

- **Access Token**: Include in `Authorization` header as a Bearer token.  
  Example:  
  `Authorization: Bearer {accessToken}`
- **Refresh Token**: Include in `x-refresh` header.  
  Example:  
  `x-refresh: {refreshToken}`

### Token Renewal:

- If the `accessToken` has expired but the `refreshToken` is valid, the server will issue a new access token in the response headers:
  - `x-access-token`: New access token
  - `x-refresh-token`: New refresh token (if applicable)

### Example Headers for Token-Based Requests:

```http
Authorization: Bearer {accessToken}
x-refresh: {refreshToken}
```

_============================================================================================_

## POST /signup

- **Method**: POST
- **Endpoint**: `/signup`

### Input:

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| username        | string | No       |
| email           | string | No       |
| phone           | string | Yes      |
| password        | string | No       |
| confirmPassword | string | No       |

_-------------------------------------------------------------------------------_

## POST /login

- **Method**: POST
- **Endpoint**: `/login`

### Input:

| Field    | Type   | Required |
| -------- | ------ | -------- |
| email    | string | Yes      |
| password | string | Yes      |

_-------------------------------------------------------------------------------_

## GET /customers

- **Method**: GET
- **Endpoint**: `/customers`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /find-customer

- **Method**: GET
- **Endpoint**: `/find-customer`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## POST /address

- **Method**: POST
- **Endpoint**: `/address`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| state         | string | Yes      |
| address1      | string | Yes      |
| postalCode    | string | Yes      |
| city          | string | Yes      |
| country       | string | Yes      |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## PUT /update-address

- **Method**: PUT
- **Endpoint**: `/update-address`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| state         | string | No       |
| address1      | string | No       |
| address2      | string | No       |
| postalCode    | string | No       |
| city          | string | No       |
| country       | string | No       |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Validation:

- **postalCode**: Must have a minimum length of 4 characters if provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## PUT /update-profile

- **Method**: PUT
- **Endpoint**: `/update-profile`
- **Role**: customer

### Input:

| Field           | Type   | Required |
| --------------- | ------ | -------- |
| username        | string | No       |
| email           | string | No       |
| phone           | string | No       |
| image           | string | No       |
| password        | string | No       |
| confirmPassword | string | No       |
| Authorization   | string | Yes      |
| x-refresh       | string | Yes      |

### Validation:

- **email**: Must be a valid email format.
- **phone**: Must be between 9 and 15 characters.
- **image**: Must be a valid URL if provided.
- **password**: Must be at least 8 characters if provided.
- **confirmPassword**: Must match the password if both are provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## GET /categories

- **Method**: GET
- **Endpoint**: `/categories`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /wine-categories

- **Method**: GET
- **Endpoint**: `/wine-categories`

_-------------------------------------------------------------------------------_

## GET /cocktail-categories

- **Method**: GET
- **Endpoint**: `/cocktail-categories`

_-------------------------------------------------------------------------------_

## POST /category

- **Method**: POST
- **Endpoint**: `/category`
- **Role**: admin

### Input:

| Field                | Type     | Required |
| -------------------- | -------- | -------- |
| titleTranslations.en | string   | Yes      |
| titleTranslations.ge | string   | Yes      |
| type                 | string   | Yes      |
| parentId             | objectId | No       |
| Authorization        | string   | Yes      |
| x-refresh            | string   | Yes      |

### Validation:

- **titleTranslations.en**: Must be at least 3 characters and is required in English.
- **titleTranslations.ge**: Must be at least 3 characters and is required in Georgian.
- **type**: Required.
- **parentId**: Optional.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /category/:catId

- **Method**: GET
- **Endpoint**: `/category/:catId`

_-------------------------------------------------------------------------------_

## PUT /category/:catId

- **Method**: PUT
- **Endpoint**: `/category/:catId`
- **Role**: admin

### Input:

| Field                | Type     | Required |
| -------------------- | -------- | -------- |
| titleTranslations.en | string   | No       |
| titleTranslations.ge | string   | No       |
| type                 | string   | No       |
| parentId             | objectId | No       |
| Authorization        | string   | Yes      |
| x-refresh            | string   | Yes      |

### Validation:

- **titleTranslations.en**: Must be at least 3 characters if provided, optional.
- **titleTranslations.ge**: Must be at least 3 characters if provided, optional.
- **type**: Optional.
- **parentId**: Optional.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## DELETE /delete-category/:catId

- **Method**: DELETE
- **Endpoint**: `/delete-category/:catId`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## POST /wine

- **Method**: POST
- **Endpoint**: `/wine`
- **Role**: admin

### Input:

| Field                       | Type     | Required |
| --------------------------- | -------- | -------- |
| image                       | string   | Yes      |
| price                       | string   | Yes      |
| year                        | string   | No       |
| alcohol                     | number   | No       |
| brand                       | string   | No       |
| available                   | boolean  | No       |
| discount                    | number   | No       |
| categoryId                  | objectId | Yes      |
| titleTranslations.en        | string   | Yes      |
| titleTranslations.ge        | string   | No       |
| descTranslations.en         | string   | Yes      |
| descTranslations.ge         | string   | No       |
| countryTranslations.en      | string   | No       |
| countryTranslations.ge      | string   | No       |
| regionTranslations.en       | string   | No       |
| regionTranslations.ge       | string   | No       |
| technologyTranslations.en   | string   | No       |
| technologyTranslations.ge   | string   | No       |
| familyCellarTranslations.en | string   | No       |
| familyCellarTranslations.ge | string   | No       |
| grapeVarietyTranslations.en | string   | No       |
| grapeVarietyTranslations.ge | string   | No       |
| Authorization               | string   | Yes      |
| x-refresh                   | string   | Yes      |

### Validation:

- **price**: Must be a positive number.
- **year**: Must be a valid 4-digit number if provided.
- **alcohol**: Must be between 0 and 100% if provided.
- **titleTranslations.en**: Required in English.
- **descTranslations.en**: Required in English.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## PUT /update-wine/:wineId

- **Method**: PUT
- **Endpoint**: `/update-wine/:wineId`
- **Role**: admin

### Input:

| Field                       | Type     | Required |
| --------------------------- | -------- | -------- |
| image                       | string   | No       |
| price                       | string   | No       |
| year                        | string   | No       |
| alcohol                     | number   | No       |
| brand                       | string   | No       |
| available                   | boolean  | No       |
| categoryId                  | objectId | No       |
| titleTranslations.en        | string   | No       |
| titleTranslations.ge        | string   | No       |
| descTranslations.en         | string   | No       |
| descTranslations.ge         | string   | No       |
| countryTranslations.en      | string   | No       |
| countryTranslations.ge      | string   | No       |
| regionTranslations.en       | string   | No       |
| regionTranslations.ge       | string   | No       |
| technologyTranslations.en   | string   | No       |
| technologyTranslations.ge   | string   | No       |
| familyCellarTranslations.en | string   | No       |
| familyCellarTranslations.ge | string   | No       |
| grapeVarietyTranslations.en | string   | No       |
| grapeVarietyTranslations.ge | string   | No       |
| Authorization               | string   | Yes      |
| x-refresh                   | string   | Yes      |

### Validation:

- **price**: Must be a positive number if provided.
- **year**: Must be a valid 4-digit number if provided.
- **alcohol**: Must be between 0 and 100% if provided.
- **titleTranslations.en**: Required if provided.
- **descTranslations.en**: Required if provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /wines

- **Method**: GET
- **Endpoint**: `/wines`

_-------------------------------------------------------------------------------_

## GET /wine/:wineId

- **Method**: GET
- **Endpoint**: `/wine/:wineId`

_-------------------------------------------------------------------------------_

## DELETE /delete-wine/:wineId

- **Method**: DELETE
- **Endpoint**: `/delete-wine/:wineId`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## POST /cocktail

- **Method**: POST
- **Endpoint**: `/cocktail`
- **Role**: admin

### Input:

| Field                       | Type     | Required |
| --------------------------- | -------- | -------- |
| image                       | string   | Yes      |
| url                         | string   | No       |
| price                       | string   | Yes      |
| alcohol                     | number   | No       |
| available                   | boolean  | No       |
| discount                    | number   | No       |
| categoryId                  | objectId | Yes      |
| translations.title.en       | string   | No       |
| translations.title.ge       | string   | No       |
| translations.description.en | string   | No       |
| translations.description.ge | string   | No       |
| translations.ingredients.en | array    | No       |
| translations.ingredients.ge | array    | No       |
| Authorization               | string   | Yes      |
| x-refresh                   | string   | Yes      |

### Validation:

- **url**: Must be a valid URL if provided.
- **price**: Must be a positive number.
- **alcohol**: Must be between 0 and 100% if provided.
- **discount**: Must be at least 0 if provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## PUT /update-cocktail/:cocktailId

- **Method**: PUT
- **Endpoint**: `/update-cocktail/:cocktailId`
- **Role**: admin

### Input:

| Field                       | Type     | Required |
| --------------------------- | -------- | -------- |
| image                       | string   | No       |
| url                         | string   | No       |
| price                       | string   | No       |
| alcohol                     | number   | No       |
| available                   | boolean  | No       |
| discount                    | number   | No       |
| categoryId                  | objectId | No       |
| translations.title.en       | string   | No       |
| translations.title.ge       | string   | No       |
| translations.description.en | string   | No       |
| translations.description.ge | string   | No       |
| translations.ingredients.en | array    | No       |
| translations.ingredients.ge | array    | No       |
| Authorization               | string   | Yes      |
| x-refresh                   | string   | Yes      |

### Validation:

- **url**: Must be a valid URL if provided.
- **price**: Must be a positive number if provided.
- **alcohol**: Must be between 0 and 100% if provided.
- **discount**: Must be at least 0 if provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /cocktail/:cocktailId

- **Method**: GET
- **Endpoint**: `/cocktail/:cocktailId`

_-------------------------------------------------------------------------------_

## GET /cocktails

- **Method**: GET
- **Endpoint**: `/cocktails`

_-------------------------------------------------------------------------------_

## DELETE /delete-cocktail/:cocktailId

- **Method**: DELETE
- **Endpoint**: `/delete-cocktail/:cocktailId`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## POST /feedback

- **Method**: POST
- **Endpoint**: `/feedback`
- **Role**: customer

### Input:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| productId     | objectId | Yes      |
| text          | string   | No       |
| rate          | number   | No       |
| productType   | string   | Yes      |
| Authorization | string   | Yes      |
| x-refresh     | string   | Yes      |

### Validation:

- **rate**: Must be between 1 and 5 if provided.
- **productType**: Must be either "wine" or "cocktail".

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## GET /customer-feedback/:author

- **Method**: GET
- **Endpoint**: `/customer-feedback/:author`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## GET /feedback

- **Method**: GET
- **Endpoint**: `/feedback`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## DELETE /delete-feedback/:feedId

- **Method**: DELETE
- **Endpoint**: `/delete-feedback/:feedId`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## POST /blog

- **Method**: POST
- **Endpoint**: `/blog`
- **Role**: admin

### Input:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| image         | string   | Yes      |
| url           | string   | No       |
| author        | objectId | Yes      |
| title         | string   | Yes      |
| text          | string   | Yes      |
| tags          | array    | Yes      |
| Authorization | string   | Yes      |
| x-refresh     | string   | Yes      |

### Validation:

- **url**: Must be a valid URL if provided.
- **title**: Must be at least 2 characters.
- **text**: Must be at least 2 characters.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## PUT /update-blog/:blogId

- **Method**: PUT
- **Endpoint**: `/update-blog/:blogId`
- **Role**: admin

### Input:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| image         | string   | No       |
| url           | string   | No       |
| author        | objectId | No       |
| title         | string   | No       |
| text          | string   | No       |
| tags          | array    | No       |
| comments      | objectId | No       |
| Authorization | string   | Yes      |
| x-refresh     | string   | Yes      |

### Validation:

- **url**: Must be a valid URL if provided.

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## GET /blog/:blogId

- **Method**: GET
- **Endpoint**: `/blog/:blogId`

_-------------------------------------------------------------------------------_

## GET /blogs

- **Method**: GET
- **Endpoint**: `/blogs`

_-------------------------------------------------------------------------------_

## GET /related-blogs/:blogId

- **Method**: GET
- **Endpoint**: `/related-blogs/:blogId`

_-------------------------------------------------------------------------------_

## DELETE /delete-blog/:blogId

- **Method**: DELETE
- **Endpoint**: `/delete-blog/:blogId`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## POST /comment

- **Method**: POST
- **Endpoint**: `/comment`
- **Role**: customer

### Input:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| blogId        | objectId | Yes      |
| comment       | string   | Yes      |
| Authorization | string   | Yes      |
| x-refresh     | string   | Yes      |

### Validation:

- **comment**: Must be at least 1 character.

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## PUT /update-comment/:commentId

- **Method**: PUT
- **Endpoint**: `/update-comment/:commentId`
- **Role**: customer

### Input:

| Field         | Type     | Required |
| ------------- | -------- | -------- |
| blogId        | objectId | No       |
| comment       | string   | No       |
| Authorization | string   | Yes      |
| x-refresh     | string   | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## GET /comment

- **Method**: GET
- **Endpoint**: `/comment`
- **Role**: admin

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `admin` role.

_-------------------------------------------------------------------------------_

## DELETE /delete-comment/:commentId

- **Method**: DELETE
- **Endpoint**: `/delete-comment/:commentId`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## POST /wishlist-item

- **Method**: POST
- **Endpoint**: `/wishlist-item`
- **Role**: customer

### Input:

| Field         | Type                 | Required |
| ------------- | -------------------- | -------- |
| productId     | string               | Yes      |
| title         | string               | Yes      |
| image         | string               | Yes      |
| url           | string or null       | No       |
| price         | string               | Yes      |
| productType   | "wine" or "cocktail" | Yes      |
| Authorization | string               | Yes      |
| x-refresh     | string               | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_

## POST /cart-item

- **Method**: POST
- **Endpoint**: `/cart-item`
- **Role**: customer

### Input:

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| productId     | string | Yes      |
| title         | string | Yes      |
| image         | string | Yes      |
| price         | string | Yes      |
| unit          | number | Yes      |
| Authorization | string | Yes      |
| x-refresh     | string | Yes      |

### Role Requirements:

- This endpoint can only be accessed by users with the `customer` role.

_-------------------------------------------------------------------------------_
