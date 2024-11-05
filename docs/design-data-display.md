# Design - Data Display

## Historical Data

Historical data should be displayed using the heatmap.

## Live Data

Live data posted in the last hour should be displayed using an overlay animation on top of the heatmap to indicate recent activity. The more recent the report, the more intense the animation. Compared to displaying both historical and live data using the heatmap, separating live from historical data graphics will simplify heatmap generation, as well as present the data to the user in a simple and intuitive manner.

## Example

In the following example, historical data is displayed using the heatmap, while live data is shown using the ripple. 

![data-display-ripple](./img/data-display-ripple.gif)

It's a rough example, so this should look much better in production. For example with an outline around each ripple to better contrast it against the heatmap.

## Refresh Rate

The data should be updated **every minute** to fetch fresh reports both for live and historical data at the current zoom level.
