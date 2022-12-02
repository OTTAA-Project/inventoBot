import { readdirSync } from 'fs';
import { join } from 'path';
import type { ExtendedClient, CommandBuilder } from '../discord';

export async function commandHandler(client: ExtendedClient) {
	const commandCategories = readdirSync(join(__dirname, '..', 'commands'));

	for (const category of commandCategories) {
		const commands = readdirSync(join(__dirname, '..', 'commands', category)).filter(file =>
			file.endsWith('.ts')
		);

		for (const file of commands) {
			const { default: cmd }: { default: CommandBuilder } = await import(
				join(__dirname, '..', 'commands', category, file)
			);

      console.info("Registering command", cmd.name);

			client.commands.set(cmd.name, cmd);
		}
	}

	client.once('ready', () => {
		client.application.commands.set(client.commands.map(cmd => cmd.toJSON()));
	});
}
