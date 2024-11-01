# Main Features

The main features that the safety heatmap will have.

## Reports

The ability to report unsafe places, saving them into a database.
**Example Data**: { Position, DateTime }

**Consideration**: Malicious Targeting
If reports are precise enough, a group of users will be able to target individuals and possibly cause them to be harassed because of the multiple reports, for example, on their house. A way to solve this would be to use representative cells, so individual houses cannot be targeted, and for houses that are big enough to fill a whole cell, we can provide a way for individuals to remove reports made on their property.

## **Heatmap**

Display a heatmap based on reports.
**Example Data**: HeatmapData[] { Position, ReportCount }

The heatmap takes full advantage of [map-chunking.md](map-chunking.md).

## Live Data

To keep the map interactive, data on any cells in view is fetched once every 10s (or more, dependent on cache and GeoHash level) and zones with increased recent activity are highlighted.

## **Data Aging**

Old reports should likely expire or lessen in intensity as time goes on, to prevent misrepresenting areas that may have been dangerous in the past but no longer are. Aging is done by representing report counts in the database in fields that describe how old they are.
**More info**: [database-item-cell.md](database-item-cell.md) 

### Other Proposals

**Active Aging:** Is updating every cell overnight a suitable solution? We can have up to 100M cells as per [database-stats.md](database-stats.md), each with several fields, that may mean up to 300M integers to update. If the update request is ~300B (based on similar requests in [database-item-cell.md](database-item-cell.md)), that means 90GB of requests. There may be able to optimize this, but it's still a mamooth task and likely very expensive. We're keen on using DynamoDB, and from what I understand, it's not built for mass operations like this.
**On-Submission Aging:** Aging a cell as soon as a report in it is submitted. That is unsuitable, as until a report is submitted in that cell, an old report will remain at it's initial intensity.
**On-Receipt Aging:** Aging a cell a soon as it's received from the database. This can be done based on average report date, but how can an average report date be kept, and how can it be adjusted not to diminish the effect of new reports? Also, for efficiency, we can only run update commands when updating entries. That means updating an item without knowing it's current values.
**Intensity Eclipse:** Maybe a way to age data points is simply by allowing other entries to eclipse them, and each entry just keeps on increasing a counter of reports in that cell. We have positions and intensity on each position. The intensity can be adjusted based on the intensity of the rest of the points, as a ratio of the whole. That way, spikes in the data will slowly fade as other entries gain more reports and thus increase the total intensity. But, we have an issue of ever-growing numbers.
**Latest Report:** If we were to abandon the idea of ever-increasing intensity with each report (1pt per report for example), then we can think about it in a different way, where every report simply sets the intensity to 1 of that region and updates the date of the last report. Then when received, intensity is calculated based on the amount of time passed since the last report. Say it takes up to a year for a report to fully change intensity from 1 to 0. That way, we also deal with the issue of overflowing integers, and we no longer have to scan the base every night to age every region and report. 
Granted, with enough active users and a world-view, all regions will pretty much be at full intensity. To reduce the effect of that, it could be multiplied by an average recency of all reports, so if the app is getting very recent reports all the time, the reports age much faster, thus intensity will be more dynamic.
Also it can be used in combination with an ever-increasing report value as initially proposed.
Also, keeping the datetime of the latest 5-10 reports instead might help out with this, as it would give an average and make it harder to sway by a single person.
**Age Groups:** I asked Ally, she thought that using a group might be a good idea. Maybe the regions age every month, with a TimeToLive of 1 year, and new regions are created every month that get the report updates instead. That way, old regions have their set month and thus when received, the app knows to give them a multipler depending on their month of creation. The month can be part of the clustering key, under the same partiition key (position). The app will know to which clustering key (or primary key suffix) to push the intensity to by knowing which month it is now.

## Data Weight

The ability to show accurate report data irregardless of population density. For example, if a dangerous place has a 10% report ratio, but is in a small village, only 10 out of 100 people passing through there would report it. But in a big city, that 10% means 100,000 out of 1,000,000 people would report it. The danger is still worth only 10% of people's time to report, yet in the big city it will have 10,000 times more reports and thus more intensity. 
This issue can be resolved by relying on report age alongside amount of reports, and using it to determine intensity.
The data can be further processed to set intensity based on locality within the heatmap.

As you can see in the below example, London has 6 reports in total, while Newmarket only has 1, yet their intensities are 0.75 and 0.25 respectively. The London reports could have been about the same situation, and given our small cells, it's highly likely that's the case, which doesn't necesarily mean that that specific danger in London is more dangerous than the one in Newmarket, it was just reported more times as there were more people roaming.
Yet, due to the fact that the parent region can be incremented multiple times, London's bigger cell correctly represents the higher amount of unique incidents reported.

![region_population_in_parent_regions](img\region_population_in_parent_regions.png)

Another way to tackle it would be to offset reports by population density. So the 100,000 repots will be divided by 1,000,000 people living there. This though, creates a literal hotspot for tourists, so even if we had population density data, we'd find it much harder to predict changing tourist population.
