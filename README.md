# CarGo Car Rentals App

Hybrid car rental app with a jQuery Mobile client, Express API, JWT authentication, and MongoDB Atlas persistence.

Deployment/backend update prepared by Gabriel Balbuena (12292617).

## Backend Setup

1. Install dependencies:

```powershell
npm install
```

2. Create `.env` from `.env.example` and fill in real values:

```env
PORT=3000
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-long-random-secret
CORS_ORIGIN=*
HTTPS_ENABLED=false
```

3. Seed the fleet collection:

```powershell
npm run seed:cars
```

4. Run the API:

```powershell
npm start
```

The local API runs at `http://localhost:3000`.

## API Routes

- `POST /api/signup`
- `POST /api/signin`
- `GET /api/cars`
- `GET /api/cars/:id`
- `POST /api/bookings`
- `GET /api/bookings`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`

Cars and bookings routes require the `Authorization: Bearer <token>` header.

## HTTPS

For local HTTPS testing, create certificate files and set:

```env
HTTPS_ENABLED=true
SSL_KEY_PATH=server/certs/key.pem
SSL_CERT_PATH=server/certs/cert.pem
```

Render normally terminates HTTPS at the platform edge, so the app can run with `HTTPS_ENABLED=false` on Render while still being accessed through a public HTTPS URL.

## Render Deployment

Use these settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `HTTPS_ENABLED=false`

After deployment, run `npm run seed:cars` locally against the same Atlas database or use Render Shell if available.

## Cordova

Create the Cordova wrapper outside or inside this repo, then copy the `client` files into Cordova `www`.

```powershell
npm install -g cordova
cordova create cargo-cordova com.cargo.rentals CarGo
Copy-Item -Path client\* -Destination cargo-cordova\www -Recurse -Force
cd cargo-cordova
cordova platform add browser
cordova platform add android
cordova run browser
cordova run android
```

For Android emulator testing against a local API, the client uses `http://10.0.2.2:3000` when opened from `file:`. For a deployed API, set it in the app before testing:

```javascript
localStorage.setItem("apiUrl", "https://your-render-service.onrender.com");
```
