## Run the app in Docker

_[Docker](https://docs.docker.com/get-docker/) daemon must be running and [Docker Compose](https://docs.docker.com/compose/install/) must be installed to execute following commands._

```bash
# build and run app & db services in Docker
npm run docker:start

# wipe out previous mongo/node containers & images, then build new ones
npm run docker:cleanstart
```

**While the app is running, test the API with Swagger UI by navigating to:**

```
http://localhost:4000/api
```
