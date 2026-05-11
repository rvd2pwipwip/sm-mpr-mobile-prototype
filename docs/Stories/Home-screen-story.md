SM Home screen story

I am the Home screen for a music, podcasts and radio streaming app named Stingray Music (working title, naming/branding to be determined).

My main goal is to welcome new guest users with a landing screen that presents curated content in all 3 types of content our app proposes.

At the top of my screen, I feature an overlayed header with the app’s branding and a call-to-action button for unsubscribed users to subscribe.

Of course, the header content will adapt to the current user type but by default, I am presenting the app to unsigned, unprovided, unsubscribed users known as guest users.

Just below the header, I’m featuring a self-promo banner that our marketing and product people will use to push forward different content/promotional/seasonal material.

That’s the banner’s official utilitarian reason of being, but it’s also through this banner that I can display some app personality while visually anchoring the rest of my layout and being a user hot spot on my heat map.

Then the content per se begins with different swimlanes for music channels, podcasts, and radio stations, in that order (more on the Recommendations category below). I present my content in a vertically scrollable container that extends my full height but scrolls below my top and bottom anchored header and footer elements.

My swimlanes are identified with a header displaying their title and a More button for users who want to see more curated items.

That being said, as soon as users will have used the app to listen to any content, the very first swimlane displayed below the banner will be the Listen again swimlane, with smaller tiles and no labels because I want users to be able to easily get back to any content they have listened to previously. This is super important for a linear music and radio streaming app! Even if podcasts are an on-demand type of content, being able to go back to a previous podcast, if only to see its list of episodes again, is also an important use case to cater to at the forefront of my screen.

The Listen again is one of the rare swimlanes that features a mix of content types (channels, podcasts –not episodes at this level, and stations).

I am not displaying labels on these small cards because users already know this content, and it makes this swimlane take up less room on the screen (more room for other content).

Another swimlane that might appear before even the Listen again swimlane is the Favorites category. That swimlane, when populated is THE most important user customized swimlane but since users typically don’t bother using the Like feature that much, it will rarely be displayed.

The last swimlane, below the radio one, is the Recommendations category. At first, it will be kind of generic with geo targeted content, but these recommendations should be refined based on Listen again and Favorites content as users use the app. Of course, it could also present a mix of content type, depending on the user’s usage history.

My footer is a UI element overlay that features, anchored at my bottom, the main menu where users can navigate to the main sections of the app (Home, Search, Info)

My footer also features the miniplayer, anchored at the top of the main menu, when users have started streaming any content.

I’ve also been mandated to display visual ads for unsubscribed and unprovided users.

**Prototype mapping (code):** see **`../visual-ads-and-user-types.md`** — `guest`, `freeStingray`, and `freeProvided` show the footer ad placeholder under the tab bar and on the music player; `subscribed` does not.

These ads can be displayed below the main menu in my footer and also between my content swimlanes.

I’ve already mentioned that our app caters to different types of users, so I must make sure user types are easily identified through my layout and visuals.

To that extent, I use my header to reflect the current user type:

Guests and freeStingray (Stingray account logged in but no valid subscription) see the Upgrade call-to-action button. This button is replaced by a provider logo for freeProvider users (typically users accessing the app through their cable providers).

Subscribed users only see a centered app branding logo (no provider, no upgrade), and they are the only user type without ads.

When I’m not displaying ads, I move the main menu (and the miniplayer) to my very bottom so I have more room to display content.

This means that I always have consider my footer’s current state (miniplayer? Ad?) to calculate my content’s bottom padding so I always allow users to view all my content without my footer blocking the bottom item(s).

In a nutshell, I am very proud to be the most welcoming screen of the app, its ambassador, really! With my header, content, and footer elements always reflecting the current user type, regular users, no matter their type, should find the shortcuts to most of their daily needs here and only need to go to my friend the Search screen only occasionally.
