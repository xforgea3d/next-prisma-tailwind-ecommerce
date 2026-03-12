insert into storage.buckets (id, name, public) 
values ('ecommerce', 'ecommerce', true)
on conflict (id) do nothing;

create policy "Anon can read ecommerce bucket"
on storage.objects for select
to public
using ( bucket_id = 'ecommerce' );

create policy "Authenticated users can upload to ecommerce bucket"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'ecommerce' );

create policy "Authenticated users can update ecommerce bucket"
on storage.objects for update
to authenticated
using ( bucket_id = 'ecommerce' );

create policy "Authenticated users can delete from ecommerce bucket"
on storage.objects for delete
to authenticated
using ( bucket_id = 'ecommerce' );
