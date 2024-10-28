# Zoom Level Cells

| Level | Illustration                                                 |
| ----- | ------------------------------------------------------------ |
| **1** | ![zoom1](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom1.png) |
| **2** | ![zoom2](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom2.png) |
| **3** | ![zoom3](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom3.png) |
| **4** | ![zoom4](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom4.png) |
| **5** | ![zoom5](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom5.png) |
| **6** | ![zoom6](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom6.png) |
| **7** | ![zoom7](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom7.png) |
| **8** | ![zoom8](C:\Users\ergeo\Projects\safety-heatmap\_main\docs\img\zoom-level-regions\zoom8.png) |

# Details

Using the guide size of database item = 64B and query respose item = 200B from [database-item-cell.md](database-item-cell.md).
Note that the query response is received only by the server, not by the user, as the server will send over processed heatmap points instead, which is a lot less data.

| Cell  | Count | Estimated Database Size | Estimated Query Size |
| ----- | ----- | ----------------------- | -------------------- |
| **S** | 8192  | 0.52 MB                 | 1.64 MB              |
| **M** | 512   | 33 KB                   | 0.1 MB               |
| **L** | 32    | 2 KB                    | 7 KB                 |

