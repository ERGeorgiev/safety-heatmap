# Discussion on Processing

Discussion on how to do processing and scaling, overall backend computing.

## Requirements

- Inexpensive
- Observable
- Secure
- Easy to Setup
- AWS-based
- Scalable

The offer for cloud computing by AWS consists mainly of technologies called EC2, ECS, ECS Anywhere, Amazon CloudWatch (for monitoring). 

- [EC2](https://aws.amazon.com/ec2/) is basically a phiscal server (can also be virtual) that does processing. ECS
- [ECS](https://aws.amazon.com/ecs/) is a cluster of computing machines that can dynamically add or remove instances to adjust to workload. I believe the service by itself is free, but you pay for each instance it allocates.
- [ECS Anywhere](https://aws.amazon.com/ecs/anywhere) Free Trial for 6 months.
- [CloudWatch](https://aws.amazon.com/cloudwatch/) monitors applications perofrmance metrics, setups alarms. 


WIP Research:
https://github.com/ERGeorgiev/safety-heatmap/issues/22
https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all&awsm.page-all-free-tier=1&all-free-tier.q=ecs&all-free-tier.q_operator=AND
https://aws.amazon.com/ecs/
https://aws.amazon.com/ecs/anywhere/?did=ft_card&trk=ft_cardecsany
https://aws.amazon.com/ec2/?did=ft_card&trk=ft_card
https://www.reddit.com/r/aws/comments/x4pl23/hosting_my_own_projectwebsite_with_the_aws_free/
https://www.google.com/search?client=firefox-b-d&q=ecs+cost
https://www.reddit.com/r/aws/comments/105ovqf/do_ecs_clusters_cost_money_when_no_tasks_are/
https://www.google.com/search?client=firefox-b-d&q=esc+vs+esc+anywhere
https://medium.com/@adinicAWS/my-little-corner-of-the-cloud-b57e81f4c731
https://www.reddit.com/r/aws/comments/180ad9n/still_a_bit_confused_about_ecs_vs_ec2/
https://www.google.com/search?q=aws+ec2+cost&client=firefox-b-d&sca_esv=8c3b9fce3b8221a7&sxsrf=ADLYWIKxdeF8rzGsIJsbvWJaj14oCMs48w%3A1731259169890&ei=IeswZ4b9NbCK7NYPqPu56Q8&ved=0ahUKEwjGkdf-otKJAxUwBdsEHah9Lv0Q4dUDCA8&uact=5&oq=aws+ec2+cost&gs_lp=Egxnd3Mtd2l6LXNlcnAiDGF3cyBlYzIgY29zdDIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeSKEMUPMHWI8LcAN4AZABAJgBuQGgAfoDqgEDMS4zuAEDyAEA-AEBmAIFoALlAcICChAAGLADGNYEGEfCAg0QABiABBiwAxhDGIoFwgIHECMYsAIYJ5gDAOIDBRIBMSBAiAYBkAYJkgcDNC4xoAeUGA&sclient=gws-wiz-serp
https://www.reddit.com/r/aws/comments/14s0309/am_i_misunderstanding_the_cost_of_hosting_an_ec2/
https://aws.amazon.com/contact-us/sales-support/?pg=ecsprice&cta=herobtn
https://aws.amazon.com/ec2/pricing/on-demand/
https://www.google.com/search?client=firefox-b-d&q=aws+can+ec2+scale
https://www.google.com/search?q=what+is+ec2&client=firefox-b-d&sca_esv=8569cf8a79d87c05&sxsrf=ADLYWIKP21OwDhGE-uQ3giTNiJDvMEI53A%3A1731259541025&ei=lewwZ9Zu7Yz27w_FycCJCg&ved=0ahUKEwiWjdOvpNKJAxVthv0HHcUkMKEQ4dUDCA8&uact=5&oq=what+is+ec2&gs_lp=Egxnd3Mtd2l6LXNlcnAiC3doYXQgaXMgZWMyMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjILEAAYgAQYkQIYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESP4LUJQFWJELcAF4AZABAJgBiQGgAZQHqgEDMC44uAEDyAEA-AEBmAIFoALfA8ICBxAjGLADGCfCAgoQABiwAxjWBBhHwgINEAAYgAQYsAMYQxiKBZgDAIgGAZAGCpIHAzEuNKAHvS8&sclient=gws-wiz-serp
https://www.google.com/search?q=what+is+ec2&client=firefox-b-d&sca_esv=8569cf8a79d87c05&sxsrf=ADLYWIKP21OwDhGE-uQ3giTNiJDvMEI53A%3A1731259541025&ei=lewwZ9Zu7Yz27w_FycCJCg&ved=0ahUKEwiWjdOvpNKJAxVthv0HHcUkMKEQ4dUDCA8&uact=5&oq=what+is+ec2&gs_lp=Egxnd3Mtd2l6LXNlcnAiC3doYXQgaXMgZWMyMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjILEAAYgAQYkQIYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAESP4LUJQFWJELcAF4AZABAJgBiQGgAZQHqgEDMC44uAEDyAEA-AEBmAIFoALfA8ICBxAjGLADGCfCAgoQABiwAxjWBBhHwgINEAAYgAQYsAMYQxiKBZgDAIgGAZAGCpIHAzEuNKAHvS8&sclient=gws-wiz-serp
https://www.reddit.com/r/aws/comments/lo5flm/can_someone_explain_like_im_5_for_ec2/
https://www.google.com/search?client=firefox-b-d&q=aws+how+to+automatically+scale+ec2