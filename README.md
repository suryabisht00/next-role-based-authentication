Certainly! I've added instructions for finding the GitHub ID and Secret to the `README.md` file:

```markdown
# Project Setup Instructions

## Installation of Dependencies

Run the following command to install dependencies:
```shell
npm I
```

If you encounter any errors, ensure you install the following dependencies:
```shell
npm install zod 
npm install react-dom 
npm install react-dom/client
npm install bcryptjs
npm install @types/bcryptjs -D
npm install sonner
npx shadcn-ui@latest add tabs
npm install shadcn-ui
npm install @radix-ui/react-tabs
npm install @radix-ui/react-dialog sonner
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install @radix-ui/react-select
```

## For Database

### Optional no need to install without facing any error:
```shell
npm install prisma -D
```
If you are using a custom table, execute these commands. I've already provided the Prisma schema, so you may not need to execute it. If you face any errors, remove the Prisma file and execute these commands, then paste all Collection field names on it:
```shell
npx prisma init --datasource-provider mongodb
npm install @auth/prisma-adapter
npm install prisma/client
npm i @prisma/client@latest
```


## MongoDB Atlas Setup

1. Log in to MongoDB Atlas and create a new project.
2. Obtain an API key for your project.
3. Paste the API key in the `DATABASE_URL` field in the .env file.
4. Run the following command to push the schema to the database:

### Necessary steps:
```shell
npm install @auth/prisma-adapter
npx auth secret
npx prisma db push
```

## The `auth secret` key will automatically be added to the `.env` file.

## Obtaining GitHub ID and Secret for Login

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click on **New OAuth App**.
3. Fill in the required fields:
   - **Application Name**: Your project name.
   - **Homepage URL**: `http://localhost:3000` (or your project’s homepage).
   - **Authorization Callback URL**: `http://localhost:3000/api/auth/callback/github`.
4. Click **Register Application**.
5. After registration, you'll see the **Client ID** and **Client Secret**. These are your GitHub ID and Secret.

## .env Configuration

Your `.env` file should look like this:
```env
AUTH_SECRET="****************************" 
AUTH_GITHUB_ID="**************************"
AUTH_GITHUB_SECRET="****************************"
DATABASE_URL="****************************"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="http://localhost:3000"
```

