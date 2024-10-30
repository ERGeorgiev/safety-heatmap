# Contract

## **POST** `safetyheatmap/report/add`

### Request

```json
Accept: application/json
Content-Type: application/json
User-Agent: curl/8.6.0
{
    "Pos": {
        "Lat": 52.404200,
        "Lon": -2.701379,
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
    "Size": 'S',
    "Range": {
        "TopLeft": {
            "Lat": 52.404200,
            "Lon": -2.701379,
        },
        "BottomRight": {
            "Lat": 52.405200,
            "Lon": -2.701379,
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
    "Size": 'S',
    "Points": [
        {
            "Lat": 52.404200,
            "Lon": -2.701379,
            "Intensity": 0.1
        },
        {
            "Lat": 52.404200,
            "Lon": -2.701379,
            "Intensity": 1
        }
    ]
}
```

