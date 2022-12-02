import XLSX from 'xlsx';
export const convertToExcel = (data: any) => {
	const wb = XLSX.utils.book_new();
	const ws = XLSX.utils.json_to_sheet(data, {
		cellDates: true,
		dateNF: 'dd-mm-yyyy',
		cellStyles: true,
    header: ['nombre', 'cantidad', 'creado el']
	});
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

	const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
	return buffer;
};
