drop policy if exists "Active admins insert social publications" on public.social_publications;
create policy "Active admins insert ready social publications" on public.social_publications for insert to authenticated
with check (
  public.is_active_admin()
  and created_by = auth.uid()
  and exists (
    select 1 from public.social_drafts
    where social_drafts.id = social_publications.social_draft_id
      and social_drafts.status = 'ready'
  )
);
