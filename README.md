backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts                 # Express app setup (middlewares, routes)
│   ├── server.ts              # HTTP server setup & startup
│   ├── config/                # Environment variables, etc.
│   │   └── index.ts
│   ├── core/                  # Core functionalities
│   │   ├── middlewares/       # Global middlewares (error handling, auth)
│   │   │   ├── errorHandler.ts
│   │   │   └── authMiddleware.ts
│   │   ├── utils/             # Utility functions (asyncHandler, logger)
│   │   │   ├── asyncHandler.ts
│   │   │   └── apiError.ts
│   │   └── types/             # Global TypeScript types/interfaces
│   │       └── express.d.ts   # For extending Express Request object
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts (using Zod)
│   │   ├── users/             # (Example: if user profile management is separate)
│   │   │   ├── user.model.ts  (Prisma models are central, but you might have interfaces)
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.routes.ts
│   │   │   └── product.validation.ts
│   │   ├── categories/
│   │   │   ├── category.controller.ts
│   │   │   ├── category.service.ts
│   │   │   ├── category.routes.ts
│   │   │   └── category.validation.ts
│   │   ├── orders/
│   │   │   └── ... (similar structure)
│   │   └── cart/
│   │       └── ... (similar structure)
│   └── index.ts               # Main entry for modules (optional, for cleaner imports)
├── .env
├── .gitignore
├── package.json
└── tsconfig.json