# Emezon

## 📚 Overview

`emezon` is a demo project that mimics an ecommerce web application with a distributed  
containerized architecture through a stack that involves:

- **MySQL** as DBMS for storing specific information used by the microservices.
- **Redis** as a session cache DB to temporarily store session JWT tokens with a 30-minute TTL.
- **Express.js** for writing microservice API servers.
- **RabbitMQ** as message broker for **Pub/Sub**-based functionalities.
- **Kubernetes (k8s)** to manage containers and the API gateway automatically.

The project contains detailed documentation in **JSDoc** format for code explanation  
and **OpenAPI** documentation for each endpoint, explaining return codes and documenting  
API functionalities.

## 🔎 Architecture
 ![EmezonK8sDiagram](https://github.com/user-attachments/assets/779cf6df-08f1-48e9-b96b-886d2dde9362)  
*Figure 1: Architecture diagram illustrating the microservices deployment on Kubernetes.*

As this project relies on a distributed system design, each microservice that underlies  
this application has different tasks to perform:
-  `users` allows a user to authenticate, authorize API calls, and retrieve or
    edit account information such as:
       - Name
       - Surname
       - Currency
       - Balance (mocked)
       - Payment methods
- `cart` allows a user to manage its cart, older orders, and shipping addresses
- `inventory` allows a user (whose role is `seller` or `administrator`) to view articles  
  and perform CRUD operations on the inventory of the application.
  
## 📂 Codebase structure 
-  `.github/workflows` contains CI/CD GitHub Actions
-  `docs` contains **OpenAPI** documentation
-  `backend`
    - `users` contains the codebase for the users microservice

