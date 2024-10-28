Item partitioning can be done based on regions within regions. For example, all regions belong to the top-level regions which is used as the partition key, then they become more granular based on the sort key. That way, when a user is zoomed in on a region, I can just fetch all items within that partition with a sort key range.

I can use Geohash to my advantage, or a similar system, maybe one based on Lat/Lon combo.

Or maybe I can explore all regions to be children of their parent regions until the top-most, and are partitioned based on the key and sort key. So regions of size 1 (smallest) have a partition key indicating a region of size 2, then regions of size 2 have a partition key indicating a region of size 3, etc. Or maybe the partition region is entirely unrelated to other regions and made up, acquired entirely through the zoom pos.

Below is displayed the full map of the Earth, with region sizes overlaid.

![region_max_zoom_size](..\img\region_max_zoom_size.png)

Different region sizes shown in colour. This is how much MB it would take to fill all land surface with them:

- Red: 5000 regions = 2MB
- Green: 1250 regions = 0.5MB
- Blue: 300 regions = 0.1MB

In 2021, the average phone network connection was 20MBps https://www.statista.com/statistics/371894/average-speed-global-mobile-connection/, though from personal experience, it's painfully obvious it's much less in rural areas, likely under 1MBps. Since these regions will have to be sent over to the user to display on their phone, it will be entirely dependent on their network connection. The Green region size may be a good compromise, as even the slowest network connections will be able to download them at a reasonable speed to practically browse the map.

Thought: While Im trying to reduce the effects of populated area report numbers, there's also some value I'll be losing, such as the fact that populated areas also will tend to have more crime due to there being lots of people. Maybe that will be made up for by simply having more reported points in an area due to the larger populace, thus making a bigger hotspot overall.

Thought: Given the report recency instead of count system, implementing 3rd party data may be difficult, as it tends to be old and intensity in those accurately relies on amount of reports. Maybe it shouldn't be aged, as it's not being actively updated? Or maybe bit uses a separate config file on the server that actually DOES use a count of reports, which the server then merges with the live reports.

Thought: Smallest regions can have 3 timestamps of the latest reports for intensity generation, then their parent region, say it has 9 child regions, it keeps a list with the latest datetime for each child (instead of the 3 latest ones like the smallest regions). That will make it accurate.

c1 = [t1, t2, t3], c2= [t1, t2, t3], c3 = [t1, t2, t3], c4 = [t1, t2, t3]

parent = [c1.t3, c2.t3, 0, 0] = 0.5

Thought: If using only 3 timestamps and their recency to determine intensity, then it will take only 3 people to manipulate the system. On the other hand though, if only a single timestamp has a big effect, but say if its only a single one has less weight in time, that will make the system very interactive and will show live spikes reported even by a single person, live spikes that die down quickly or stay for longer (if more people report it).

Thought: If we were to use markers and we wanted to fetch them live, then, given a timespan of a day, that's likely entirely do-able.

Thought: To be careful how I save datetime, as I probably don't need resolution less than seconds, and might not need the year. UTC timestamp seconds 1729931182 is so much smaller compared to 2015-02-25T20:27:36.165Z, so may want to use that instead.



When it comes to the way we log and display reports, coming at it from a usability perspective, it would be interesting to keep an interactive level at the smallest regions, where a single report causes a spike for the moment, then quickly dies down if there are no other reports to back it up. If more reports come in, then the spike stays active. I had a number of 3 in my head about the number of timestamps to save, but now I feel like 10 is better, or at least something higher, as it would give us a better idea of historical reports and their recency. Maybe 5 is a good compromise. 

Discussion: Max Zoom level practically should be country-level, unless it's super easy to have it at world-view.

Thought: Partition key based on km^2



Field: Q1.DayCount++ Q2.DayCount++ Q3.DayCount++ Q4.DayCount++ QLastUpdate LastReports[t1, t2, t3]
Parents' count is updated with the child's, but maybe with a value of 1/NoOfChildren.



Discussion: DayCount also solves the issue of having to update the bigger regions a million times per day. But what about LastReports? Maybe they shouldn't have that.





Currently, the map offers around 8 zoom levels that are of practical use to us.

If on smallest regions, as soon as mouse hovers over it, fetch all markers in the background.

Thought: To make partition key in a way that region sizes are easily adjustable and independent of each other.

Thought: I was making calculations on MBs in relation to user's internet connection, but the user will receive less data as we'll be sending to them processed heatmap points, which have lat, lon and intensity. This means that a single point will look like `{ "Lat": latlatlatlat, "Lon": lonlonlonlon, "Intensity": 0.15 }` , which is 63 chars = 63 bytes. That means 15,000 heatmap points in a single MB.



Thought: Regions's LastUpdateTime to be replaced with their TimeToLive, always set to 1y lifespan on any Q update.



