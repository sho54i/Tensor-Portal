# Tensor Portal

This is the public gateway for the AiM software stack, featuring secure authentication via Dynamic.xyz.

## Getting Started

1.  Install dependencies:
    ```bash
    pnpm install
    ```
2.  Run the development server:
    ```bash
    pnpm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

Ensure `.env.local` contains your Dynamic Environment ID:
```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=193dbeff-c513-4991-b8d2-d6dc352f71f9
```

## Deployment

### Vercel

1.  Install the Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the `tensor-web` directory to link and deploy.
3.  Add the `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` secret to your Vercel project settings.

