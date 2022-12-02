import { CommandBuilder } from 'discord';
import { InventoryItemModel } from 'entities';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { convertToExcel } from '../../common/excel';

function slugify(text: string) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/\-\-+/g, '-');
}

export default new CommandBuilder()
	.setName('inventory')
	.setNameLocalization('es-ES', 'inventario')
	.setDescription('See ottaa inventory')
	.setDescriptionLocalization('es-ES', 'Ver el inventario de ottaa')
	.addSubcommand(sub => {
		return sub
			.setName('view')
			.setNameLocalization('es-ES', 'ver')
			.setDescription('View your inventory')
			.setDescriptionLocalization('es-ES', 'Ver tu inventario');
	})
	.addSubcommand(sub => {
		return sub
			.setName('add')
			.setNameLocalization('es-ES', 'añadir')
			.setDescription('Add an item to your inventory')
			.setDescriptionLocalization('es-ES', 'Añade un objeto a tu inventario')
			.addStringOption(option =>
				option
					.setName('name')
					.setNameLocalization('es-ES', 'nombre')
					.setDescription('The name of the item')
					.setDescriptionLocalization('es-ES', 'El nombre del objeto')
					.setRequired(true)
			)
			.addNumberOption(option =>
				option
					.setName('quantity')
					.setNameLocalization('es-ES', 'cantidad')
					.setDescription('The quantity of the item')
					.setDescriptionLocalization('es-ES', 'La cantidad del objeto')
					.setRequired(true)
			);
	})
	.addSubcommand(sub => {
		return sub
			.setName('remove')
			.setNameLocalization('es-ES', 'remover')
			.setDescription('Remove an item from your inventory')
			.setDescriptionLocalization('es-ES', 'Remover un objeto de tu inventario')
			.addStringOption(option => {
				InventoryItemModel.find({
					deleted: false
				}).then(items => {
					option.setChoices(
						...items.map(item => {
							return {
								name: item.name,
								value: item.name
							};
						})
					);
				});

				return option
					.setName('name')
					.setNameLocalization('es-ES', 'nombre')
					.setDescription('The name of the item')
					.setDescriptionLocalization('es-ES', 'El nombre del objeto')

					.setRequired(true);
			});
	})
	.addSubcommand(sub => {
		return sub
			.setName('clear')
			.setNameLocalization('es-ES', 'limpiar')
			.setDescription('Clear your inventory')
			.setDescriptionLocalization('es-ES', 'Limpiar tu inventario');
	})
	.addSubcommand(sub => {
		return sub
			.setName('edit')
			.setNameLocalization('es-ES', 'editar')
			.setDescription('Edit an item from your inventory')
			.setDescriptionLocalization('es-ES', 'Editar un objeto de tu inventario')
			.addStringOption(option => {
				option
					.setName('name')
					.setNameLocalization('es-ES', 'nombre')
					.setDescription('The name of the item')
					.setDescriptionLocalization('es-ES', 'El nombre del objeto')
					.setRequired(true);

				InventoryItemModel.find({
					deleted: false
				}).then(items => {
					option.setChoices(
						...items.map(item => {
							return {
								name: item.name,
								value: item.name
							};
						})
					);
				});

				return option;
			})
			.addNumberOption(option =>
				option
					.setName('quantity')
					.setNameLocalization('es-ES', 'cantidad')
					.setDescription('The quantity of the item')
					.setDescriptionLocalization('es-ES', 'La cantidad del objeto')
					.setRequired(false)
			)
			.addStringOption(option =>
				option
					.setName('newname')
					.setNameLocalization('es-ES', 'nuevonombre')
					.setDescription('The new name of the item')
					.setDescriptionLocalization('es-ES', 'El nuevo nombre del objeto')
					.setRequired(false)
			);
	})
	.addSubcommand(sub => {
		return sub
			.setName('export')
			.setNameLocalization('es-ES', 'exportar')
			.setDescription('Export your inventory')
			.setDescriptionLocalization('es-ES', 'Exporta tu inventario');
	})
	.setCallback(async ({ interaction }) => {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'view': {
				const items = await InventoryItemModel.find({
					deleted: false
				});

				const embed = new EmbedBuilder()
					.setTitle('Control Inventario Del ' + new Date().toISOString().split('T')[0])
					.setDescription(
						'Esto es lo que tienes en tu inventario. Si quieres añadir o remover algo, usa los comandos `add` y `remove`.'
					)
					.setFields([
						...items.map(item => {
							return {
								name: `${item.name}`,
								value: `${item.quantity} - <@${item.creator}>`,
								inline: true
							};
						})
					])
					.setColor('DarkGreen')
					.setTimestamp(new Date());

				return await interaction.reply({ embeds: [embed] });
			}
			case 'add': {
				const name = interaction.options.getString('name');
				const quantity = interaction.options.getNumber('quantity');

				if (!name || !quantity) return;

				const slugifyItem = slugify(name);

				const item = await InventoryItemModel.findOne({ slug: slugifyItem });

				if (item) {
					item.quantity = quantity;
					item.deleted = false;
					item.creator = interaction.user.id;

					await item.save();
				} else {
					await InventoryItemModel.create({
						creator: interaction.user.id,
						slug: slugifyItem,
						name,
						quantity
					});
				}
				return await interaction.reply(`Added ${quantity} ${name} to your inventory`);
			}
			case 'remove': {
				const name = interaction.options.getString('name');

				if (!name) return;

				const item = await InventoryItemModel.findOne({ name });

				if (item) {
					item.deleted = true;
					item.deletedAt = new Date();
					item.updatedAt = new Date();

					await item.save();
				} else {
					return await interaction.reply(`No se encontró ${name} en el inventario`);
				}
				return await interaction.reply(`Removed ${name} from your inventory`);
			}
			case 'clear': {
				const items = await InventoryItemModel.find({
					deleted: false
				});

				for (const item of items) {
					item.deleted = true;
					item.deletedAt = new Date();

					await item.save();
				}

				return await interaction.reply(`Cleared ${items.length} items from your inventory`);
			}
			case 'edit': {
				const name = interaction.options.getString('name');
				const quantity = interaction.options.getNumber('quantity');
				const newName = interaction.options.getString('newname');

				if (!name) return;

				const item = await InventoryItemModel.findOne({ name });

				if (item) {
					if (quantity) item.quantity = quantity;
					if (newName) item.name = newName;

					await item.save();
				} else {
					return await interaction.reply(`No se encontró ${name} en el inventario`);
				}
				return await interaction.reply(`Edited ${name} from your inventory`);
			}
			case 'export': {
				const items = await InventoryItemModel.find({
					deleted: false
				});
				return await interaction.reply({
					files: [
						{
							attachment: convertToExcel(
								items.map(({ name, quantity, createdAt }) => ({
									nombre: name,
									cantidad: quantity,
									['creado el']: createdAt.toISOString().split('T')[0]!.split('-').reverse().join('/')
								}))
							),
							name: 'inventory.xlsx'
						}
					]
				});
			}

			default:
				return;
		}
	});
