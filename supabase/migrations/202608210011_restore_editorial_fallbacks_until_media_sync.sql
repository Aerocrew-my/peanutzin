-- Keep production images unbroken until the reviewed binary assets are explicitly authorized for remote upload.
update public.articles set hero_image_path='coral',hero_image_alt=null where slug='klibf-2027-plans-british-council-partnership' and hero_image_path='articles/klibf-2027-partnership.png';
update public.articles set hero_image_path='teal',hero_image_alt=null where slug='pena-malaysia-madani-opens-2026-manuscript-call' and hero_image_path='articles/pena-manuscript-call.png';
update public.articles set hero_image_path='yellow',hero_image_alt=null where slug='social-media-connects-writers-and-readers-at-klibf-2026' and hero_image_path='articles/klibf-social-community.png';
update public.articles set hero_image_path='blue',hero_image_alt=null where slug='bazar-buku-antarabangsa-johor-2026' and hero_image_path='articles/johor-book-bazaar.png';
update public.articles set hero_image_path='pink',hero_image_alt=null where slug='selangor-international-book-fair-2026' and hero_image_path='articles/selangor-book-fair.png';
