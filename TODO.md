TODO CRITICAL:

1. Move categories into DB from hard coded enum. => Make a page on admin panel to manage categories.

2. Fix activity logs mobile view (filters overflow)

3. Fix member nro filter in activity logs

TODO EXTRA:

1. Add a "home page" that contains top drinks, analytics etc. fun stuff

- Allow adding products to shopping cart from home page
- Use materialized views to store top drinks, top products, etc.

2. Add advanced search logic

- Use a fuzzy search to search for products
- Order products by popularity (this needs to be implemented somehow in the database, could be popularity score in products table that gets updated when a product is sold, with some calculation), this should reflect popularity of the product in the last 2 weeks, which is compared to other products sold in the time period.

3. Maybe add some cool animation for logging in?
