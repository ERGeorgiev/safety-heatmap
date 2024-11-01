# Contract Format

## Gzip

As we are sending many heatmap points to the client, we need a way to do so efficiently. Gzip is a wide-spread format that is supported in many tools, as such, it's a great choice. Using https://dafrok.github.io/gzip-size-online/, we can estimate the effect of Gzip. It seems like it can make requests about 5 times smaller, proven by playing around with the following example:

```json
{
    "Size": "S",
    "Points": [
        {
            "Lat": 52.40420,
            "Lon": -2.70137,
            "Intensity": 0.1
        },
        {
            "Lat": 52.404200,
            "Lon": -2.701379,
            "Intensity": 1
        },
        {
            "Lat": 52.40520,
            "Lon": -2.70637,
            "Intensity": 0.3
        }
    ]
}
```

## Coordinates Lat/Lon vs Geohash

Should we use lat/lon to represent coordinates or geohashes? As JSON is a text-based format, we cannot take advantage of the usually smaller footprint of decimal types, as every digit is represented by a character. Geohashes can help us save on data, as they can encode multiple long lat/lon into a short string like 'gptjrltp'. Using https://dafrok.github.io/gzip-size-online/ to estimate GZIP size, and the below geohash coordinates example, we can tell that a single item of non-geohash is 14 bytes, while with geohash it's 8 bytes. That's saving 6 bytes per item.
```json
{
    "Size": "S",
	"Intensity10": [ "ghprphrh" ],
	"Intensity100": [ "gcpjfy6d" ],
	"Intensity20": [ "gcpdfy92" ],
	"Intensity30": [ "gcpjfw7g" ],
}
```

That means without using geohash, a single request can contain up to **71,428** coordinates in **1 MB**, while the geohash example can contain up to **125,000** coordinates. 

Using geohash though, will raise complexity for the client, as so far Geohashes have not been part of any other requests, and on top of that it will require processing every single entity to turn back to lat/lon to display on the map, which may result in slowdowns client-side. 

While the difference in size is big, both of these methods are acceptable, as we likely won't ever be returning over 10,000 items, and if we use lon/lat, we'll save the client extra processing time. Server-side, the processed geo-hashes can be cached.

As such, the chosen method is to keep lat/lon representation, for simplicity and better client-performance.

