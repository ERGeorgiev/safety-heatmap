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







To save on time and focus on MVP, I will avoid unecessary terraform at this stage and I will also not implement a load balancer.
Actually, seems like I'll need a load balancer for security.

To save on costs, I will setup a single NAT gateway (as each has costs associated), which might impact reliability, but should cost a lot less than setting up 3 (one in each availability zone).

So now I am planning to put my ECS Fargate service on the private subnets that are associated with a NAS route table, in order to keep them away from public access, and then enable public access via a load balancer. 

Unsure how to setup the security group since its for the whole VPC,while it seems like I am supposed to have 2 diff security groups with diff rules.

I setup the ECS on a private subnet and setup a VPC with private and public subnets. I setup a NAT gateway to allow services on the private subnet to call external APIs. After 2 days, the NAT gateway costed 1$, which makes it too expensive for this zero-cost build. As such, I now plan to either avoid external API calls or keep the ECSs on a public VPC entirely, which isn't great for security, but we can try mitigating that using restricted security groups.
An option exist to use AWS WAF, which supplies the user's geolocation with every request, but it costs around ~6$ per month.
Another options is using a Lambda, which is cheap, but needs a VPC Endpoint to be used, which costs around ~8$ per month.
  - The lambda though, can be placed outside of a VPC, which will expose it, but will save the cost of VPC.
All of this effort for the benefit of zooming in on the user's country? Maybe we should deal away with that feature.

This raised alerts in my about the VPC Endpoint needed for DynamoDB, but turns out that's free.
Now exploring this further, the ALB (application load balancer) is also expensive at 16$ per month. An alternative is the API Gateway.
API Gateway seems to do load balancing and provide security against heavy traffic and DDOS, but doesn't stick users to the same servers, which means the multi-user reports plans will have to make a compromise where we can't rely that a user will remain on a given BE server.
Seems like API Gateway is the way to go.

I was working on setting up VPC Endpoints to enable access to the ECR repo from inside the private VPC, but turns out they have a high cost of around 16$ per month, and we're not using a NAT gateway either, which means we may have to go public.

ECS is now in a public VPC, I have confirmed that the SG is configured correctly and I cannot reach it's public IP.

I removed the role AWSCloudMapRegisterInstanceAccess from the ECS Tasks, it gave them permissions to: 

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

ToDo: Disable CloudWatch logs.

Chat GPS instructions:

Below is a high-level guide for automatically deploying your Docker-based application to AWS Fargate (ECS) using GitHub Actions (GHA). This assumes:

    You already have a Dockerfile in your repo.
    You have an AWS account with permissions to create/use ECR (Elastic Container Registry) and ECS (Elastic Container Service).
    You want a push to main (or another branch) to automatically build, push the image, and update your service in Fargate.

1. Create an AWS ECR Repository

    Go to the AWS Console > ECR (Elastic Container Registry).
    Click Create Repository.
    Choose a name (e.g., myapp) and set Private visibility.
    Note your AWS Region and Account ID (e.g., 123456789012), because you’ll need them to push images to ECR.

2. Set Up an ECS Cluster & Fargate Service

    Go to the AWS Console > ECS.
    Create a new cluster (e.g., myCluster) if you don’t have one.
        You can pick the “Networking only” (Fargate) cluster template.
    Create a Task Definition using the Fargate launch type.
        In the container definition, reference the ECR image you will push (e.g., 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:latest).
        Expose ports if needed (e.g., port 8080).
    Create a Service (e.g., myService) using that Task Definition.
        Fargate will run your container using that Task Definition.
        Make sure to associate the correct VPC and subnets as required.
        After creation, you’ll have a running container that initially might fail to pull the image until you push your image for the first time.

3. Configure GitHub Secrets

In your GitHub repo, go to Settings > Security > Secrets and variables > Actions:

    AWS_ACCESS_KEY_ID: Your IAM user’s Access Key ID (with permissions for ECR/ECS).
    AWS_SECRET_ACCESS_KEY: Your IAM user’s Secret Access Key.
    AWS_REGION: The region of your ECR/ECS (e.g., us-east-1).
    (Optional) AWS_ACCOUNT_ID: Your 12-digit AWS account number. Alternatively, you can hardcode it in the workflow if you prefer.

