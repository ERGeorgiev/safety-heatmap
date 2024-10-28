# Discussion on Features

Here we'll list and discuss the features that the safety heatmap will have.

# Main Features

## Reports

The ability to report unsafe places, saving them into a database.
Example Report Data: { Position }

**Consideration**: Malicious Targeting
If reports are precise enough, a group of users will be able to target individuals and possibly cause them to be harassed because of the multiple reports, for example, on their house. A way to solve this would be to use representative regions, so individual houses cannot be targeted, and for houses that are big enough to fill a whole region, we can provide a way for individuals to remove reports made on their property. 

## **Heatmap**

Display a heatmap based on reports.
Example Data: HeatmapData[] { Position, Intensity *(or count)*, Area (or count) }

Lets explore trying to display a heatmap based on the report in London. If 10% of the people in London submitted a report, that would mean about a million reports. Fetching that many entries is unrealistic, if anything, popular database fuctions like DynamoDB's BulkGetItem supports only up to 100 entries and up to 16mb. It would also be a big slowdown over the amounts of data that will have to be transferred, as fetching a million integers is 4mb, three integers would be 12mb and so on, growing times more when zooming out to a whole country or the whole world. As such, and also to avoid Malicious Targeting, it's best to consider using representative regions.

### Representative Regions

**Region Size**: 1km^2 *(31.6228m x 31.6228m)*

Representative Regions or just Regions is a way to display data that is less precise than the individual report, enabling us to avoid Malicious Targeting as well as save on data storage cost, save on data throughput, and increase data transfer speed.

After a discussion, we agreed that the optimal region size is about 30m x 30m (900m^2). It seems to us that this is the smallest region that resonably protects from Malicious Targeting, but is still granular enough to allow people to report places like shady alleys. To round it off in terms of square kilometers, the value used can be SQRT(1000m)xSQRT(1000m) = 31.6228m x 31.6228m, which is 1km^2.

In the blow image you can see different region sizes compared to each other with 4 regions displayed per image. On the left side, each square has a 30m height and width, while on the right side it's 50m.

![maps_region_sizes](..\img\maps_region_sizes.png)

- Representing UK with 1km^2 regions would mean 250,000 regions - unsuitable, needs less granularity.
- Representing Oxford with 1km^2 regions would mean 100 regions - suitable, just the right amount for DynamoDB's BulkGetItem.

Using different resolution based on zoom level, close zoom should fetch and display more granular regions, with the closest zoom being the decided optimal region size. Using DynamoDB's BulkGetItem limits as an example, we should aim for a max of 100 regions displayed per zoom level.

## Report Aging

Old reports should likely expire or lessen in intensity as time goes on, to prevent misrepresenting areas that may have been dangerous in the past but no longer are. 

**Consideration**: Individual Reports can age, what about Representative Regions?
If we don't have individual reports but rather represent them with regions, how will we determine that a report is old, expired, lessen it's intensity, etc? This will likely involve processing each region in a way that will ensure it maintains intensity based on its recency. As a rough example, all regions could go down in intensity by 10% per day, so new reports will have a big boost on intensity.

### Implementation

**Active Aging:** Is **updating every region overnight** a suitable solution? With our smallest region being ~1km^2 **(NOTE: THIS IS WRONG, IT IS 0.001km^2)**, the earth's land surface area being 57,000,000km^2, a single region entry containing a minimum of 3 integers, that means (57,000,000 * 3) = 171,000,000 integers. Given the size of an integer is 4 bytes, the maximum size of the processed data to update the whole world is (171,000,000 integers * 4 bytes) = 684,000,000 bytes, which is 700MB. It is certainly not an outlandish number, and this is the worst case scenario, as we're unlikely to have a report in every single region to update (thus no region entry in the database). It's good to consider that the size of the data is likely much bigger due to the fact that databases like DynamoDB use a JSON structure to represent the response, so there is a lot of extra bulk. If we avoid downloading all of these entries and stick to only updating a given field, we would only have to send a request containing 3 values - the key, the value to update by and the update operation to use (addition, multiplication, etc). Given the JSON structure, it's entirely possible that in the worst case scenario this grows beyond the forecasted 700MB. Using DynamoDB as an example, one can find update request examples here: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_Examples. The posted request example is ~800bytes of characters. With the maximum amount of regions of 57,000,000 and an update request per each, that means the maximum data uploaded to update every item would be (57,000,000 requests * 800 bytes) = ~46GB. That is a big amount of data to update every night, making it impractical in the long run, but possibly do-able in the beginning. Although, we're keen on using DynamoDB, and from what I understand, it's not built for mass operations like this.
Granted, this is the absolute worse case scenario, where every single region has been filled in a single year and there's an active user in every single part of the globe, ever 30m. Using UK's land surface area of 250,000km^2 instead, we arrive to 250,000 requests and about 200MB of data that has to be updated overnight (counting only the highest res regions). Using Amazon's calculator, 250K writes in DynamoDB results in 22.58$ monthly cost, which is inexpensive.

