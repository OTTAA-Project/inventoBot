import type { ClientEvents } from 'discord.js';
import type { ExtendedClient } from 'discord';

export class EventBuilder<T extends keyof ClientEvents> {
	public constructor(public name: T, public once?: true) {}

	public callback!: EventCallback<T>;

	public setCallback(event: EventCallback<T>) {
		this.callback = event;
		return this;
	}
}

type EventCallback<T extends keyof ClientEvents> = (
	client: ExtendedClient,
	...args: ClientEvents[T]
) => any;
