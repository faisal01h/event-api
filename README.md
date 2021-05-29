# Promotin

[![Repository version](https://img.shields.io/badge/version-0.0.2-brightred)](https://github.com/faisal01h/event-api)

## Implementation

### API Endpoints
- GET `<host>:<port>/api/v1/items/all` : Show all item listings
- GET `<host>:<port>/api/v1/items/filtered` : Show filtered listings specified in request body
- GET `<host>:<port>/api/v1/items/paginated?page&perPage` : Shows paginated item listings
- POST `<host>:<port>/api/v1/items/new` : Post new item with details specified in request body
- GET `<host>:<port>/api/v1/items/view/:id` : Show item with the given ID
- PUT `<host>:<port>/api/v1/items/view/:id` : Updates the item with the given ID providing the user has sufficient privileges. Request header must contain Authorization with value bearer token.
- PUT `<host>:<port>/api/v1/items/unlist/:id` : Delete item with the given ID providing the user has sufficient privileges. Request header must contain Authorization with value bearer token.

- POST `<host>:<port>/api/v1/auth/login` : Login endpoint, returns bearer token.
- POST `<host>:<port>/api/v1/auth/register` : Register endpoint

## API responses

### Item model standard response
`Content-Type: application/json`

```
{
    "id": "60a11123example"
    "title": "Example title",
    "tingkatan": "SD;SMP;SMA;Mahasiswa;Umum;",
    "daerah": "Kota Surabaya, Jawa Timur;Kab. Sidoarjo, Jawa Timur;",
    "description": {
        "desc": "Example description text",
        "rewards": {
            "prize": {
                "1": {
                    "uang": 1000000,
                    "sertifikat": "String with value Ya/Tidak, optional",
                    "lainnya": "optional"
                },
                "2": {
                    "uang": 700000,
                    "sertifikat": "String with value Ya/Tidak, optional",
                    "lainnya": "optional"
                }
            },
            "benefits": {
                "konsumsi": "optional",
                "sertifikat": "String with value Ya/Tidak, optional",
                "lainnya": "optional"
            },
            "alur": [
                {
                    "date": Date,
                    "desc": "String"
                },
                {
                    "date": Date,
                    "desc": "String"
                }
            ]
        }
    },
    "authorId": "60x729hq2example",
    "visibility": Boolean,
    "createdAt": Date,
    "updatedAt": Date,
    "__v": 0
}

```