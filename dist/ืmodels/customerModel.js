"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.isValidDate = exports.customers = void 0;
exports.customers = [
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
const isValidDate = (date) => !isNaN(new Date(date).getTime());
exports.isValidDate = isValidDate;
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
exports.isValidEmail = isValidEmail;