**Submission Aging:** about **aging a region as soon as a report in it is submitted**? That is unsuitable, as until a report is submitted in that region, an old report will remain at it's initial intensity.

**Arrival Aging:** How about **aging a region a soon as it's received from the database**? This will prevent us from having to age regions in the database entirely, saving us some extra write operations. Received regions can be ages as soon as they are received, but how? This can be done based on average report date, but how can an average report date be kept, and how can it be adjusted not to diminish the effect of new reports, e.g. a new report with a recent date will have trouble bumping a weighted past date, thus having little impact on intensity. Moving average?
Also, to be efficient efficiency, we can run only update commands when updating db entries. That means updating an item without knowing it's current values. How does that bode for this?

**Intensity Eclipse:** Maybe **a way to** **age data points is simply by allowing other entries to eclipse them**. We have positions and intensity on each position. The intensity can be adjusted based on the intensity of the rest of the points, as a ratio of the whole. That way, spikes in the data will slowly fade as other entries gain more reports and thus increase the total intensity.

**Latest Report:** If we were to **abandon the idea of ever-increasing intensity** with each report (1pt per report for example), then we can think about it in a different way, where **every report simply sets the intensity to 1 of that region and updates the date of the last report**. Then when received, intensity is calculated based on the amount of time passed since the last report. Say it takes up to a year for a report to fully change intensity from 1 to 0. That way, we also deal with the issue of overflowing integers, and we no longer have to scan the base every night to age every region and report. 
Granted, with enough active users and a world-view, all regions will pretty much be at full intensity. To reduce the effect of that, it could be multiplied by an average recency of all reports, so if the app is getting very recent reports all the time, the reports age much faster, thus intensity will be more dynamic.
Also it can be used in combination with an ever-inrceasing report value as initially proposed.
Also, keeping the datetime of the latest 5-10 reports instead might help out with this, as it would give an average and make it harder to sway by a single person.

**Age Groups:** asked Ally, she thought that **using a group might be a good idea. Maybe the regions age every month**, with a TimeToLive of 1 year, and new regions are created every month that get the report updates instead. That way, old regions have their set month and thus when received, the app knows to give them a multipler depending on their month of creation. The month can be part of the clustering key, under the same partiition key (position). The app will know to which clustering key (or primary key suffix) to push the intensity to by knowing which month it is now.

## Report Weight

The ability to show accurate report data irregardless of population density. For example, if a dengerous place has a 10% report ratio, but is in a small village, only 10 out of 100 people passing through there would report it. But in a big city, that 10% means 100,000 out of 1,000,000 people would report it. The danger is still worth only 10% of people's time to  report, yet in the big city it will have 10,000 times more reports and thus more intensity. 
This issue can be resolved if we rely on latest report age to create the heatmap, instead of amount of reports. 
Another way to tackle it would be to offset reports by population density. So the 100,000 repots will be divided by 1,000,000 people living there. This though, creates a literal hotspot for tourists, so even if we had population density data, we'd find it much harder to predict changing tourist population.

# Optional Features

Features that are nice to have.

## Day and Night Heatmap

Displaying a different heatmap depending on the day and night cycle, as certain places may feel more unsafe during the night.
Example Field Additions to HeatmapData: { Timestamp }

**Data Requirement:** This would require storing the datetime of the report in order to filter reports.

## Report Hint

Report or Region hints to describe why it was reported as unsafe.
Example Field Additions to HeatmapData: { HintScaryParkCount, HintDarkAlleyCount, HintOtherCount }

For example:

- Preset hints that the user can choose like "Scary Park", "Dark Alley" or "Other"
- Preset images that communciate what the report is about like the image of a park
- Preset words that the user can assemble and form a sentence like "Scary", "Dark", "Park", "Alley".

When it comes to a region, the database entry can hold an integer for each hint type, which will represent how many times it was chosen. Then, the Top 3 Hints can be displayed to the user.

# Proposed Features

Proposed features to discuss further in the future.

## Account Reports

Users have accounts. When a report is submitted, it is saved to the user's account for later viewing or editing.

## Public User Reports

The map displays user-submitted reports in the area as well as the heatmap, so any user can see other details on the report and be better informed.

## Report Descriptions

Descriptions can be added to reports.

**Consideration**: Unfiltered Descriptions
Allowing users to add free-text description could spell trouble. Avoiding that would mean committing resources to scanning and filtering such input.

## Safety Notification

Given a user account and the knowledge of their location, when there is a spike of reports is submitted in their region, the user can be made aware with a notification or an email.

## Gender-Adjusted Heatmap

The heatmap can be adjusted to display reports based on gender.

## Report Pictures

As part of a report's description, a user can submit pictures to show what was unsafe.

