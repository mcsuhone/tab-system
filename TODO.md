TODO CRITICAL:


1. Add "auto logout" button to login page

2. Fix shopping cart dialog to have scroll and max-height (overflows if too many items)

3. Move categories into DB from hard coded enum. => Make a page on admin panel to manage categories.

4. Fix activity logs mobile view (filters overflow)

TODO EXTRA:

1. Add a "top drinks" section to the products page include fire emoji

- This includes "most popular" drinks based on sales

2. Add advanced search logic

- Use a fuzzy search to search for products
- Order products by popularity (this needs to be implemented somehow in the database, could be popularity score in products table that gets updated when a product is sold, with some calculation), this should reflect popularity of the product in the last 2 weeks, which is compared to other products sold in the time period.

3. Maybe add some cool animation for logging in?
