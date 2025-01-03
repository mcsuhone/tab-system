Fixes:

2. Top bar UI

- Redo for mobile
- Add a little shadow to the header on desktop

3. Improvement to activity logs

- .csv export from admin activity logs
- Better filters etc.
- Different section for transactions and users (different raports or sth?)

4. Add "annoskoko" to drinks page

5. Add little animation to price selector (same one as in quantity selector)

TODO:

1. Fix toasts!!

2. Create backup script through dockers that runs daily at 12:00 and keeps backups for 30 days

3. Add advanced search logic

- Use a fuzzy search to search for products
- Order products by popularity (this needs to be implemented somehow in the database, could be popularity score in products table that gets updated when a product is sold, with some calculation), this should reflect popularity of the product in the last 2 weeks, which is compared to other products sold in the time period.

4. Add a "top drinks" section to the products page include fire emoji
