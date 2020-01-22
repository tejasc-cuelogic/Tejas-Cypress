import { FormHelper } from '../../helper';


export const CONTACT_META = FormHelper.generateMeta([
    ['firstName', 'First Name', '', 'required', 'First Name'],
    ['lastName', 'Last Name', '', 'required', 'Last Name'],
    ['businessName', 'Business Name', '', 'required', 'Business Name'],
    ['industry', 'Industry', '', 'optional', 'Industry'],
    ['currentlyOperating', 'Where are you currently operating?', '', 'optional', 'Where are you currently operating?'],
    ['webURL', 'Website URL', '', 'optional', 'Website URL'],
    ['phone', 'Phone Number', '', 'required', '123-456-7891'],
    ['emailAddress', 'Email', '', 'required|email', 'Email'],
    ['question', 'How can we help?', '', 'required', 'How can we help?'],
]);

export const CURRENT_OPERATIONS = [
    { key: 'sk', text: 'Shared kitchen', value: 'Shared kitchen' },
    { key: 'h', text: 'Home', value: 'Home' },
    { key: 'ft', text: 'Food Truck', value: 'Food Truck' },
    { key: 'sk', text: 'Food Hall', value: 'Food Hall' },
    { key: 'no', text: 'Not operational yet', value: 'Not operational yet' },
    { key: 'c', text: 'Co-working', value: 'Co-working' },
    { key: 'p', text: 'Pop-ups', value: 'Pop-ups' },
    { key: 'on', text: 'Online', value: 'Online' },
    { key: 'o', text: 'Other', value: 'Other' },
];
export const INDUSTRIES = [
    { key: 'b', text: 'Brewery', value: 'Brewery' },
    { key: 'rb', text: 'Restaurant & Bar', value: 'Restaurant & Bar' },
    { key: 'pf', text: 'Packaged Foods & Beverage', value: 'Packaged Foods & Beverage' },
    { key: 'fr', text: 'Fashion Retail', value: 'Fashion Retail' },
    { key: 'fu', text: 'Furniture', value: 'Furniture' },
    { key: 'om', text: 'Other Manufacturing', value: 'Other Manufacturing' },
    { key: 'j', text: 'Jewelry', value: 'Jewelry' },
    { key: 'f', text: 'Fitness', value: 'Fitness' },
    { key: 'hw', text: 'Health & Wellness', value: 'Health & Wellness' },
    { key: 'o', text: 'Other', value: 'Other' },
];
