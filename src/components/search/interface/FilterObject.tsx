/**
 * A list of filter items that discover page will need
 */
export default interface FilterObject {
	index_year: {
		[key: string]: { number: number; checked: boolean };
	};
	spatial_coverage: {
		[key: string]: { number: number; checked: boolean };
	};
	resource_class: {
		[key: string]: { number: number; checked: boolean };
	};
	resource_type: {
		[key: string]: { number: number; checked: boolean };
	};
	format: {
		[key: string]: { number: number; checked: boolean };
	};
	subject: {
		[key: string]: { number: number; checked: boolean };
	};
	theme: {
		[key: string]: { number: number; checked: boolean };
	};
	creator: {
		[key: string]: { number: number; checked: boolean };
	};
	publisher: {
		[key: string]: { number: number; checked: boolean };
	};
	provider: {
		[key: string]: { number: number; checked: boolean };
	};
	spatial_resolution: {
		[key: string]: { number: number; checked: boolean };
	};
	methods_variables: {
		[key: string]: { number: number; checked: boolean };
	};
	data_variables: {
		[key: string]: { number: number; checked: boolean };
	};
}