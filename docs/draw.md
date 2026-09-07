# DRAW on Tensor Portal

The Projects page lists DRAW alongside Key·Viz. `/draw` redirects to `/draw/index.html`, a full-page static editor suitable for iPad and Pencil input. Its bundled Paper.js dependency lives in `/draw/vendor/` so relative assets work without an iframe or an external service.

Editor source: DRAW commit `26a39e2` (`cleanup-reviewed-2026-09-07`), archived at `H:\draw-git`. `public/draw/index.html` is byte-identical to that reviewed source. Planning, tests, samples and local deployment settings are not published.

For future updates, copy the accepted DRAW `vector_pen_tool.html` to `public/draw/index.html`, refresh changed vendor assets, verify drawing/undo and both Projects links, then deploy this portal. Keep the development archive separate from public assets.

The former eve-draw-pencil testing URL is retired in favor of the portal. Local browser artwork belongs to its original origin; saved outline JSON can be opened in the main-site editor.
