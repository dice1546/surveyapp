## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Here is the SQL table for saving the form submissions.

-- Supabase table schema for form submissions
```SQL
CREATE TABLE form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demographics JSONB NOT NULL,
  health JSONB NOT NULL,
  financial JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('draft', 'completed')), 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

You will also need the Project APIs from the Supabase Dashboard in order to connect with Supabase

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```


### **Detail Description**
This project was built using React and its ecosystem based libraries.
Following tech stack was used-
- Next.js 15
- React 19
- react-hook-form
- Supabase
- Shadcn-ui
- zod
- Tailwind CSS
