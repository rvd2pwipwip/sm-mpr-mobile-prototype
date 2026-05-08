Search and Browse story

I am Search and I live in a house I share with my brother Browse. My house, known as Search, is the second major tab of our app’s main navigation menu.

I want to start with my brother, Browse, with whom I get along well. I think we are complementary in the way we cater to user needs: I take care of user queries (search results) while Browse takes care of their hierarchical browsing needs in our different types of content: music, podcasts, and radio.

Consequently, we are less dedicated to casual users, which are usually taken care of by our good friend Home, and more dedicated to power users who either know what they are looking for or have needs for catalog-scale tasks.

In that sense, Browse also needs to adapt his music presentation to the users’ current territory since some have a limited music lineup of around 150 channels whereas others (mainly US and Canada), have a much broader lineup of 1000+ music channels.

To account for this in limited music lineup territories, Browse’s top presentation level is genres, with each tile corresponding to one of its lineup genres. On the other hand, he adds a music presentation layer to broader music lineup territories with one tile corresponding to each of the top hierarchy categories: Genre, Activity, Mood, Era, and Theme. Each of these top-level categories has its own tags, and some flows have yet deeper levels until users are presented with a corresponding list of music channels.

As far as podcasts are concerned, Browse is actually the main front door access for most users when they want to see what our app has to offer since there are so many topics and categories in that type of content. Home voluntarily restrains its display to a very limited sample only intended as a reminder that we have podcasts.

Again, Browse needs to adapt his podcasts presentation to the current user since some categories are conditional and personal, only displayed when they are populated, such as Your Podcasts, Your Episodes, New Episodes, Downloaded Episodes, and Continue Listening.

