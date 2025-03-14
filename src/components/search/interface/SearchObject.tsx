/**
 * Define the search object that will be used to conduct query.
 * For now, only requires user input field and make optional fields as defined in http://52.14.175.140:3000/
 */
export interface SearchObject {
  userInput: string;
  year?: string;
  place?: string;
  resource_class?: string;
  resource_type?: string;
  format?: string;
  subject?: string;
  theme?: string;
  creator?: string;
  publisher?: string;
  provider?: string;
  spatial_resolution?: string;
  methods_variables?: string;
  data_variables?: string;
}
