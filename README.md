# intern-news-server

## Setup and Run

1. Clone the repository.
2. Create a `.env` file in the root with the following variables:
```

PORT=3000
HOST=0.0.0.0
DATABASE_URL="mongodb://localhost:27017/news?replicaSet=rs0"
DEFAULT_FEED_URL="https://feeds.bbci.co.uk/news/world/rss.xml"

````
3. Install dependencies:
```bash
npm install
````

4. Start the app:

   ```bash
   npm run start:dev
   ```

   This command will start MongoDB via Docker, initialize the database, and launch the server.

You can then test the API at "http://localhost:3000/feed" using a browser or Postman.

