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

## Report Limit

Limit the user to only a single report per hour, to avoid users spamming reports.

## Report Indication

When zoomed in to the smallest cells, indicate which cells have recent reports.
