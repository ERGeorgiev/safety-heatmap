# Discussion on Processing

Discussion on how to do processing and scaling, overall backend computing.

## Requirements

- Inexpensive
- Observable
- Secure
- Easy to Setup
- AWS-based
- Scalable

## Research

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

As part of the task is to perform automatic deployments via GHA, we have to dockerize the app. To install docker I ran wsl --install in Powershell, which should install docker. That did not work so instead I installed Docker Desktop https://www.docker.com/products/docker-desktop/

To make things simpler, moving us to a single backend server that hosts both backend and frontend, providing the frontend files as "static".

To build the docker image, I ran ` docker build . -t safetyheatmap`

To save on time and focus on MVP, I will avoid terraform at this stage.
To save on costs, I will avoid using a NAT.
To save on costs, I will avoid using paid VPC Endpoints, which means services will have to be in public subnets, secured by tight security groups.
As an Application Load Balancer is costly, I will use HTTP API Gateway instead.

Note: I removed the role AWSCloudMapRegisterInstanceAccess from the ECS Tasks, it gave them permissions to: 

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "servicediscovery:RegisterInstance",
        "servicediscovery:DeregisterInstance",
        "servicediscovery:DiscoverInstances"
      ],
      "Resource": "*"
    }
  ]
}
```

I think it will be okay, but if the Gateway starts throwing 500 at any point, this might be the reason.

## Initial Architecture

1. Networking: AWS VPC

    VPC Name: safetyheatmap
    Subnets:
        Public Subnets (x3): Accessible for external traffic.
        Private Subnets (x3): Used for internal ECS tasks and backend services.
    NAT Gateway: Not implemented due to cost constraints.
    Security Group: safetyheatmap-ecs
        Configured for controlled traffic flow between ECS, API Gateway, and DynamoDB.

2. Application Layers

    Frontend: React application served statically from ECS Fargate.
    Backend: Golang API deployed via ECS Fargate.
        Endpoints:
            /api/safetyheatmap/heatmap/get
            /api/safetyheatmap/report/add

3. Compute: ECS Fargate

    Cluster: safetyheatmap
    Service: safetyheatmap
    Task Definition: safetyheatmap
    Container Registry: AWS ECR (safety-heatmap)
	Part of: Security Group "safetyheatmap-ecs"
	Part of: VPC Public Subnets "safetyheatmap"

4. API Gateway

    Type: HTTP API Gateway (Cost-optimized over ALB)
	Uses VPC Link to interface with the ECS Fargate Service "safetyheatmap"

5. Data Storage

    Planned: DynamoDB for long-term persistent storage.

6. Monitoring and Logging

    Service: AWS CloudWatch
    Purpose: Application performance monitoring and alerts.

7. Deployment Pipeline

    CI/CD Tool: GitHub Actions
    Process:
        Build Docker image.
        Push to ECR.
        Update ECS service with the new image.

Traffic Flow Overview:

    User Request → API Gateway
	API Gateway -> VPC Public Subnets -> ECS Fargate Service (Golang Backend)
    ECS Fargate Service → DynamoDB (Planned for persistence)
    ECS Fargate Service → CloudWatch (Logs and Monitoring)

## Outstanding

ToDo: domain name for https://oopkvcjf5j.execute-api.eu-west-1.amazonaws.com/
 - Certificate pending: https://eu-west-1.console.aws.amazon.com/acm/home?region=eu-west-1#/certificates/503474d4-267c-4057-8f1c-8a84399e3190
 - Add domain name: https://eu-west-1.console.aws.amazon.com/apigateway/main/publish/domain-names/create?api=oopkvcjf5j&region=eu-west-1