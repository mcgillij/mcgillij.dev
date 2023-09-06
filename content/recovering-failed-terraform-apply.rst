Recovering from failed terraform apply
######################################

:author: mcgillij
:category: Linux
:date: 2023-09-06 23:49
:tags: Linux, Arch, terraform, Devops
:slug: recovering-from-failed-terraform-apply
:summary: Quick post on how to recover from a failed terraform apply
:cover_image: terraform.png

.. contents::

Failed apply?
*************

So we use a remote state for our terraform backend at work hosted in an S3 bucket for some background. And a backend configuration may look something like this:

.. code-block:: terraform

   terraform {
     backend "s3" {
       bucket         = "my-terraform-state"
       region         = "us-east-2"
       key            = "statebucket/terraform.tfstate"
       dynamodb_table = "my-lock"
     }
   }

What happens, when you're authentication lapses while you're running a terraform apply?

Terraform won't be able to update the state in the s3 bucket, and if you try to re-apply, you will get several errors reporting that the resources already exist.

However, terraform will dump an `errored.tfstate` file in your working directory, which you can use to recover from the failed apply.

You can inspect it to make sure it looks correct, and then run: 

.. code-block:: bash 

   terraform state push errored.tfstate

This will re-push the state to your configured backend.

However if you tried an apply, it will throw another error saying that the states do not match, and you will need to add the **-force** parameter.

.. code-block:: terraform

   terraform state push -force errored.tfstate

This saved me several hours today that would have had to be spent manually re-importing 460~ resources that were half-created when the authentication to AWS was severed.

Hope this helps someone else out there!
