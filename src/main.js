"use strict";

import { libWrapper } from "../lib/libwrapper_shim.js";
import * as LockedDoorAlert from "./features/locked_door_alert.js";
import * as UnlockedDoorAlert from "./features/unlocked_door_alert.js";

import { performMigrations } from "./migration.js";
import { registerKeybindings } from "./keybindings.js";
import { registerSettings, settingsKey } from "./settings.js";

Hooks.once("init", () => {
	registerSettings();
	registerKeybindings();

	hookDoorEvents();
	hookWallConfigUpdate();
	hookDoorControlDraw();
	DoorControlIconScale.hookDoorControlReposition();
});

Hooks.once("ready", () => {
	performMigrations();
});

Hooks.on("renderChatMessage", LockedDoorAlert.onRenderChatMessage);
Hooks.on("renderChatMessage", UnlockedDoorAlert.onRenderChatMessage);

// Hook the update function of the WallConfig dialog so we can store our custom data
// function hookWallConfigUpdate() {
// 	// Replace the original function with our custom one
// 	libWrapper.register(
// 		"check-doors",
// 		"WallConfig.prototype._updateObject",
// 		async function (wrapped, event, formData) {
// 			await wrapped(event, formData);
// 			return SynchronizedDoors.onWallConfigUpdate.call(this, event, formData);
// 		},
// 		"WRAPPER",
// 	);
// }

// function hookDoorControlDraw() {
// 	libWrapper.register(
// 		"check-doors",
// 		"DoorControl.prototype.draw",
// 		async function (wrapped) {
// 			const result = await wrapped();
// 			DoorControlIconScale.onDoorControlPostDraw.call(this);
// 			return result;
// 		},
// 		"WRAPPER",
// 	);
// }

// Hook mouse events on DoorControls to perform our logic.
// If we successfully handled the event block the original handler. Forward the event otherwise.
function hookDoorEvents() {
	// Replace the original mousedown handler with our custom one
	libWrapper.register(
		"check-doors",
		"DoorControl.prototype._onMouseDown",
		function (wrapped, event) {
			// Call our handler first. Only allow the original handler to run if our handler returns true
			const eventHandled = onDoorMouseDown.call(this, event);
			if (eventHandled) return;
			return wrapped(event);
		},
		"MIXED",
	);

	// Replace the original rightdown handler with our custom one
	libWrapper.register(
		"check-doors",
		"DoorControl.prototype._onRightDown",
		function (wrapped, event) {
			// Call our handler first. Only allow the original handler to run if our handler returns true
			const eventHandled = onDoorRightDown.call(this, event);
			if (eventHandled) return;
			return wrapped(event);
		},
		"MIXED",
	);
}

// Our custom handler for mousedown events on doors
function onDoorMouseDown(event) {
	// If the user doesn't have the "door" permission we don't do anything.
	if (!game.user.can("WALL_DOORS")) return false;
	// If the game is paused don't do anything if the current player isn't the gm
	if (game.paused && !game.user.isGM) return false;

	// if (ToggleSecretDoor.onDoorLeftClick.call(this, event)) return true;

	if (LockedDoorAlert.onDoorLeftClick.call(this)) return true;

	// if (SynchronizedDoors.onDoorLeftClick.call(this)) return true;

	return false;
}

// Our custom handler for rightdown events on doors
function onDoorRightDown(event) {
	if (UnlockedDoorAlert.onDoorRightClick.call(this)) return true;

	return false;
}
