variable "vpc_id" {
  description = "charleensideproject-vpc ID"
  type        = string
  default     = "vpc-02fb581658eb58d45"
}

variable "subnet_ids" {
  description = "charleensideproject-web Subnet IDs"
  type        = list(string)
  default     = [
    "subnet-0153eaf2e8d59b0a0",
    "subnet-01a1ebac945fa5853"
  ]
}
