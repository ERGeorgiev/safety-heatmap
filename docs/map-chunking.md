# Map Chunking

To avoid fetching unrealistic amounts of reports and malicious targeting, to maintain speed and low cost, we agreed on using representative cells (cells) of size **0.001km^2** *(31.6228m x 31.6228m)* to display our data. The agreed size is still granular enough to allow people to report places like shady alleys. In the blow image you can see different cell sizes compared to each other with 4 cells displayed per image. On the left side, each square has a 30m height and width, while on the right side it's 50m.

![maps_region_sizes](C:/Users/ergeo/Projects/safety-heatmap/_main/docs/img/maps_region_sizes.png)

We can use different cell sizes based on zoom level ([zoom-level-cells.md](zoom-level-cells.md)), with the closest zoom being the decided optimal cell size.

Using Lat/Lon for the partition key sounds great, but there's big differences between the cell sizes, since the closer to the equator you get, the bigger the cells, and the other way around. Another issue is that it's difficult to fetch regions in an area, when thikining in terms of database items. If the partition was the latitude and the sort key was the longitude, then it's impractical to fetch based on latitude, because we'll likely have to fetch several latitude keys, which is inefficient compared to a Range Query within the same partition.

It would be great to use a tech that gives cells with more uniform size, that is great for partitioning and fetching in terms of areas. Is there one? How do you split the earth in squares when its a sphere? We may want to consider GeoHash, it seems to be quite popular. Geohash also automatically parents cells with their child cells by design, so the partition key will be easier to figure out, despite losing on the number-comparison speed (as Geohash is a string, compared to Lat/Lon).

# GeoHash

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

## GeoHash Algorithm

All GeoHash cells are split as follows:

![geohash-patterns-arrows](img\geohash-patterns\geohash-patterns-arrows.png)

The arrows indicate what's the next cell in alphabetical order, which is useful for Range Queries. The Range Query cells to consider are as follows:

| Size  | Cell Count | Illustration                                                 |
| ----- | ---------- | ------------------------------------------------------------ |
| Small | 4          | ![geohash-patterns-small](img\geohash-patterns\geohash-patterns-small.png) |
| Medim | 8          | ![geohash-patterns-medium](img\geohash-patterns\geohash-patterns-medium.png) |
| Large | 16         | ![geohash-patterns-large](img\geohash-patterns\geohash-patterns-large.png) |

A range query can be constructed as shown in the following illustration:

![user-view-and-queries-example](img\user-view-and-queries-example.png)

As you can see, this results in 4 range queries. Sadly, they cannot be combined into one, as it seems impossible to do so with GeoHash due to the Z-order curve, as illustrated below with the teal outlines:

![geohash-neighbour-patterns](img\geohash-neighbour-patterns.png)

Explanation: In the top left corner, on the left we have the whole cell 'p' and on the right we hvae the whole cell 'r'. As 'p' and 'r' are separated alphabetically by 'q', a range query cannot do 'p' to 'r', as that would include 'q' as well. As such, range-querying neighbouring cells is not possible in either representations of the Z-order curve.
