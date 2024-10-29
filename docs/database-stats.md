# Database Stats

## Size

**Estimated Max Database Size**: 6.4 GB
**Note**: This estimation is only on the smallest cells, based on GeoHash length of 8.
Approximately 6.66M crimes were recorded by the police in England and Wales in 2022/23 (https://www.statista.com/statistics/283069/crimes-in-england-and-wales/), say we multiply that number as a buffer to get 100M reports per year. At that rate, based on having 110,000,000,000 cells from [map-chunking.md](map-chunking.md), it will take **1100 years to fill in all cells**, and most would've expired by the time they're filled. The maximum amount of cells per year is 100M, as even if all of these reports created a new cell, in the year it took to do so, they old ones would've expired. As such, the estimated max cell count is 100M, and using the cell size of 64B from   [database-item-cell.md](database-item-cell.md), the total database size is 6.4 GB.

## Costs

**Calculator**: https://calculator.aws/#/createCalculator/DynamoDB
Calculating with **6.4GB storage** and **1200M annual writes**, that is **143$ per month**. 
Adding query reads to that (even 8192 items, each 64 bytes, fits in the 1MB query limit), if 1M people intensely browsed the app for 10 minutes every day for a year, that would be 6000M reads, which adds 850$ monthly, but that can be greatly reduced using in-memory server caches.
