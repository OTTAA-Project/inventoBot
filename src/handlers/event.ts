import { readdirSync } from 'fs';
import { join } from 'path';
import type { ExtendedClient, EventBuilder } from '../discord';

export async function eventHandler(client: ExtendedClient) {
	const commandCategories = readdirSync(join(__dirname, '..', 'events'));

	for (const category of commandCategories) {
		const commands = readdirSync(join(__dirname, '..', 'events', category)).filter(file =>
			file.endsWith('.ts')
		);

		for (const file of commands) {
			const { default: cmd }: { default: EventBuilder<any> } = await import(
				join(__dirname, '..', 'events', category, file)
			);

      console.log("Registering event", cmd.name);

			if (cmd.once) {
				client.once(cmd.name, (...args) => {
					cmd.callback(client, ...args);
				});
			} else {
				client.on(cmd.name, (...args) => {
					cmd.callback(client, ...args);
				});
			}
		}
	}
}
