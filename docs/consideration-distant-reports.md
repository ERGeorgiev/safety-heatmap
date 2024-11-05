# Consideration: Distant Reports

Distant reports is about reports made from a great distance. Compared to the use case of "see-and-report" with reports in the vicinity, distant reports have many use cases, including:

- Reporting a historical experience
- Reporting a danger you've found out about indirectly, like seeing it in the news
- Using a VPN
- Spam/malicious reporting

We don't have the methods to filter this information correctly given the current database schema [database-item-cell.md](database-item-cell.md). As such, we should initially focus mainly on recording only reports that are in the close vicinity to the reporter. We can look at introducing distant reports at a later date. This will also allow us to work with an easy to understand database so we can set the foundation of the project properly.

## Distance

In our discussions, we've mainly talked about using geolocated IP as a rough estimate of the reporter's location. The precision distance is around 50 miles radius (https://www.ip2location.com/data-accuracy), and usually within city limits. Using that information and adding a buffer for imprecise edge-cases, we can restrict reporting to the IP geolocated position of the reporter + 100miles radius. Later, this can be improved by locating the exact city and using that as the point of origin.

## User Location Focus

When this limitation is implemented, the app should also focus on the user's rough location as soon as it is opened, or at the very least provide a highlighted "location" button, as otherwise the user may be disoriented and confused. This of course can also be done through the location button using leaflet - https://tomickigrzegorz.github.io/leaflet-examples/#49.location-button, which may also allow for more precise limitations.
