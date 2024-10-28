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