4. Add a GitHub Actions Workflow

Create a file in your repo at .github/workflows/deploy.yml (the filename can be anything, e.g., deploy.yml). Below is an example workflow that:

    Builds your Docker image.
    Pushes it to ECR.
    Deploys the updated image to ECS (Fargate).

Replace placeholders (<ACCOUNT_ID>, <REGION>, <REPO_NAME>, <CLUSTER_NAME>, <SERVICE_NAME>, etc.) with your actual values.

name: Deploy to Fargate

on:
  push:
    branches:
      - main  # or whichever branch you want to trigger on

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Check out code
      uses: actions/checkout@v3

    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_REGION }}

    - name: Log in to Amazon ECR
      run: |
        aws ecr get-login-password --region ${{ secrets.AWS_REGION }} \
          | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com

    - name: Build, tag, and push image
      run: |
        # 1) Build the Docker image (assuming Dockerfile in root)
        docker build -t myapp .
        
        # 2) Tag it for ECR
        docker tag myapp:latest <ACCOUNT_ID>.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/<REPO_NAME>:latest

        # 3) Push to ECR
        docker push <ACCOUNT_ID>.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/<REPO_NAME>:latest

    - name: Deploy to ECS
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        # ECS cluster name
        cluster: <CLUSTER_NAME>

        # ECS service name
        service: <SERVICE_NAME>

        # A local JSON file or an inline template referencing the new image
        task-definition: ecs-task-definition.json
        wait-for-service-stability: true

4.1. Task Definition Reference

The step:

- name: Deploy to ECS
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
  with:
    task-definition: ecs-task-definition.json
    ...

expects a task definition JSON in your repo. One approach is to keep a “template” ecs-task-definition.json in your project, referencing <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<REPO_NAME>:latest for the container image. For example:

{
  "family": "myTaskDefinition",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "myContainer",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:latest",
      "cpu": 256,
      "memory": 512,
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8080,
          "hostPort": 8080
        }
      ]
    }
  ],
  "requiresCompatibilities": [
    "FARGATE"
  ],
  "cpu": "256",
  "memory": "512"
}

    Adjust CPU/memory/ports as needed.
    Ensure the executionRoleArn points to a valid IAM Role that has permission for ECS tasks.

5. Commit and Push

After creating .github/workflows/deploy.yml and (optionally) adding ecs-task-definition.json (or referencing a pre-existing one), commit and push to your main branch. GitHub Actions will then:

    Build your Docker image in the workflow runner.
    Push the new image to your ECR repo.
    Update your ECS service’s task definition to use the newly pushed image.
    ECS Fargate will pull the new image and redeploy your service.

6. Verify the Deployment

    Go to AWS ECS console, find your service (e.g., myService), and check the Events tab to see if ECS pulled the new image.
    Make sure the Desired tasks and Running tasks match up. If all is well, your container will be in a RUNNING state with the new image.

7. Best Practices & Next Steps

    Use version tags rather than just latest—for example, myapp:1.0.0—so you can roll back if needed.
    Set up proper IAM roles for your GitHub Actions to limit access. You may use OpenID Connect with aws-actions/configure-aws-credentials instead of storing long-lived Access/Secret keys.
    Automate environment variables (e.g., using ECS task definitions or parameter store).
    Add Slack notifications or other integrations in your GitHub Actions workflow for better visibility.

In Summary

    Create ECR and ECS (Fargate) resources in AWS.
    Store AWS credentials in GitHub Secrets.
    Add a GitHub Actions workflow (.github/workflows/deploy.yml) to:
        Build the Docker image.
        Push to ECR.
        Update ECS service to pull the new image.

That’s the standard pipeline for an automated push-to-deploy workflow onto AWS Fargate via GitHub Actions. Good luck with your setup!