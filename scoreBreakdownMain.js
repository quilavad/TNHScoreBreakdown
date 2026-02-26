/* // @override
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
ws.onmessage = onMessage;*/

// @override
function handleSceneEvent(event) {
	OLD_handleSceneEvent(event);
	sceneName = event.name;
	outputScoreClear();
}

// @override
function handlePhaseEvent(event) {
	OLD_handlePhaseEvent(event);
	switch (event.phase) {
		case "Take": 
			/*if (event.level == 0) {
				outputScoreClear();
			}*/
			//no break by design
		case "Hold": 
			if (currentPhase === "Take") {
				setTimeout(() => {
					outputScorePhase(event);
				}, 1000);
			} else {
				outputScorePhase(event);
			}
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
	if (currentPhase.phase === "Take" && !firstGuardKilled && getEventString(event) === "KILL") {
		sounds["stealth_lost"].play();
		firstGuardKilled = true;
	}
}

// @override
/*function getEventString(event) {
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
	case "":
		return "
    default:
      console.log(event);
      return "UNKNOWN";
  }
}*/

const OLD_getAmmoIcon = AmmoCounter.getAmmoIcon;
// @override
AmmoCounter.getAmmoIcon = function(roundType, roundClass, spent) {
	return "../TNHScoreLog/" + OLD_getAmmoIcon(roundType, roundClass, spent);
}

const killCategories = ["KILL","HEADSHOT","MELEE","NECK SNAP","RIP & TEAR","MULTIKILL","STEALTH KILL"];
const phaseToHeader = {"Take": 1, "Hold": 2, "Analyzing": 3};
const phaseToOutput = {"Take": "TAKE", "Hold": "HOLD", "Analyzing": "WAVE"};

function outputScorePhase(newPhase) {
	if (currentPhase != null) {
		let currentScoreWindow = scoreWindows[holdPhase - 1];
		let header = "<h" + phaseToHeader[currentPhase.phase] + ">" + phaseToOutput[currentPhase.phase] +  " " + (currentPhase.level+1);
		
		switch (currentPhase.phase) {
			case "Take":
				if (currentPhase.supplyNames) {
					header += " - " + currentPhase.supplyNames;
				} else {
					header += " - SUPPLY " + currentPhase.supply.join(", ");
				}
				break;
			case "Hold":
				if (currentPhase.holdName) {
					header += " - " + currentPhase.holdName;
				} else if (sceneName in customHoldNames) {
					header += " - " + customHoldNames[sceneName][currentPhase.hold];
				}
				break;
			case "Analyzing":
				header += " - " + currentPhase.encryptionType.toUpperCase() + " x " + currentPhase.encryptionCount;
				break;
		}
		header += "</h" + phaseToHeader[currentPhase.phase] + ">";
		currentScoreWindow.innerHTML += header;
		
		if (currentPhase.phase !== "Hold") {
			let killScore = 0;
			for (category in scoreTracker) {
				/*if (category.substring(0,9) === "LONG SHOT" && !killCategories.includes(category)) {
					killCategories.push(category);
				}*/
				if (!killCategories.includes(category)) {
					currentScoreWindow.innerHTML += category + " (" + scoreTracker[category][1] + ")";
					if (scoreTracker[category][0] != 1) {
						currentScoreWindow.innerHTML += " x " + scoreTracker[category][0];
					}
					currentScoreWindow.innerHTML += "\n";
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
		firstGuardKilled = false;
	}
}

function outputScoreClear() {
	if (globalConfig.scoreBreakdownStartHidden)
		outputScoreHide();
	else
		outputScoreReveal();
	for (let i = 0; i < 5; i++) {
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

function outputScoreHide() {
	for (let i = 0; i < 5; i++) {
		scoreWindows[i].style.visibility = "hidden";
	}
}

let scoreTracker = {};
const scoreWindows = [];
for (let i = 0; i < 5; i++) {
	scoreWindows[i] = document.getElementById("score-window-"+(i+1));
	if (globalConfig.scoreBreakdownStartHidden) {
		scoreWindows[i].style.visibility = "hidden";
	}
}
let holdPhase = 1;
let currentPhase = null;
let sceneName = null;
let firstGuardKilled = false;

document.querySelector("body").addEventListener("click", () => {
	if (scoreWindows[0].style.visibility === "hidden")
		outputScoreReveal();
	else
		outputScoreHide();
});