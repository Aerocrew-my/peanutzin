# PEANUTZIN administrator guide

## Login

Open `/admin/login`, sign in with the account issued privately by the owner, and use **Log out** when finished. There is no signup. An active `admin_users` membership is required.

## Articles and events

In **Articles**, manage title, slug, category, excerpt/body, draft/published state, publication date, featured/trending fields, source name/URL, SEO title/description and image. Use meaningful alt text. Drafts are not public; published items need a publication date.

Events are articles with `articles.category = 'event'`; there is no separate event table. Select **Event**, then add start/end date, location, official URL, image and publication details. The end must follow the start.

## Books

Manage title, author, slug, description, MYR price, ISBN, cover, featured/active state and stock. Inactive books are hidden and cannot be ordered. A whole-number stock value is finite; blank/null means unlimited or untracked; zero means unavailable.

## Orders

Orders show customer/shipping details, immutable item/price snapshots, payment information, fulfilment state and private admin notes. Fulfilment follows `pending → processing → shipped → completed`; pending or processing can be cancelled. Payment (`unpaid`, `pending`, `paid`, `failed`, `refunded`) is separate. The admin UI cannot mark payment paid; never alter paid totals directly.

## Site settings

The editor currently manages announcement, newsletter heading/copy, contact email/phone, and Instagram/TikTok/Facebook links. Shipping is a database setting, not edited on this screen.

## Social Studio

Select an article or enter a brief; generate when OpenAI is configured or write manually; edit and review; save as reviewed and mark **Ready**; select platforms; publish through Make.com once configured. Until then use **Copy Caption**, **Copy Hashtags**, **Copy Full Post**, **Open Platform**, and **Mark Published Manually**. Publication history remains visible.

## Media

Prefer client-owned imagery, authorized official artwork, licensed images, book covers and original PEANUTZIN graphics. Keep originals separately, use JPEG/PNG/WebP up to 5 MB, and avoid hotlinks or fake documentary photography.
