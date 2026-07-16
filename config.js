const globalConfig = {
  webSocketAddress: "localhost",
  webSocketPort: 9504,
  overlayScale: 1,

  showScorePanel: true,

  showEventLog: true,
  showScoreCounter: true,
  showHealth: true,
  showLevelBar: true,
  showPhaseBar: true,

  eventLogLength: 6, // How many items can appear in the log
  eventLogLifeTime: 4, // How long items will stay in the log (seconds)
  eventLogDelay: 0.1, // Pause between adding items to the log (seconds)
  pauseEventLog: false, // Pause log instead of overflowing
  scoreCounterDigits: 7,

  showAmmoPanel: true,

  showWeaponName: true,
  showAmmoCounter: true,
  
  scoreBreakdownStartHidden: true,
};

const customHoldNames = {"TakeAndHoldClassic": ["RED HALL", "ORANGE MEZZANINE", "GOLD CELLAR", "GREEN PLATFORMS", "TEAL SQUARE", "CYAN STAIRS", "INDIGO PILLARS", "PURPLE STAIRS", "BLUE HALLWAY", "YELLOW HALLWAY", "T HALLWAY", "J HALLWAY", "L HALLWAY"],
"TakeAndHold_WinterWasteland" : ["DEPOT", "SNIPER TOWER", "BASE", "ROCKS", "CHECKPOINT", "BARRACKS", "HANGER", "OUTLOOK", "SHIPMENT", "SILO", "RIDGE", "AIRFIELD", "PLATEAU", "HIGH GROUND", "ARTILLERY", "FORT", "ENCAMPMENT", "SPINE", "PINNED", "STATION", "L LOOKOUT", "SHELTER", "BRIDGES", "RUINS", "KING OF THE HILL", "HELIPORT", "BOWL", "STRONGHOLD", "OLD TOWN", "SPIRAL ", "DEFENCES", "TUNNEL EXIT"]};
customHoldNames["TakeAndHoldDark"] = customHoldNames["TakeAndHoldClassic"];

const sounds = {};
sounds["stealth_lost"] = new Audio("sounds/stealth_lost.mp3");
sounds["stealth_lost"].volume = .3;
sounds["hitless_lost"] = new Audio("sounds/hitless_lost.mp3");
sounds["hitless_lost"].volume = .1;