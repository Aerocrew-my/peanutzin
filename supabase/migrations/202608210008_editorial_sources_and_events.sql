alter table public.articles
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists event_url text;

alter table public.articles
  add constraint articles_source_url_http check (source_url is null or source_url ~ '^https://'),
  add constraint articles_event_url_http check (event_url is null or event_url ~ '^https://');

create index if not exists articles_upcoming_events_idx
  on public.articles (event_start_at asc)
  where status = 'published' and category = 'event';

delete from public.articles where slug in (
  'klibf-returns-with-a-bigger-reading-party',
  'five-ways-to-find-your-next-community',
  'a-small-press-weekend-in-georgetown'
);

insert into public.articles (slug, title, excerpt, body, category, status, featured, trending_rank, hero_image_path, published_at, event_start_at, event_end_at, event_location, source_name, source_url, event_url)
values
('klibf-2027-plans-british-council-partnership', 'KLIBF looks to broaden its international reach in 2027', 'Organisers say discussions with the British Council are under way as the fair plans its next edition.', 'The Kuala Lumpur International Book Fair is preparing a wider international programme for 2027. Organisers told Bernama that a proposed British Council partnership could deepen literary and cultural exchange, while interest from publishers in Iran, the UAE and China is also being considered. This PEANUTZIN brief summarizes the source report; follow the source link for the full story.', 'news', 'published', true, 1, 'coral', '2026-07-28T19:44:00+08:00', null, null, null, 'Bernama', 'https://www.bernama.com/en/general/news.php?id=2587167', null),
('pena-malaysia-madani-opens-2026-manuscript-call', 'PENA–Malaysia MADANI opens its 2026 manuscript call', 'Malaysian writers can submit manuscripts for the programme’s third phase until 31 December 2026.', 'The third phase of the PENA–Malaysia MADANI book publishing project is accepting work from local writers. According to RTM, selected manuscripts will be professionally published for distribution to schools and the wider public. Submissions close on 31 December 2026. This is a PEANUTZIN summary of the source announcement.', 'news', 'published', false, 2, 'teal', '2026-06-02T17:39:00+08:00', null, null, null, 'RTM', 'https://berita.rtm.gov.my/nasional/senarai-berita-nasional/senarai-artikel/penghantaran-manuskrip-pena-malaysia-madani-dibuka-hingga-31-disember/', null),
('social-media-connects-writers-and-readers-at-klibf-2026', 'Social platforms are helping Malaysian writers meet readers', 'Publishers at KLIBF 2026 described how online communities can introduce titles and strengthen book sales.', 'At the 2026 Kuala Lumpur International Book Fair, writers and publishers discussed the role social media plays in turning online discovery into reader relationships and book purchases. Bernama reported that the fair brought together hundreds of publishers across roughly 1,000 booths. This PEANUTZIN brief summarizes the source report.', 'news', 'published', false, 3, 'yellow', '2026-05-31T19:36:00+08:00', null, null, null, 'Bernama', 'https://bernama.com/en/general/news.php?id=2563359', null),
('bazar-buku-antarabangsa-johor-2026', 'Bazar Buku Antarabangsa Johor 2026', 'Five days of books and reader activities arrive at Paradigm Mall Johor Bahru.', 'Perbadanan Perpustakaan Awam Johor presents its 2026 international book bazaar with book selections and activities for readers and families. Check the organizer’s page for programme updates.', 'event', 'published', false, null, 'blue', '2026-08-14T09:00:00+08:00', '2026-08-21T10:00:00+08:00', '2026-08-25T22:00:00+08:00', 'Paradigm Mall Johor Bahru', 'Perbadanan Perpustakaan Awam Johor', 'https://ppaj.johor.gov.my/bazar-buku-antarabangsa-johor-2026/', 'https://ppaj.johor.gov.my/bazar-buku-antarabangsa-johor-2026/'),
('selangor-international-book-fair-2026', 'Selangor International Book Fair 2026', 'The state’s annual book celebration returns for ten days under the theme Connecting Heart and Mind.', 'Organised by the Selangor State Government through the Selangor Public Library Corporation, SIBF 2026 gathers books, ideas and publishing communities at Setia City Convention Centre. Follow the official portal for programme and visitor details.', 'event', 'published', false, null, 'pink', '2026-08-19T09:00:00+08:00', '2026-11-27T10:00:00+08:00', '2026-12-06T22:00:00+08:00', 'Setia City Convention Centre, Shah Alam, Selangor', 'Selangor International Book Fair', 'https://sibf.my/', 'https://sibf.my/')
on conflict (slug) do update set title=excluded.title, excerpt=excluded.excerpt, body=excluded.body, category=excluded.category, status=excluded.status, featured=excluded.featured, trending_rank=excluded.trending_rank, hero_image_path=excluded.hero_image_path, published_at=excluded.published_at, event_start_at=excluded.event_start_at, event_end_at=excluded.event_end_at, event_location=excluded.event_location, source_name=excluded.source_name, source_url=excluded.source_url, event_url=excluded.event_url;
