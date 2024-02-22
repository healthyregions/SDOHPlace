import { Filter } from '@mui/icons-material';

/**
 * A list of filter items that discover page will need
 */
export default interface FilterObject {
	year: {
		[key: string]: number;
	};
	spatial_coverage: {
		[key: string]: number;
	};
	resource_class: {
		[key: string]: number;
	};
	resource_type: {
		[key: string]: number;
	};
	format: {
		[key: string]: number;
	};
	subject: {
		[key: string]: number;
	};
	theme: {
		[key: string]: number;
	};
	creator: {
		[key: string]: number;
	};
	publisher: {
		[key: string]: number;
	};
	provider: {
		[key: string]: number;
	};
	spatial_resolution: {
		[key: string]: number;
	};
	methods_variables: {
		[key: string]: number;
	};
	data_variables: {
		[key: string]: number;
	};
}