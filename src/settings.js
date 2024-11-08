export const settingsKey = "check-door";

function reloadGM() {
	if (game.user.isGM) delayedReload();
}

function delayedReload() {
	window.setTimeout(() => location.reload(), 500);
}

export function registerSettings() {
	game.settings.register(settingsKey, "dataVersion", {
		scope: "world",
		config: false,
		type: String,
		default: "fresh install",
	});
	game.settings.register(settingsKey, "highlightSecretDoors", {
		name: "check-door.settings.highlightSecretDoors.name",
		hint: "check-door.settings.highlightSecretDoors.hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: false,
		onChange: reloadGM,
	});
	game.settings.register(settingsKey, "lockedDoorAlert", {
		name: "check-door.settings.lockedDoorAlert.name",
		hint: "check-door.settings.lockedDoorAlert.hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});
	game.settings.register(settingsKey, "unlockedDoorAlert", {
		name: "check-door.settings.unlockedDoorAlert.name",
		hint: "check-door.settings.unlockedDoorAlert.hint",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
	});
}
