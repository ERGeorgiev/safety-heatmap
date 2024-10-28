# Database Caching

Using the GeoHash partition and sort key, we can assume that shorter GeoHashes have less noticable changes overtime, due to the fact that they parent so much more child cells, so individual cell changes are unlikely to reflect on a shorter GeoHash. As such, we can cache based on GeoHash length.

This info is based on the decided practical GeoHash lengths for our uses of [3 to 8] from [map-chunking.md](map-chunking.md).

| GeoHash Length | Estimated Max Cell Count | Children Cell Count Per Cell | Cache Time |
| -------------- | ------------------------ | ---------------------------- | ---------- |
| 3              | 3250                     | 33,554,432                   | 1 day      |
| 4              | 100,000                  | 1,048,576                    | 12 hours   |
| 5              | 3,000,000                | 32,768                       | 3 hours    |
| 6              | 100,000,000              | 1024                         | 30 minutes |
| 7              | 3,500,000,000            | 32                           | 5 minutes  |
| 8              | 110,000,000,000          | 0                            | 1 minute   |

As fetching is done in chunks ([database-discussion-partitionKey.md](database-discussion-partitionKey.md)), caching should also be done in chunks, as otherwise a query of items between 000 and zzz wouldn't make use of caches on 001 aaa bbb etc, unless the whole partition was cached as 000 to zzz.
A further improvement would be partially using the cache, where, if the cached partition is [000 to 0zz] and the query is 000 to zzz, then the query can instead do 100 to zzz and use the cache for the rest of the data.

