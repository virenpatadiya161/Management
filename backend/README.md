npm init -y
npm install express cors dotenv jsonwebtoken bcrypt
npm install @prisma/client@7 @prisma/adapter-pg pg
npm install @prisma/extension-accelerate
npm install -D prisma@7 nodemon
//-------------------------------------------------------------------------------
package.json :-
"scripts": {
  "dev": "nodemon src/server.js"
}
"type": "module"
//-------------------------------------------------------------------------------
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── article.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── article.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
