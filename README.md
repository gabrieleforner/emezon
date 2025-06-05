# Emezon
## Overview
This isa demo project for an E-commerce web app that uses Kubernetes to orchestrate the <br>
components. This project doesn't provide any front-end for now (only the backend API endpoints), so to try
this using cURL or Postman is the only way to interact with the app. <br>

## Architecture
As already said, the whole application runs on Kubernetes, that handles both API servers, and <br>
the instances for the application DB and caching DB. The architecture is managed through image description.
![architecture](https://github.com/user-attachments/assets/c3e84da5-772c-495a-9fc5-a7c01e323012)

## Try it out
In order to try locally `emezon`, there are a few steps in order to set up <br>
your machine properly, Follow these general steps:
* Set up a K8s cluster locally
* Build/pull images
* Install Helm chart
