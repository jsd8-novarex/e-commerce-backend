export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile_phone: string;
  date_of_birth: string;
  create_timestamp: string;
  last_updated_timestamp: string;
  creator_id: string;
  last_op_id: string;
  tram_status: boolean;
}

export const customers: Customer[] = [
  {
    id: '1',
    name: 'Aof DEV',
    email: 'john@example.com',
    password: '123456789A',
    mobile_phone: '0123456789',
    date_of_birth: '2000-09-30',
    create_timestamp: '2024-11-10T09:45:22.123Z',
    last_updated_timestamp: '2024-11-10T09:45:22.123Z',
    creator_id: 'earth',
    last_op_id: 'earth',
    tram_status: false,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '123456789',
    mobile_phone: '0123456789',
    date_of_birth: '2000-09-30',
    create_timestamp: '2024-11-10T09:45:22.123Z',
    last_updated_timestamp: '2024-11-10T09:45:22.123Z',
    creator_id: 'earth',
    last_op_id: 'earth',
    tram_status: true,
  },
];

// Helper functions
export const isValidDate = (date: string): boolean =>
  !isNaN(new Date(date).getTime());
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
