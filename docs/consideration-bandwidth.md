# Consideration: Bandwidth

In 2021, the average phone network connection was 20MBps https://www.statista.com/statistics/371894/average-speed-global-mobile-connection/, though from personal experience, it's painfully obvious it's much less in rural areas, likely under 1MBps. The user will be receiving heatmap data, in which a single entry will looks like `{ "Lat": latlatlatlat, "Lon": lonlonlonlon, "Intensity": 0.15 }` , which is 63 chars = 63 bytes. That means 15,000 heatmap points fit in a single MB.
