
# Create Lambda function
resource "aws_lambda_function" "cloud_resume" {
  filename         = data.archive_file.zip.output_path
  source_code_hash = data.archive_file.zip.output_path
  function_name    = "cloud_resume"
  role             = aws_iam_role.cloud_resume_lambda_role.arn
  handler          = "func.lambda_handler"
  runtime          = "python3.12"  
}

resource "aws_lambda_function_url" "lambda_url" {
  function_name      = aws_lambda_function.cloud_resume.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["https://resume.tdaza.com"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    expose_headers    = ["*"]
    max_age           = 86400
  }
}
data "archive_file" "zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/packedlambda.zip"
}

# Create a role for lambda 
resource "aws_iam_role" "cloud_resume_lambda_role" {
  name = "cloud_resume_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
       "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# Create an IAM policy to attach to the lambda role with basic permissions over CloudWatch and DynamoDB table
resource "aws_iam_policy" "cloud_resume_lambda_policy" {
  name        = "cloud_resume_lambda_policy"
  path        = "/"
  description = "AWS IAM Policy for managing the cloud resume project role"
  policy      = jsonencode(
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource": "arn:aws:logs:*:*:*"
        },
        {
          "Effect": "Allow",
          "Action": [
            "dynamodb:GetItem",
            "dynamodb:PutItem"
          ],
          "Resource": "arn:aws:dynamodb:*:*:table/cloud-resume"
        }
      ]
    }
  )
}

# Attach policy to lambda role
resource "aws_iam_role_policy_attachment" "cloud_resume_lambda_policy_attachment" {
  role       = aws_iam_role.cloud_resume_lambda_role.name
  policy_arn = aws_iam_policy.cloud_resume_lambda_policy.arn
}


