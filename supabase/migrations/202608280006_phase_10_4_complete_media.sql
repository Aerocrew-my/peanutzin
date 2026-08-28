-- Connect the complete Phase 10.4 publication artwork set.
update public.books set cover_image_path='catalogue/kl-noir-red/cover.webp' where slug='we-children-from-bahnhof-zoo-malaysian-edition';
update public.books set cover_image_path='catalogue/lake-like-a-mirror/cover.webp' where slug='lake-like-a-mirror';
update public.books set cover_image_path='catalogue/memori-seorang-geisha/cover.webp' where slug='memori-seorang-geisha';
update public.books set cover_image_path='catalogue/new-malaysian-essays/cover.webp' where slug='new-malaysian-essays';
update public.books set cover_image_path='catalogue/putera-cilik/cover.webp' where slug='putera-cilik';
update public.books set cover_image_path='catalogue/the-art-of-rest/cover.webp' where slug='the-art-of-rest';
update public.books set cover_image_path='catalogue/the-accidental-malay/cover.webp' where slug='the-accidental-malay';
update public.books set cover_image_path='catalogue/the-garden-of-evening-mists/cover.jpg' where slug='the-garden-of-evening-mists';
update public.books set cover_image_path='catalogue/the-reading-life/cover.webp' where slug='the-reading-life';

update public.articles set hero_image_path='editorial/real-content-2026/'||slug||'.webp',hero_image_alt='PEANUTZIN editorial artwork for '||replace(slug,'-',' ')
where status='published' and slug in (
'a-field-guide-to-your-first-independent-book-fair','are-readers-choosing-mood-before-genre','booktok-malaysia-is-making-room-for-local-voices',
'childrens-books-deserve-serious-design','dbp-training-keeps-language-publishing-skills-in-circulation','ebooks-and-the-shape-of-a-local-backlist',
'gerakbudaya-and-the-case-for-alternative-shelves','how-dbp-manuscripts-move-from-submission-to-review','how-to-read-a-book-fair-programme',
'podcasts-are-becoming-the-reading-list-before-the-reading-list','small-press-covers-are-doing-the-talking','the-independent-publishers-changing-the-shelf',
'the-quiet-infrastructure-of-a-reading-community','the-return-of-the-annotated-copy','the-tote-bag-has-entered-the-book-chat',
'what-a-local-voices-shelf-can-do','what-authors-are-reading-this-month','why-bilingual-reading-lists-feel-like-home','why-reading-aloud-still-matters');
