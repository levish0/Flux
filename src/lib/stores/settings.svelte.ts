const SETTINGS_KEY = 'flux-settings';

interface Settings {
	jsonIndent: number;
	uuidCount: number;
	uuidUppercase: boolean;
}

const defaults: Settings = {
	jsonIndent: 2,
	uuidCount: 1,
	uuidUppercase: false
};

function loadSettings(): Settings {
	if (typeof localStorage === 'undefined') return { ...defaults };
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		if (!raw) return { ...defaults };
		return { ...defaults, ...JSON.parse(raw) };
	} catch {
		return { ...defaults };
	}
}

function saveSettings(settings: Settings): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

class SettingsStore {
	#settings = $state<Settings>(loadSettings());

	get jsonIndent() {
		return this.#settings.jsonIndent;
	}
	set jsonIndent(v: number) {
		this.#settings.jsonIndent = v;
		saveSettings(this.#settings);
	}

	get uuidCount() {
		return this.#settings.uuidCount;
	}
	set uuidCount(v: number) {
		this.#settings.uuidCount = v;
		saveSettings(this.#settings);
	}

	get uuidUppercase() {
		return this.#settings.uuidUppercase;
	}
	set uuidUppercase(v: boolean) {
		this.#settings.uuidUppercase = v;
		saveSettings(this.#settings);
	}
}

export const settings = new SettingsStore();