The last content type, featured to the right of Browse’s header/tab pattern, is radio. Radio is the latest addition to our app’s content types and since there are 2 main ways of presenting radio content, by format or by geolocation, the top hierarchy Browse uses are geolocation tiles (Near You and International –with International subdivided in continental regions, countries, country subdivision (state, province, region, county, department etc.) and format tiles (News, Talk, Sports, Public, and Religion).

The format categories mainly display radio stations by popularity and location to make them as relevant as possible to users based on their territory, emulating the geo-localized aspect of real-word radio tuning but users can also discover and tune in to radio stations from all over the world by browsing the International category.

In a nutshell, my brother Browse is there for users who feel like browsing the whole breadth of our music, podcasts, and radio catalog in the easiest structured way possible and I think he does a good job at that. I am very thankful for my brother doing such a great job because it lets me concentrate on my part.

Now let’s talk about what exactly is my part and how I manage to complement my brother’s end of the business.

At first, I look rather inconspicuous with only a single text entry field at the very top of our screen to account for my presence in the app. My brother takes up the rest of the screen estate below, even needing some vertical scrolling in most of his categories.

That is until users who are looking for something specific tap me, so I make the on-screen keyboard appear at the bottom of the screen for them to begin typing query strings in my field.

They can still change their mind and tap me again to dismiss the keyboard, but usually, they start typing and then my magic operates: as soon as they enter a character, I replace the search icon in my text field with a clear icon and I start searching for the character strings they have input so far in our vast catalog of music channels, podcast shows and episodes, and radio stations.

That is when my great metamorphosis takes shape, and my brother Browse tips his hat as he lets me take the whole stage, displaying my search results in all their glory and dedicated swimlane categories.

I display each search result corresponding to the current user input query string as a media card in its corresponding swimlane, either Channels, Artists, Tags, Podcasts, Episodes, or Radio. Each swimlane is only displayed if it is populated by search results in its category and has a More button (same as the swimlanes on Home) for categories that have more search results than can be displayed here. *(The **Tags** swimlane was not drawn on the legacy Figma search-results frame; it is part of the intended product behavior—see Integration notes.)*

Users clicking one of my results swimlane’s More buttons will view a vertically scrolling 2-column (or single column in the case of episode cards) grid layout, similar to Home’s More layout, filled with other search results in the corresponding category.

When users are on a music **Channel Info** screen, the vibe tags shown in the horizontal chip row are the same kind of tag labels I use: tapping a chip is equivalent to typing that tag in my field and opening the **More** view for my **Tags** swimlane—the full 2-column grid of all channels that carry that tag.

Any time users want to go back to my brother, they can **clear** my input field: that brings back Browse with an **empty** field and the **same** content-type tab (**Music**, **Podcasts**, or **Radio**) they had before they started searching, with the right territory tiles for that tab. If instead they **tap the Search icon in the bottom bar** while they are already in our house, or they **leave our house** for another main tab and **come back via that same Search icon**, we open on **Music** with an empty field and my brother’s music tiles for the current territory lineup—so that path always lands on the Music front door, no matter which sibling they were visiting before.

Before saying goodbye, I want to say that our shared header, which I mentioned above, is adaptive to the situation, with both my search field and my brother’s content type tabs when users browse and my search field only when users search.

We’re also using that same pattern our friends Home and More already use for their header and footer chrome where the header is anchored at the top, the footer anchored at the bottom and the main content scrolls behind the chrome, taking the size of the chrome elements into account to calculate the adequate paddings necessary to let users access all of our content.

To conclude, I will say that even if our friend Home has the privilege to be our app’s very first and welcoming contact with our users, our responsibility to cater to users who want to dig deeper into the possibilities we offer as a streaming app is also an immense privilege I am very proud of.

---

## Integration notes (locked decisions)

These bullets complement the story above for **design, product, and engineering**. They record decisions for how Search & Browse **integrates** with the rest of the app.

- **Vibes & tags (internal vocabulary, not necessarily user-facing copy)** — For **broad-lineup** music Browse, the five top-level groupings (**Genre, Activity, Mood, Era, Theme**) are referred to internally as **vibes**. Their subcategories in the browse tree are **tags**. Implementation and CMS-style docs should use **vibe** / **tag**; UI may continue to show the existing customer-facing labels on tiles and chips.
- **Channel Info chips** — The `.music-info__tag` controls on **Channel Info** show **vibe tags** associated with that channel (same tag strings Search matches against for the **Tags** swimlane).
- **Browse vs search mode** — As soon as the user enters **any** character in the search field, **search results replace the entire Browse UI**, including the **Music / Podcasts / Radio content-type tabs**. Result swimlanes (**Channels, Artists, Tags, Podcasts, Episodes, Radio**) are **not** the same taxonomy as those tabs. **Do not** filter search results by whichever Browse tab was active before typing.
- **Tags swimlane (spec gap)** — Legacy Figma **Search results** (`61:26534`) does **not** show a **Tags** lane; product intent **does**. Populate a **Tags** swimlane when the query matches vibe **tag** labels tied to music channels; **More** leads to a 2-column channel grid (same pattern as Home **More** / **`SwimlaneMore`**). Prototype route: **`/search/more/tags?q=`** (encoded tag label).
- **Tag tap from Channel Info** — Tapping a `.music-info__tag` must behave like: user typed that tag string into Search, then tapped **More** on the **Tags** swimlane — i.e. navigate to **`/search/more/tags?q=…`** (see `SearchTagsMore.jsx`).
- **Artists lane** — Include an **Artists** swimlane in search results so users can search by **artist name** for music discovery, even though the app does **not** feature artist categories in Browse elsewhere.
- **Reset to Browse** — Behavior depends on **how** the user exits search mode:
  - **Clear** — **Empty** search field, **Browse** visible (tabs back), **preserve** the active **Music / Podcasts / Radio** tab and its browse body; only the search query (**`?q=`** on the Search tab URL) is cleared.
  - **Bottom-nav Search** (**re-tap** while already somewhere under Search, or **return** from Home / Info via Search) — **`NavLink`** target is **`/search/music`**, so users land on **Music** with an **empty** field and music browse tiles for the current territory (same as **Coming back** from another main tab). This is **intentionally** not the same as Clear when the user had **Podcasts** or **Radio** selected: the bottom bar is the **global** entry point to the Search tab **on Music**.
- **Adaptive header height** — Top chrome **always shrinks** to **vertically hug** its content (tabs + field in browse mode; **field only** in search mode). **Scroll padding** must be **recalculated** when the mode or measured header height changes, consistent with the Home / More pattern (fixed header, scrolling body).
- **Keyboard vs footer** — When the on-screen keyboard is open, it **overlaps** the **bottom chrome** (miniplayer, visual ads if any, bottom nav). Do not assume the footer lifts above the keyboard for this prototype.
- **Radio Browse** — Implement the **full** story: geolocation tiles (**Near You**, **International** with continent → country → subdivisions → cities as needed) **and** format tiles (**News, Talk, Sports, Public, Religion**). Do **not** use the older “flat International list only” shortcut as the target UX for this screen.
- **Chrome vs Home** — Search & Browse uses **minimal top chrome**: **no** Home-style **Upgrade** CTA, **no** provider logo, **no** centered brand lockup in this tab’s header area (unless product revisits this later).
- **URL / routing** — **Browse** content-type strip uses **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** ( **`/search`** redirects to **`/search/music`** ) so history and **Back** preserve the active browse tab. While the user has a **live search** (non-empty query), the same routes carry **`?q=`** (debounced, **replace**) so **Back** from **More** grids and media detail returns to **populated** results; **BottomNav Search** uses path-only **`/search/music`**, which drops **`q`** and resets to **Music** browse.
