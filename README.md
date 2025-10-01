# TNHScoreBreakdown

Custom overlay for [H3Status](https://github.com/TakingFire/H3Status/tree/main)

- Displays a breakdown of the score for Take & Hold upon run completion

- Plays a sound when the stealth or hitless bonus is lost

- Maintains the features from the base TNHScoreLog

## Setup

In OBS, set up a Browser Source with Local file unchecked and `quilavad.github.io/scoreBreakdown.html` as the Local file.

Set the Width and Height to the size of the Video Output Resolution.

### Alternative Download Setup

Alternatively, you can download a copy for modding or offline use.

Download and extract the files for [H3Status](https://github.com/TakingFire/H3Status/tree/main) if you don't already have them. They can be placed anywhere.

Download and extract these files as well, placing the folder into the `Overlays` folder in the H3Status files.

Your file structure should look something like this: <br>
`H3Status/` <br>
`├─ Overlays/` <br>
`│  ├─ TNHScoreLog/` <br>
`│  ├─ TNHScoreBreakdown/` <br>
`│  │  ├─ scoreBreakdown.html`

In OBS, instead set up the Browser Source with Local file set and `scoreBreakdown.html` as the Local file.

## Usage

Clicking anywhere on the page toggles the visibility of the breakdown. This can be done in OBS by selecting the Browser Source, clicking Interact, then clicking near the center the popup.

## Configuring

This overlay has its own `config.js` file seperate from `TNHScoreLog`'s, with all the same options in addition to some new ones.
The score breakdown can configured to be hidden or visible at the start of a run. By default, it starts hidden.
Custom hold names can be set for levels without official names.
The stealth and hitless bonus lost alert sounds can also be customized.