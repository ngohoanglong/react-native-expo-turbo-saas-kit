-- Create images table
create table if not exists public.images (
    id uuid primary key default extensions.uuid_generate_v4(),
    account_id uuid references public.accounts(id) not null,
    metadata jsonb not null default '{}'::jsonb,
    image_url text not null,
    sync_status text not null default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.images is 'Table to store image metadata and sync status';
comment on column public.images.account_id is 'The account that owns this image';
comment on column public.images.metadata is 'Image metadata like dimensions, size, etc';
comment on column public.images.image_url is 'URL to the image in storage';
comment on column public.images.sync_status is 'Status of image sync (pending, synced, failed)';

-- Enable RLS
alter table public.images enable row level security;

-- Create policies
create policy "Users can view their own images"
    on public.images for select
    using (account_id = auth.uid());

create policy "Users can insert their own images"
    on public.images for insert
    with check (account_id = auth.uid());

create policy "Users can update their own images"
    on public.images for update
    using (account_id = auth.uid())
    with check (account_id = auth.uid());

-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('user_images', 'user_images', false);

-- Create storage policy
create policy "Users can manage their own images"
    on storage.objects for all
    using (bucket_id = 'user_images' and auth.uid()::text = (storage.foldername(name))[1])
    with check (bucket_id = 'user_images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Grant access to authenticated users
grant all on public.images to authenticated; 