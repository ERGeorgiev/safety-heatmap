# Discussion on Database Requirements

# Requirements

- Inexpensive
- Easy to Setup
- Easy to Modify (to allow for new fields to support new features)
- AWS-based
- A fitting way to serve heatmap-focused data.

# Function

-  [features-main.md](features-main.md) 
-  [features-optional.md](features-optional.md) 
-  [features-proposed.md](features-proposed.md) 

# Data

## Technology

For our data, we won't need to do joins or any SQL operations, as such, we don't need SQL functionality.
We should have easy-to-enable automatic backups.
It should be extensible, to allow us to easily implement support for new features by adding new data fields.

SQL vs No-SQL? https://www.testgorilla.com/blog/sql-vs-nosql/
"Essentially, SQL is great for protecting data validity, whereas NoSQL is ideal for when you need fast availability of big data."
We need the latter, as such, we should go for No-SQL.
Also, No-SQL is cheaper: https://weld.app/blog/sql-or-nosql-databases-which-one-is-best-for-storing-data-in-your-organisation
"NoSQL databases often require less hardware and infrastructure than SQL databases"
he lack of schema in No-SQL is also very flexible for expansion.

**Our tech of choice**: No-SQL database, based also on the necessary and optional functions.

### Providers

A fitting database would be AWS DynamoDB, which is an inexpensive no-SQL solution.

**DynamoDB**

- A lengthy google search and personal experience shows that it's likely the cheapest out there, at least for startup projects, where you can pay per transaction.
- Prefers a simple primary key, seems like there's less support for a secondary key, as GetItem might not support it.
- BatchGetItem - Gets items in a batch, up to 100, up to 16mb of data (up to 1mb per entry). That means in a batch of 100, should aim for max 160kb per item, this is up to 160,000 chars (1b), 80,000 shorts (2b), 40,000 int/floats (4b), 20,000 longs (8b).
  Seems like it also prefer working off only a primary key.
- Some explanation between GetItem and Query: https://stackoverflow.com/questions/12241235/dynamodb-query-versus-getitem-for-single-item-retrieval-based-on-the-index
  Seems like you can use both and GetItem is faster, as Query actually searches 'all' range keys.
  But Query allows for Ranges, which can make it better than GetItem when it's the same partition key.
- Primary Key MUST be unique.
- If secondary key is used for user id, we can naturally prevent the same user reporting the same location.

![dynamodb-operations-help](img\dynamodb-operations-help.png)

## Format

### Saving Individual Reports

Every single report is saved as an individual entry.

A consideration is using latlon as a partition/secondary key, there might be duplicates for the same pos.

### Representative Data

Single-reports are added to and represented by 'regions', which are then used to inform the heatmap.

Technologies to make this happen include:

- Plus Codes (open source): https://plus.codes/9C3WMP98+9H, https://www.youtube.com/watch?v=xP4hOcYKCTo, which may even allow for a single primary key.
- What3Words (may not by open source)
- GeoHash

It's good to think about how precise the representative data would be. For example, 100m looks like the MAX we should go for, as anything more cannot be used to target dark alleys.

**A consideration** in here is that, if something happens on a position that is between two representative regions, then 50% of the reporters may click in region A, 50% in region B, thus decreasing the intensity in each region. This may possibly be helped by an algorithm that increases or combines the intensity of a region with the original intensity of it's nearby regions. Or, maybe, when a report is submitted, all nearby surrounding regions are incremented by a value rationed by the region distance from the report.

**Another proposition**: The regions can be made big to fit well in DynamoDB, then they can have an average report position. With each report, the average report position is moved in the direction of the report in the region. Intensity is increased as usual. So each region can represent a single danger point, with an intensity specified by the users.

### Format Comparison

|                               | Saving Individual Reports | Representative Data |
| ----------------------------- | ------------------------- | ------------------- |
| **Individual Report Entries** | Yes                       | No                  |
| **Prevents Targeting***       | No                        | Yes                 |
| **Speed**                     | Slow                      | Medium-Fast         |
| **Size**                      | High, Unlimited Potential | Low, Constant Max   |

***Targeting** - When a user submits a report on a specific business or a neighbour's house. Simply having that sort of data may be an issue, as a data breach (or wrongful exposure due to error) can cause detrimental effects to individuals. For example, if users were able to see thousands of reports on someone's house either due to spam or due to an error, that person may be subject to harassment.
Consider enabling the ability to block certain points for things like big houses that can be targeted in many cases.
To prevent targeting, use a wide enough representative region, but small enough to have some precision. To avoid targeting put the marker at the point of the nearest road. Leaflet can do that: https://www.liedman.net/leaflet-routing-machine/

### Hybrid Format

Both formats can be used. There are some considerations to this such as:

- Will the same database be used? (no-SQL would allow it, but may cause adverse effect)
- Will there be a need for 2 databases? This will increase cost and complexity.

Another idea is to include a function that slowly migrates Individual Data to Representative Data over-time, allowing for high fidelity in recent entries.

### Discussion

Speed can always be improved with caching, while Size can be improved by putting a lifetime on entries. With a short-enough lifetime, individual reports may consume a small portion of the database to make it viable.

# Fields

## Necessary Fields

- Report position
- Safety Score?

###### Report Position

Describes the position of the report on the world map. This can be informed from the Format section.

## Optional Fields

- Reporter's IP
- Report Country
- Reporter's Country (or Distance (from Report), for more anonymised data)
- Report Description

