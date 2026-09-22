/* ---------------------------------------------------------------------------
   family-key.js — the key that connects a browser to the family journal.

   THIS IS NOT A SECRET, and it is important that nobody believes it is. It
   is served to anyone who opens the site, so anyone who views the source can
   read it. What it buys is not privacy but two practical things:

     1. Nothing to type, ever. Ethan opens the site on any browser, on any
        machine, and his journal and his work are simply there. He never
        writes a note, saves it, and finds out later that it went nowhere -
        which is the failure this replaces and the reason it was worth the
        trade.

     2. A way to revoke. Change the line below, redeploy, and every browser
        follows immediately. No going round three laptops.

   The decision behind it, so nobody has to guess later: this is a study
   guide. It holds one line a day about what he learned, quiz scores, and
   his parents' replies. No surname, no school, no contact details. It is
   not linked from anywhere and carries a noindex, so it is not findable by
   search. Weighed against making him prove who he is every time he changes
   browser, an unlisted page won.

   If that trade ever stops feeling right, the way back is Cloudflare Access
   in front of the site: one Google sign-in per browser, a month at a time,
   and the page stops being publicly readable at all. The connect/disconnect
   machinery in shared/journal-sync.js is deliberately still there for that.
   --------------------------------------------------------------------------- */
window.ESH_FAMILY_KEY = 'ethan-lab-2026';
