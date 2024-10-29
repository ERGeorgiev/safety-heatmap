# Database Item - Cell

A database item of type cell.

Helpful ink for DynamoDB item size calculation: https://zaccharles.github.io/dynamodb-calculator/

**Team Agreement**: Cells to expire within a year, we don't need data older than that.

## Fields

| Field      | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| PK         | The partition key.                                           |
| SK         | The sort key.                                                |
| H1D        | First half of the year, amount of days that had reports.     |
| H1N        | First half of the year, amount of nights that had reports.   |
| H2D        | Second half of the year, amount of days that had reports.    |
| H2N        | Second half of the year, amount of nights that had reports.  |
| LastReport | The datetime of the last report, timestamp UTC in seconds. (Newly added, so not included anywhere else) |
| TimeToLive | When the item expires and will be deleted. *(Automatic DynamoDb setting)* |

### Updates

Once a day, when a report is made, and it's the first half of the year during the day, the H1D counter is incremented. This can be an atomic action using UpdateItem in DynamoDb. When the second part of the year comes, H2D is incremented instead. LastReport is also updated along with that, as well as TimeToLive (to LastReport + 1 year). When a new year starts, H1D must be incremented, but for the first incrementation, LastReport would be in the past year, as the last increment would have been in the last year. That's when the UpdateItem will instead set the item to 0. That way, the counter is reset if first write of the year, and then incremented by 1. The same repeats for H2D. H1 and H2 with suffix N are the same, except they are used during the Night.

The reason LastReport is just a single date and not a list of multiple last report dates, is to avoid any offset caused by populated regions in comparison to unpopulated ones. With a single item, populated regions will still have a BIAS, but only one-dimensional, while otherwise it stacks. The BIAS can be reduced by assigning a proper weight to the intensity based on the LastReport and based on how outdated it is. For example, given a dangerous situation that lasts 30 minutes, in a big city it may receive 100 reports in those 30 minutes, while in a small town it may only receive 2 reports, but for both of these cases, the LastReport will be within 30 minutes, so the intensity can be similar (unless it was delayed reporting, in which case the situation might not be active anymore, so keep that in mind). A single value also makes the system highly interactive.

LastReport can also be used to indicate if there are any recent markers in the cell to fetch.

LastReport is ONLY updated for the smallest cell type and it's parent, as it wouldn't make sense for cells with too many children, as they would always be very recent.

LastReport is ONLY updated when the reporter is near the reported location.

TimeToLive is not updated alongside LastReportDate, to save on writes and bandwidth.

To ensure there's not a big jump when a counter is reset, use an algorithm to slowly overtime decrease the weight of the previous half-year when receiving the data.

**IMPORTANT!** H1D, H1N, H2D and H2N counters on the smallest cells can only be incremented **once a day** or **once a night**. This does not apply to parent cells, parent cells are incremented every time one of their child cells is incremented. This prevents heavily populated cells from having an unreasonable effect on intensity, but still allows them to represent the increase in danger that may come with more population, as llustrated below, where the red dots are reports and the green dots are people.

![region_population_in_parent_regions](img\region_population_in_parent_regions.png)

## Examples

### Example Item

```
{
    "PK": {
        "S": "ShTdGCP"
    },
    "SK": {
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

### Example Query Response

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
            "PK": {
                "S": "ShTdGCP"
            },
            "SK": {
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
            "PK": {
                "S": "ShTdGCP"
            },
            "SK": {
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
