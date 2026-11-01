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
//-------------------------------------------------------------------------------
pgAdmin 4 માં આ steps follow કરો.
Step 1: Create Database :-
Databases → Create → Database...
Database name લખો
Owner: postgres
Save
તમારું database create થઈ ગયું!
//-------------------------------------------------------------------------------
backend 
run = npx prisma init
run = npx prisma generate
run = npx prisma migrate dev --name init
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------