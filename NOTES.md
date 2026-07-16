# Debug notes (HW4)

I ran the guest checkout cart test with `npm run test:debug` and checked the log file in `logs/`. The debug lines showed each wait step, like waiting for the cart modal (`#cartModal.show`) and then waiting for at least 1 cart row (`#cart_info_table tbody tr`), so I could see exactly what the test was doing before it clicked checkout.

