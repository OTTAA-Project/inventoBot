import { EventBuilder } from 'discord';
import { ChannelType } from 'discord.js';

export default new EventBuilder('interactionCreate').setCallback(
	async (client, interaction) => {

		console.log("Received interaction");

		if (!interaction.isChatInputCommand()) return;

		console.log("Checking for command");

		if (interaction.channel && interaction.channel.type == ChannelType.DM) {
			return interaction.reply({
				content: 'No puedes usar comandos en el MD',
				ephemeral: true
			});
		}

		if (!interaction.inCachedGuild()) {
			await interaction.guild?.fetch();
			return interaction.reply({
				content: 'Guardando el servidor en cache...',
				ephemeral: true
			});
		}

		console.log("Executing command");

		const { commandName } = interaction;

		const command = client.commands.get(commandName);

		if (!command) {
			return interaction.reply({
				content: 'No se encontró el comando',
				ephemeral: true
			});
		}

		return command.callback({ client, interaction });
	}
);