Observing the zoom levels from 1 to 8, 1 being the minimum, it seems like the M 30m x 30m is enough for 1, but S is the way to go with any other zoom level as otherwise the size of the region is too big to be practical. That means that for most zoom levels except the first, based on our findings so far, the server will have to fetch around 8000 regions (4MB) and send back to the user 8000 heatmap points (1MB). Too much or just right? With a cache, the database impact will be lowered. At Zoom level 1 is when the hover-to-prefetch-markers feature kicks in, markers do not show on any other level than zoom level 1.



Thought: Using Lat/Lon for the primary key sounds great, but then you realize that there's no uniformity between the regions with that, since the closer to the equator you get, the bigger the regions, and the other way around. It would be great to use a tech that gives regions with uniform size. Is there one? How do you split the earth in squares when its a sphere? While Lat/Long can be great, for simplicity's sake, we may want to consider GeoHash, as I am not sure how to properly map out Lat/Long to have somewhat uniform regions and also combine it into a number. Geohash also automatically parents regions with their child regions, so the partition key will be easier to figure out, despite losing on the number-comparison speed (as Geohash is a string).

GeoHash explorer: https://geohash.softeng.co/gcpjfy6d

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

While the total size might be 70 TB, what's the realistic figure given only human-populated land? What's the size expected given an average report rate and an average popularity, with a 1-2 years of expiry on the regions? 
Discussed agreement: 1 year max.
Also, expiry could be smarter. Regions with a single report in a week may be expired within a week, more extends to a month, 10 reports in a month can extend to a year. But maybe not... complicates design, makes it a bit weird to understand from a user perspective, etc.

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

**Amount of Cells and Database Size Estimate:** Approximately 6.66M crimes were recorded by the police in England and Wales in 2022/23 (https://www.statista.com/statistics/283069/crimes-in-england-and-wales/), say we multiply that number as a buffer to get 100M reports per year. At that rate, it will take 1100 years to fill in all regions, and most would've expired by the time they're filled. With the rough estimate of 100M reports per year, the maximum amount of cells per year is 100M, as even if all of these reports created a new cell, in the year it took to do so, they old ones would've expired. As such, that puts the estimated maximum amount of cells at 100M, which is 6.4 GB.
**Database Costs Estimate:** Calculating with 6.4GB storage and 120M annual writes, that is 16$ per month. Adding reads to that, using queries (even 8192 items, each 64 bytes, fits in the 1MB query limit), if 1M people intensely browsed the app for 10 minutes every day for a year, that would be 6000M reads, which adds 850$ monthly, but that can be greatly reduced using in-memory server caches.

Fetching many regions is a big task, especially because DynamoDB was designed around single-item storage. The question is how to do it effectively.

Note: https://stackoverflow.com/questions/32917452/cheapest-way-of-getting-multiple-items-from-dynamodb = BatchGetItems is equal to running a GetItem call per item in price. Using a Query, dynamoDB charges for total data size instead of per item, which is likely ideal for our use case. For that, one has to sort items correctly under partition key "containers" and fetch them using a sort key range: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html . Query can search BETWEEN sort key values, bigger than, starts with, etc. This is a bit counter-intuitive, as that would mean we would need to lower the cardinality on our partition key, which goes against the AWS advice to go for highest cardinality - https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/, but then again that doc also advocates having a good spread between partitions, so I suppose there needs to be a balance.

The partition and sort key must allow for a Query that selects cells local to the position of the user's screen. Looking at https://geohash.softeng.co/gcpjfy6d, we can see that if a person's screen is on GCPJFY6D, then we have to fetch cells not only from the parent GCPJFY6, but also from the parent's parent at GCPJFY. If the user is between 4 regions, we may have to fetch them all, in this case gcpjfw, gcpjfy, gcpjft and gcpjfv. Each one of these 4 cells contains 32 cells that contain 32 cells = 4 * 32 * 32 = 4096 cells we would need to fetch. So we'll have to get:
gcpjfw00 to gcpjfwzz
gcpjfy00 to gcpjfyzz
gcpjft00 to gcpjftzz
gcpjfv00 to gcpjfvzz
**CAUTION!** If shorter sort keys are stored in the same partition as longer ones, will that have a bad effect? For example, if I try to get w00 to wzz, will w0 also be returned? I would probably ensure sort keys are the same length within a partition.

For the partition key we have:

- App (2 symbols)
- Purpose (2 symbols) (e.g. Night/Day data)
- GeoHash prefix

For the local sort key:

- GeoHash suffix

Example Partition Key + Sort Key

- ShGeGCP + JFY (length 6, max 32768 sort keys)
- ShGeGCPJ + FY6 (length 7, max 32768 sort keys)
- ShGeGCPJF + Y6D (length 8, max 32768 sort keys)

Seems like grids alternate between PRXZ (odd length) and BCFGUVYZ (even length) arrangement. Regardless of that, the arrangement is still the same, just flipped, so as long as one knows the letters to fetch, one can build a rang query following this diagram:

![geohash-grid](..\img\geohash-grid.png)



AWS Blog on Using GeoHash in DynamoDB: https://aws.amazon.com/blogs/compute/implementing-geohashing-at-scale-in-serverless-web-applications/
