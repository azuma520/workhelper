# workhelper

## API sanity check

1. Install dependencies and start the development server from the Next.js app directory:
   ```bash
   cd sop-app
   npm install
   npm run dev
   ```
2. With the server running on [http://localhost:3000](http://localhost:3000), hit the health-check endpoint:
   ```bash
   curl http://localhost:3000/api/test
   # {"status":"ok"}
   ```
3. To verify request parsing via POST, send JSON data:
   ```bash
   curl -X POST http://localhost:3000/api/test \
     -H "Content-Type: application/json" \
     -d '{"message":"hello"}'
   # {"status":"ok","received":{"message":"hello"}}
   ```
