const stealthLossSound = new Audio('sounds/stealth_lost.mp3');
stealthLossSound.volume = .3;
const hitlessLossSound = new Audio('sounds/hitless_lost.mp3');
hitlessLossSound.volume = .1;

// @override
function onMessage(e) {
	OLD_onMessage(e);
	switch (event.type || event.event) {
	case "TNHLostStealthBonus":
		stealthLossSound.play();
		break;
	case "TNHLostNoHitBonus":
		hitlessLossSound.play();
		break;
	}
}

const killCategories = ["KILL","HEADSHOT","MELEE","NECK SNAP","RIP & TEAR","MULTIKILL","STEALTH KILL"];
function outputScorePhase(newPhaseType, newPhaseValue) {
	if (phaseName[0] !== "START") {
		var headerNum = 1;
		switch (phaseName[0]) {
			case "TAKE":
				headerNum = 1;
				break;
			case "HOLD":
				headerNum = 2;
				break;
			case "WAVE":
				headerNum = 3;
				break;
		}
		scoreWindows[scoreWindowIndex].innerHTML += "<h" + headerNum + ">" + phaseName[0] +  " " + phaseName[1] + "</h" + headerNum + ">";
		if (phaseName[0] !== "HOLD") {
			var killScore = 0
			for (category in scoreTracker) {
				if (category.indexOf("LONG SHOT") != -1 && !killCategories.includes(category)) {
					killCategories.push(category);
				}
				if (!killCategories.includes(category)) {
					scoreWindows[scoreWindowIndex].innerHTML += category + " (" + scoreTracker[category][1] + ") x " + scoreTracker[category][0] + "\n";
				}
				else {
					killScore += scoreTracker[category][0] * scoreTracker[category][1];
				}
			}
			scoreWindows[scoreWindowIndex].innerHTML += "KILL TOTAL (" + killScore + ")\n";
			for (const category of killCategories) {
				if (category in scoreTracker) {
					scoreWindows[scoreWindowIndex].innerHTML += "\t" + category + " (" + scoreTracker[category][1] + ") x " + scoreTracker[category][0] + "\n";
				}
			}
		}
		scoreTracker = {};
	}
	phaseName = [newPhaseType, newPhaseValue];
	if (newPhaseType === "TAKE") {
		scoreWindowIndex = newPhaseValue - 1;
	}
}

function outputScoreClear() {
	for (let i = 0; i < 5; i++) {
		scoreWindows[i].style.visibility = "hidden";
		scoreWindows[i].innerHTML = "";
	}
	phaseName = ["START", 0]
	scoreTracker = {}
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
		case "Take": {
			if (event.level > 0) {
			} else {
				outputScoreClear();
			}
			if (event.holdName) {
				outputScorePhase("TAKE", event.level+1);
			}
		}
		case "Hold": {
			outputScorePhase("HOLD", event.level+1);
			break;
		}
		case "Completed": {
			outputScorePhase("COMPLETE",0);
			outputScoreReveal();
			break;
		}
		case "Dead": {
			outputScorePhase("DEAD",0);
			outputScoreReveal();
			break;
			}
		}
}

// @override
function handleHoldPhaseEvent(event) {
	OLD_handleHoldPhaseEvent(event);
	if (event.phase == "Analyzing") {
		phaseBar.setColor(currentHoldPhaseIndex, "#fc0");
		outputScorePhase("WAVE", event.level+1);
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

var scoreTracker = {};
const scoreWindows = [];
for (let i = 0; i < 5; i++) {
	scoreWindows[i] = document.getElementById("score-window-"+(i+1));
}
var scoreWindowIndex = 0;
var phaseName = ["START",0];

