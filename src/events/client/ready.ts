import { EventBuilder } from 'discord';

export default new EventBuilder('ready', true).setCallback(client => {
	client.logger.info(`Logged in as ${client.user?.tag}!`);
});
