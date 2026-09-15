# 🔐 SynapseOS Authentication & Security Architecture

## 1. Authentication Architecture Overview

SynapseOS employs a **stateless, dual-channel authentication engine**:
1. **Email & Password Authentication:** Standard registration and login powered by cryptographic hashing with **bcrypt** (10 salt rounds).
2. **Google OAuth 2.0 Single Sign-On:** Official Google Identity Services SDK popup integration on the frontend paired with server-side token validation via **`google-auth-library`**.

Both authentication channels converge into a single unified session abstraction: a cryptographically signed **JSON Web Token (JWT)** that authenticates every subsequent API request.

---

## 2. Authentication Flows

### Flow A: Email & Password Authentication

```text
[User Form Submit]
        │
        ▼
[Frontend: authService.login] ────► POST /api/auth/login { email, password }
                                           │
                                           ▼
                                [Express: authController.login]
                                           │
                                           ▼
                                [Model: authModel.findUserByEmail]
                                           │
                                           ▼
                                [bcrypt.compare(password, password_hash)]
                                           │
                                           ├─── [Match Failed] ──► 401 Unauthorized
                                           │
                                           └─── [Match Succeeded]
                                                    │
                                                    ▼
                                          [Generate JWT Token]
                                          jwt.sign({ userId, email }, JWT_SECRET)
                                                    │
                                                    ▼
                                          [Return 200 OK + JWT]
                                                    │
                                                    ▼
                                       [Frontend stores token in localStorage]
```

---

### Flow B: Google OAuth 2.0 Single Sign-On

```text
[User clicks "Continue with Google"]
        │
        ▼
[Frontend: Google Identity Services SDK Popup]
        │
        ▼
[User authorizes SynapseOS in Google Modal] ────► Returns Google ID/Access Token
        │
        ▼
[Frontend: googleAuth.js sends token] ────► POST /api/auth/google { access_token }
                                                   │
                                                   ▼
                                        [Backend: authController.googleLogin]
                                                   │
                                                   ▼
                                        [google-auth-library OAuth2Client]
                                        Verify token against Google Servers
                                                   │
                                                   ▼
                                        Extract { email, name, picture }
                                                   │
                                                   ▼
                                        [Check if user exists in MySQL]
                                                   │
                                                   ├─── [User Exists] ──────────────────────────┐
                                                   │                                            │
                                                   └─── [New User]                              │
                                                          │                                     │
                                                          ▼                                     │
                                                        Generate sanitized username             │
                                                        Generate random bcrypt password         │
                                                        INSERT INTO users (...)                 │
                                                          │                                     │
                                                          └─────────────────────────────────────┤
                                                                                                │
                                                                                                ▼
                                                                                    [Generate SynapseOS JWT]
                                                                                                │
                                                                                                ▼
                                                                                    [Return 200 OK + JWT + User]
```

---

## 3. JWT Token Specification & Verification

- **Algorithm:** HMAC SHA-256 (`HS256`)
- **Payload Structure:**
  ```json
  {
    "userId": 42,
    "email": "student@university.edu",
    "iat": 1726387200,
    "exp": 1726992000
  }
  ```
- **Transmission:** Sent via the standard HTTP header:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```

### Server-Side Verification Middleware (`authMiddleware.js`):
```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attaches { userId, email }
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};
```

---

## 4. Client-Side Authentication State & Route Protection

### 1. `AuthContext.jsx`
Maintains reactive user session state across React component trees:
- Reads stored token and user metadata from `localStorage` on initial mount.
- Exposes `user`, `login(token, userData)`, `logout()`, and `isAuthenticated` boolean helper.

### 2. `ProtectedRoute.jsx`
Intercepts navigation attempts to private views:
```jsx
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
```

### 3. Automatic Token Injection (`services/api.js`)
Axios interceptor attaches the bearer token to all outgoing requests without needing manual header configuration inside page components.

---

## 5. Security & Isolation Guarantee

1. **Multi-Tenant Data Isolation:** Controllers never accept `userId` from request bodies. The `userId` is strictly extracted from `req.user.userId` (decoded from the verified JWT) and injected into SQL queries (`WHERE user_id = ?`).
2. **Password Invariant:** The database schema enforces `password_hash NOT NULL`. Google OAuth users receive a cryptographically generated 32-character random string hashed with bcrypt, ensuring schema integrity while disabling standard password login until an explicit password is set.
3. **No Secret Logging:** Server logs never print raw JWT secrets, passwords, or database credentials.
