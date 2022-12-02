import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder
} from '@discordjs/builders';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { ExtendedClient } from './Client';

export class CommandBuilder extends SlashCommandBuilder {
	public callback!: VoidCallback;

	public setCallback(fn: VoidCallback) {
		this.callback = fn;
		return this;
	}

	public override addSubcommand(
		subcommand:
			| SlashCommandSubcommandBuilder
			| ((subCommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)
	): this {
		if (Array.isArray(subcommand)) {
			for (const sub of subcommand) {
				super.addSubcommand(sub);
			}
		} else {
			super.addSubcommand(subcommand);
		}
		return this;
	}

	public override addSubcommandGroup(
		subcommandGroup:
			| SlashCommandSubcommandGroupBuilder
			| ((
					subcommandGroup: SlashCommandSubcommandGroupBuilder
			  ) => SlashCommandSubcommandGroupBuilder)
	): this {
		if (Array.isArray(subcommandGroup)) {
			for (const sub of subcommandGroup) {
				super.addSubcommandGroup(sub);
			}
		} else {
			super.addSubcommandGroup(subcommandGroup);
		}
		return this;
	}
}

type VoidCallback = (params: {
	interaction: ChatInputCommandInteraction<'cached'>;
	client: ExtendedClient;
}) => void;
