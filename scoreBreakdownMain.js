const sounds = {};
sounds["stealth_lost"] = new Audio("sounds/stealth_lost.mp3");
sounds["stealth_lost"].volume = .3;
sounds["hitless_lost"] = new Audio("sounds/hitless_lost.mp3");
sounds["hitless_lost"].volume = .1;

// @override
function onMessage(e) {
	OLD_onMessage(e);
	const event = JSON.parse(e.data);
	switch (event.type || event.event) {
	case "TNHLostStealthBonus":
		sounds["stealth_lost"].play();
		break;
	case "TNHLostNoHitBonus":
		sounds["hitless_lost"].play();
		break;
	}
}
ws.onmessage = onMessage;

const killCategories = ["KILL","HEADSHOT","MELEE","NECK SNAP","RIP & TEAR","MULTIKILL","STEALTH KILL"];
const phaseToHeader = {"Take": 1, "Hold": 2, "Analyzing": 3};
const phaseToOutput = {"Take": "TAKE", "Hold": "HOLD", "Analyzing": "WAVE"};
function outputScorePhase(newPhase) {
	if (currentPhase != null) {
		let currentScoreWindow = scoreWindows[holdPhase - 1];
		let header = "<h" + phaseToHeader[currentPhase.phase] + ">" + phaseToOutput[currentPhase.phase] +  " " + (currentPhase.level+1);
		if (currentPhase.phase === "Take" && currentPhase.supplyNames) {
			header += " - " + currentPhase.supplyNames;
		} else if (currentPhase.phase === "Hold" && currentPhase.holdName) {
			header += " - " + currentPhase.holdName;
		}
		header += "</h" + phaseToHeader[currentPhase.phase] + ">";
		currentScoreWindow.innerHTML += header;
		if (currentPhase.phase !== "Hold") {
			let killScore = 0;
			for (category in scoreTracker) {
				if (category.indexOf("LONG SHOT") != -1 && !killCategories.includes(category)) {
					killCategories.push(category);
				}
				if (!killCategories.includes(category)) {
					currentScoreWindow.innerHTML += category + " (" + scoreTracker[category][1] + ") x " + scoreTracker[category][0] + "\n";
				}
				else {
					killScore += scoreTracker[category][0] * scoreTracker[category][1];
				}
			}
			currentScoreWindow.innerHTML += "KILL TOTAL (" + killScore + ")\n";
			for (const category of killCategories) {
				if (category in scoreTracker) {
					currentScoreWindow.innerHTML += "\t" + category + " (" + scoreTracker[category][1] + ") x " + scoreTracker[category][0] + "\n";
				}
			}
		}
		scoreTracker = {};
	}
	currentPhase = newPhase;
	if (newPhase.phase === "Take") {
		holdPhase = newPhase.level + 1;
	}
}

function outputScoreClear() {
	for (let i = 0; i < 5; i++) {
		scoreWindows[i].style.visibility = "hidden";
		scoreWindows[i].innerHTML = "";
	}
	currentPhase = null;
	scoreTracker = {};
}

function outputScoreReveal() {
	for (let i = 0; i < 5; i++) {
		scoreWindows[i].style.visibility = "visible";
	}
}

// @override
function handlePhaseEvent(event) {
	OLD_handlePhaseEvent(event);
	switch (event.phase) {
		case "Take": 
			if (event.level == 0) {
				outputScoreClear();
			}
			//no break by design
		case "Hold": 
			outputScorePhase(event);
			break;
		case "Completed": 
		case "Dead":
			outputScorePhase(event);
			outputScoreReveal();
			break;
	}
}

// @override
function handleHoldPhaseEvent(event) {
	OLD_handleHoldPhaseEvent(event);
	if (event.phase == "Analyzing") {
		outputScorePhase(event);
	}
}

// @override
function handleScoreEvent(event) {
	OLD_handleScoreEvent(event);
	if (scoreTracker.hasOwnProperty(getEventString(event))) {
		scoreTracker[getEventString(event)][0] += 1;
	}
	else {
		scoreTracker[getEventString(event)] = [1,event.value * event.mult];
	}
}

// @override
function getEventString(event) {
  switch (event.type) {
    case "HoldPhaseComplete":
      return "HOLD COMPLETED";
    case "HoldDecisecondsRemaining":
      return `TIME BONUS (${Math.floor(event.value / 10 / 5)}s)`;
    case "HoldWaveCompleteNoDamage":
      return "HITLESS WAVE";
    case "HoldPhaseCompleteNoDamage":
      return "HITLESS HOLD";
    case "HoldKill":
      return "KILL";
    case "HoldHeadshotKill":
      return "HEADSHOT";
    case "HoldMeleeKill":
      return "MELEE";
    case "HoldJointBreak":
      return "NECK SNAP";
    case "HoldJointSever":
      return "RIP & TEAR";
    case "HoldKillDistanceBonus":
      return `LONG SHOT (${25 * Math.round(event.value / 50)}m)`;
    case "HoldKillStreakBonus":
      // return `KILL STREAK (${Math.floor(event.value / 25)})`;
      return "MULTIKILL";
    case "TakeCompleteNoDamage":
      return "HITLESS TAKE";
    case "TakeCompleteNoAlert":
      return "NO ALERT";
    case "TakeHoldPointTakenClean":
      return "HOLD CLEAR NO ALERT";
    case "TakeKillGuardUnaware":
      return "STEALTH KILL";
    default:
      console.log(event);
      return "UNKNOWN";
  }
}

const OLD_getAmmoIcon = AmmoCounter.getAmmoIcon;
// @override
AmmoCounter.getAmmoIcon = function(roundType, roundClass, spent) {
	return "../TNHScoreLog/" + OLD_getAmmoIcon(roundType, roundClass, spent);
}

let scoreTracker = {};
const scoreWindows = [];
for (let i = 0; i < 5; i++) {
	scoreWindows[i] = document.getElementById("score-window-"+(i+1));
}
let holdPhase = 0;
let currentPhase = null;