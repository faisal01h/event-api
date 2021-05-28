# Promotin

[![Repository version](https://img.shields.io/badge/version-0.0.2-brightred)](https://github.com/faisal01h/event-api)

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
                    "Sertifikat": "String with value Ya/Tidak, optional",
                    "lainnya": "optional"
                },
                "2": {
                    "uang": 700000,
                    "Sertifikat": "String with value Ya/Tidak, optional",
                    "lainnya": "optional"
                }
            },
            "benefits": {
                "konsumsi": "optional",
                "serifikat": "String with value Ya/Tidak, optional",
                "lainnya": "optional"
            }
        }
    },
    "authorId": "60x729hq2example",
    "visibility": Boolean,
    "createdAt": Date,
    "updatedAt": Date,
    "__v": 0
}

```