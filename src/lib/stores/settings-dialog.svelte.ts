let open = $state(false);

export const settingsDialog = {
	get open() {
		return open;
	},
	set open(v: boolean) {
		open = v;
	},
	toggle() {
		open = !open;
	},
};
