create table if not exists public.accounts (
    id uuid primary key,
    email text unique,
    picture_url varchar(255),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security;