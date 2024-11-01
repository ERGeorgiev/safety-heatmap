# Contract

## **POST** `safetyheatmap/report/add`

### Request

```json
Accept: application/json
Content-Type: application/json
User-Agent: curl/8.6.0

{
    "pos": {
        "lat": 52.404200,
        "lon": -2.701379,
    }
}
```

### Response

Success: **200 OK**

## POST `safetyheatmap/heatmap/get`

### Request

```json
Accept: application/json
Content-Type: application/json
User-Agent: curl/8.6.0

{
    "size": "S",
    "range": {
        "topLeft": {
            "lat": 52.404200,
            "lon": -2.701379,
        },
        "bottomRight": {
            "lat": 52.405200,
            "lon": -2.701379,
        },
    }
}
```

### Response

```json
Content-Type: application/json
Content-Encoding: gzip
Content-Length: 64
Cache-Control: max-age=3600

{
    "size": "S",
    "points": [
        {
            "lat": 52.404200,
            "lon": -2.701379,
            "intensity": 0.1
        },
        {
            "lat": 52.404200,
            "lon": -2.701379,
            "intensity": 1
        }
    ]
}
```

