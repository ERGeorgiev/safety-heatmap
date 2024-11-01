# Zoom Level Cells

| Level | Proposed GeoHash Length | Illustration                                                 |
| ----- | ----------------------- | ------------------------------------------------------------ |
| **1** | **8** (M)               | ![zoom1](img\zoom-level-regions\zoom1.png) |
| **2** | **8** (S)               | ![zoom2](img\zoom-level-regions\zoom2.png) |
| **3** | **7** (S)               | ![zoom3](img\zoom-level-regions\zoom3.png) |
| **4** | **6**                   | ![zoom4](img\zoom-level-regions\zoom4.png) |
| **5** | **5**                   | ![zoom5](img\zoom-level-regions\zoom5.png) |
| **6** | **4**                   | ![zoom6](img\zoom-level-regions\zoom6.png) |
| **7** | **3**                   | ![zoom7](img\zoom-level-regions\zoom7.png) |
| **8** | **2**                   | ![zoom8](img\zoom-level-regions\zoom8.png) |

# Details

Using the guide size of database item = 64B and query respose item = 200B from [database-item-cell.md](database-item-cell.md).
Note that the query response is received only by the server, not by the user, as the server will send over processed heatmap points instead, which is a lot less data.

| Cell  | Count | Estimated Database Size | Estimated Query Size |
| ----- | ----- | ----------------------- | -------------------- |
| **S** | 8192  | 0.52 MB                 | 1.64 MB              |
| **M** | 512   | 33 KB                   | 0.1 MB               |
| **L** | 32    | 2 KB                    | 7 KB                 |

The exact size necessary for each Zoom level should become apparent after the completion of the https://github.com/ERGeorgiev/safety-heatmap/issues/19 issue, as we'll be able to observe how data resolution affects heatmap density in different zoom levels.
