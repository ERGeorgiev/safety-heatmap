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

- [EC2](https://aws.amazon.com/ec2/) is basically a phiscal server (can also be virtual) that does processing.
  - EC2 pricing: https://aws.amazon.com/ec2/pricing/on-demand/ also https://instances.vantage.sh/
    - We'll be using Linux instead of Windows due to price diff.

  - EC2 Auto-Scaling to launch new or terminate existing EC2 instances to meet load for the application. (ASG in short)

- [ECS](https://aws.amazon.com/ecs/) is a cluster of computing machines that can dynamically add or remove instances to adjust to workload. The service by itself is free, but you pay for each instance it allocates. Tip: You can use a capacity provider on the ecs cluster which will scale to zero instances if no tasks are running.
  - To use with Fargate. Fargate seems more expensive than simple ECS with EC2, but a lot less setup from what I gather. Many people recommend it, from what I see it may cost about $1 a month if properly configured, or even less. Seems like it has cold starts when not used, and there's a "spot" mode for extra savings by using spare AWS resources. The main costs may come from keep a "warm" server so it doesn't take a minute to download install setup and run a new server every time we send a request. Tho that might not be needed initially, which may bring down the costs to just pennies.
    - Fargate prices: https://aws.amazon.com/fargate/pricing/

  - More complex than the ASG.

- [CloudWatch](https://aws.amazon.com/cloudwatch/) monitors applications performance metrics, setups alarms.

WIP Research:
https://github.com/ERGeorgiev/safety-heatmap/issues/22
https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=*all&awsf.Free%20Tier%20Categories=*all&awsm.page-all-free-tier=1&all-free-tier.q=ecs&all-free-tier.q_operator=AND
https://aws.amazon.com/ecs/
https://aws.amazon.com/ecs/anywhere/?did=ft_card&trk=ft_cardecsany
https://aws.amazon.com/ec2/?did=ft_card&trk=ft_card



Guide: https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-amazon-elastic-container-service
https://www.youtube.com/watch?v=zs3tyVgiBQQ
Repo created for my apps image:

```aws ecr create-repository --repository-name safety-heatmap --region eu-west-1```

```json
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:eu-west-1:762233751295:repository/safety-heatmap",
        "registryId": "762233751295",
        "repositoryName": "safety-heatmap",
        "repositoryUri": "762233751295.dkr.ecr.eu-west-1.amazonaws.com/safety-heatmap",
        "createdAt": "2024-12-01T16:11:21.724000+00:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": false
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}
```

Repo: https://eu-west-1.console.aws.amazon.com/ecr/repositories/private/762233751295/safety-heatmap?region=eu-west-1





To install docker I do wsl --install in Powershell, which should install docker. DOesn't work so instead install DOcker Desktop https://www.docker.com/products/docker-desktop/



Search: https://www.google.com/search?client=firefox-b-d&q=use+GHA+to+deploy+to+ECS+guide
Tutorial: https://www.youtube.com/watch?v=zs3tyVgiBQQ (3:07)
GHA tutorial: https://docs.github.com/en/actions/use-cases-and-examples/deploying/deploying-to-amazon-elastic-container-service

- https://www.youtube.com/watch?v=LnA0hvN_FiE
- https://www.youtube.com/watch?v=mdFOohfheJc

- https://www.youtube.com/watch?v=00I3czV8guk
- https://www.youtube.com/watch?v=C_LJLZfvvaY
- https://www.youtube.com/watch?v=wLsWALjM-Uk

Golang and Node docker: https://stackoverflow.com/questions/70295544/how-to-download-golang-and-node-in-docker-container



I ran ` docker build . -t safetyheatmap`

