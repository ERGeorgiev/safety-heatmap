Using Lat/Lon for the primary key sounds great, but then you realize that there's no uniformity between the regions with that, since the closer to the equator you get, the bigger the regions, and the other way around. It would be great to use a tech that gives regions with uniform size. Is there one? How do you split the earth in squares when its a sphere? While Lat/Long can be great, for simplicity's sake, we may want to consider GeoHash, as I am not sure how to properly map out Lat/Long to have somewhat uniform regions and also combine it into a number. Geohash also automatically parents regions with their child regions, so the partition key will be easier to figure out, despite losing on the number-comparison speed (as Geohash is a string).

GeoHash explorer: https://geohash.softeng.co/gcpjfy6d
A good video on GeoHash: https://www.youtube.com/watch?v=VXWcNGxKMq4
GeoHash compared to S2/H3: https://benfeifke.com/posts/geospatial-indexing-explained/
GeoHash is tech of choice due to its wide availability. As this is a small project, we should use as much available resources as we can, and this will ensure the highest chances of resource availability, despite the fact that it seems that S2 may be superior.

With GeoHash, we can make good use of range queries, which are speedy and cost-efficient. We can also partition well.

| Geohash Length | Cell Width | Cell Height |
| -------------- | ---------- | ----------- |
| 1              | ≤ 5,000km  | 5,000km     |
| 2              | ≤ 1,250km  | 625km       |
| 3              | ≤ 156km    | 156km       |
| 4              | ≤ 39.1km   | 19.5km      |
| 5              | ≤ 4.89km   | 4.89km      |
| 6              | ≤ 1.22km   | 0.61km      |
| 7              | ≤ 153m     | 153m        |
| 8              | ≤ 38.2m    | 19.1m       |
| 9              | ≤ 4.77m    | 4.77m       |
| 10             | ≤ 1.19m    | 0.596m      |
| 11             | ≤ 149mm    | 149mm       |
| 12             | ≤ 37.2mm   | 18.6mm      |

GeoHash length of [3-8] matches our needs, as 9 is too precise and 2 is too imprecise.
gcp for the biggest region above Abingdon
gcpjfy6d for Abingdon's center.

| Geohash Length | Total Cells       | Size   |
| -------------- | ----------------- | ------ |
| 1              | 32                | 2 KB   |
| 2              | 1024              | 65 KB  |
| 3              | 32,768            | 2 MB   |
| 4              | 1,048,576         | 67 MB  |
| 5              | 33,554,432        | 2 GB   |
| 6              | 1,073,741,824     | 68 GB  |
| 7              | 34,359,738,368    | 2.2 TB |
| 8              | 1,099,511,600,000 | 70 TB  |

While the total size might be 70 TB, what's the realistic figure given only human-populated land? 
What's the size expected given an average report rate and an average popularity, with a 1 year of expiry on the cells?

| Geohash Length | Total Cells on Populated Land (10%) | Size   |
| -------------- | ----------------------------------- | ------ |
| 1              | 3                                   | 200 B  |
| 2              | 100                                 | 2.2 KB |
| 3              | 3250                                | 208 KB |
| 4              | 100,000                             | 6.4 MB |
| 5              | 3,000,000                           | 192 MB |
| 6              | 100,000,000                         | 6.4 GB |
| 7              | 3,500,000,000                       | 224 GB |
| 8              | 110,000,000,000                     | 7 TB   |

The theoritical max database size is **6.4 GB** as estimated in [database-stats.md](database-stats.md).
