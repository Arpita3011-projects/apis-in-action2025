# APIs in Action — Upgraded

1. Copy files into folder structure.
2. Create .env from .env.example and set MONGO_URI and JWT_SECRET.
3. Install deps: npm install.
4. Start: npm run dev.
5. Register an account: POST /api/auth/register (use the returned token). Make the user admin in DB (or create admin manually) to test protected routes.
6. Explore APIs: GET /api/videos?search=react&page=1&limit=5
7. Docs: /api-docs (if swagger.yaml added).

Good improvements: add file uploads (Cloudinary), pagination UI, rate limiting, or analytics hooks.