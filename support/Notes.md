
# Cartographer

A map making tool, aimed at role-players with a web interface and probably a tablet app. I was looking for something at the weekend and they were mostly bloody awful. The only good looking one I could find was [InKarnate](http://inkarnate.com/) which seems to have stalled after its Kickstarter failed.

What I'm thinking of initially is something like Balsamiq but for maps. i.e. really easy to use, slick interface. Simple to extend with new components.

It'd need to handle different map 'levels' i.e. world map, city map, castle map, dungeon map. I'd be happy with a low-fi black and white (i.e. a lot like Balsamiq does it) map but I think we'd want to add themes (e.g. fantasy, sci-fi) to make the maps look pretty, as well as functional, possibly even custom themes (waaay in the future).

Potential markets: b2c role players, LARPers, other gamers who want to make maps for scenarios. b2b board game makers, video game makers, authors, publishers (this is where custom themes come in).

Kickstarter?

Needs a code name.

# Features

Basic features available to every instance

- Select / change theme
- Draw simple elements
- Draw complex elements (draw area, fill with features, e.g. mountains)
- Edit and delete elements
- Zoom and pan
- Add text labels (font based on theme)
- Add legend
- Save as image file

Bolt ons

- Different theme packs

Advanced features

- Create projects containing many maps
- Link maps (land map -> click on city -> opens city map)
- View mode
- Export map as SVG
- Custom themes

Cartographer:

1. draw an area with the polygon tool,
2. fill the space with objects by spiralling inwards from the first drawn point
3. adjust density with a slider
4. redraw objects
5. individual objects can be deleted

# Architecture

## Drawing area

- show / hide grid
- navigation / pan (tool?)
- zoom (tool?)
- delete (tool?)
- draw menus
- layers

## Tools

- draw in toolbar
- activate / deactivate
- draw to map
- edit existing feature
- display supplementary windows
- handle events
    - activate / deactivate the tool itself (button press)
    - mouse / touch events while drawing
    - activate appropriate tool to edit an item

Tools come in a few different varieties:

- Point and click, drop a marker
- Draw a path (e.g. road, wall)
- Brush a path (e.g. draw in the sea, could do fill?)
- Fill a path, freehand draw an area, fill with objects (e.g. trees, mountain ranges)

pseudo code

1. activate tool
2. mouse events -> pass to current tool
3. draw -> request symbol from current theme
4. new tool selected -> clean up
5. go to 1

## Themes

Allow different themes to be created which change colour scheme, background image etc (styling rather than hard coded colours)

## Download

Should be able to download map as a PNG. Should be able to download at different zoom levels and be shown (preview mode?) the map at different sizes.

## Save, Import and Export

Some sort of vector / illustrator / xml format for export? Whatever paper js uses, I guess.

Not sure about import... May need a custom format specific to the tool. XML? JSON? Both? SVG?

Probably needs a custom JSON / XML format which can be dropped into a database as a string.

Mobile app will need to sync to Dropbox or similar systems.

# Business

How will accounts work? Probably something like Balsamiq, with free usage and save to PNG but no storing of the map. So if people want to edit, they can't (or possibly only allow one map at a time, using offline mode).

Having an account allows saving and editing multiple maps. What levels of account? What about mobile / tablet apps? Free to download then charge for saving more maps? The online version will need some sort of account, but the tablet version won't. Which implies that the mobile version should be charged for.

Research payment approach used by existing apps.

Number of themes or available tools could be good price for differentiating price, especially in the mobile app. e.g. automatically have Fantasy and Sci-Fi map themes available, theme packs are then sold for more money.

## Levels

- Free online without an account, can only save one map, can clear it and start afresh
- Paid online account, with multiple maps
    - £5 per month ongoing
    - £5 for 30 days usage, reactivate account still has old maps
- Paid tablet / phone app, with multiple maps
- Publisher level, with custom themes, multi-map projects, export options etc.
    - £10 per month ongoing

## Questionnaire

1. Do you know of any good cartography apps? Specifically either web based or for a tablet.
2. Is it something that would be of use to you?
3. What kind of features would you look for in a cartography app?
4. Would you consider funding a kickstarter for a cartography app?
5. If one was available would you consider paying £5 / £10 / £20 for it?

Speak to Frankie, Ger, Mark, Orev (and the relevant groups)


