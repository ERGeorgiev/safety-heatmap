# Database Item Cell

A database item of type cell.

Helpful ink for DynamoDB item size calculation: https://zaccharles.github.io/dynamodb-calculator/

**Team Agreement**: Cells to expire within a year, we don't need data older than that.

# Fields

- Key - The partition key.
- Pos - The sort key.
- H1D - First half of the year, Day reports.
- H1N - First half of the year, Night reports.
- H2D - Second half of the year, Day reports.
- H2N - Second half of the year, Night reports.
- TimeToLive - When the item expires and will be deleted.

# Examples

## Example Item

```
{
    "Key": {
        "S": "ShTdGCP"
    },
    "Pos": {
        "S": "JFY6D"
    },
    "H1D": {
        "N": "123123"
    },
    "H1N": {
        "N": "123123"
    },
    "H2D": {
        "N": "123123"
    },
    "H2N": {
        "N": "123123"
    },
    "TimeToLive": {
        "N": "1730048842"
    }
}
```

**Size**: 64 Bytes
**Items per MB**: 15625

## Example Query Response

```
HTTP/1.1 200 OK
x-amzn-RequestId: <RequestId>
x-amz-crc32: <Checksum>
Content-Type: application/x-amz-json-1.0
Content-Length: <PayloadSizeBytes>
Date: <Date>
 {
    "ConsumedCapacity": {
        "CapacityUnits": 1,
        "TableName": "geohash"
    },
    "Count": 2,
    "Items": [
        {
            "Key": {
                "S": "ShTdGCP"
            },
            "Pos": {
                "S": "JFY6D"
            },
            "H1D": {
                "N": "123123"
            },
            "H1N": {
                "N": "123123"
            },
            "H2D": {
                "N": "123123"
            },
            "H2N": {
                "N": "123123"
            },
            "TimeToLive": {
                "N": "1730048842"
            }
        },
        {
            "Key": {
                "S": "ShTdGCP"
            },
            "Pos": {
                "S": "JFY6D"
            },
            "H1D": {
                "N": "123123"
            },
            "H1N": {
                "N": "123123"
            },
            "H2D": {
                "N": "123123"
            },
            "H2N": {
                "N": "123123"
            },
            "TimeToLive": {
                "N": "1730048842"
            }
        }
    ],
    "ScannedCount": 2
}
```

The example minified is ~700 chars, each item is ~200 chars. With 200 chars per item, each being a cell, that's 5000 cells in a MB.
**Total Size**: 700 Bytes
**Item Size**: 200 Bytes
**Items per MB**: 5000
