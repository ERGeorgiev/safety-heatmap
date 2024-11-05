# Consideration: Multiple Reports Per User

Without any limitations, a single user can spam multiple reports from his device, filling our database with bogus data. It can be difficult to have proper limits in place without a user account, but we rely on a user's IP address to help out with this issue. VPNs can complicate things, but that can further be dealt with using  [consideration-distant-reports.md](consideration-distant-reports.md), as VPNs tend to provide IPs from distant locations. Initially, we just need some reasonable approach in tackling this, later we can work on improving it.

## Limitation

In my personal experience, I run into weird dangerous situations quite rarely. Being very generous with the estimate, we can limit each user to a single report per 15 minutes.

We also need to keep in mind that users on the same router will share the same IP, so users in a network café will have the same identification. This can be made better by the fact that each area can only be reported once daily, which can reduce the feeling of being limited as far as the user is concerned, see the scenario "User Recently Reported The Same Cell" below.

## Scenarios

**Scenario: Normal Report**  
**When** a user tries to log a report  
**Then** the corresponding cell's Daily and LastReport fields should be updated.  

**Scenario: Cell Already Updated**  
**When** a user tries to log a report  
**And** the corresponding cell has already been updated today  
**Then** only the LastReport field of the cell should be updated  

**Scenario: User Already Reported A Different Cell **  
**When** a user tries to log a report  
**And** the user has already logged a report in the last 15 minutes  
**Then** the corresponding cell should not be updated  
**And** the report button should be disabled for 30 seconds  
**And** a yellow status bar at the bottom should display "You recently submitted a report, try again later" for 30 seconds  

**Scenario: User Recently Reported The Same Cell**  
**When** a user tries to log a report  
**And** the user has already logged a report in the last 15 minutes  
**And** the corresponding cell has had a report today   
**And** the report on the corresponding cell is from the user  
**Then** the corresponding cell should not be updated  
**And** a lime status bar at the bottom should display "Thank you, report already submitted." for 10 seconds  

## Storage

Most of these limitations may not need a database and can be stored in-memory on the server given the low lifespan of 15 minutes per user, given an IP. 

What about when the servers scale and the user may be switched to a different server? To prevent that from happening, we can use sticky server sessions that "stick" users to the same servers - https://serverfault.com/questions/941563. That may be sufficient to start with. If this doesn't work, we may have to store the IPs in the database under ShIp#192.000/000 with a TTL of 15min.

## Daily Report Limit

We have agreed to also limit the amount of reports per user per day to a maximum of 3.
