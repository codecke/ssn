create table if not exists public.ssn_registrations (
  id uuid primary key,
  form_type text not null check (form_type in ('volunteer', 'partner')),
  submitted_at timestamptz not null default now(),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  notified boolean not null default false
);

create index if not exists ssn_registrations_export
  on public.ssn_registrations (form_type, id);

alter table public.ssn_registrations enable row level security;
revoke all on table public.ssn_registrations from public, anon, authenticated;
grant select, insert, update on table public.ssn_registrations to service_role;
