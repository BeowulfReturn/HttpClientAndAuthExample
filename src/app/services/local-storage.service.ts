import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
	private storage = window.localStorage;

	constructor() {
		// window.addEventListener('storage', this.onStorageEvent, false);
	}

	// onStorageEvent(storageEvent: StorageEvent) {
	// 	// StorageEvent {
	// 	// 	key;          // name of the property set, changed etc.
	// 	// 	oldValue;     // old value of property before change
	// 	// 	newValue;     // new value of property after change
	// 	// 	url;          // url of page that made the change
	// 	// 	storageArea;  // localStorage or sessionStorage,
	// 	// 				  // depending on where the change happened.
	// 	// }
	// 	alert('storage event');
	// }

	async get(key: string) {
		return await this.storage.getItem(key);
	}

	async set(key: string, value: any) {
		return await this.storage.setItem(key, value);
	}

	async remove(key: string) {
		return await this.storage.removeItem(key);
	}
}
