// api.ts
import { UserProfile } from '../types/types';

export const getCurrentUser = async (): Promise<{ userId: string }> => {
    return { userId: '12345' };
};

export const fetchUserAttributes = async (): Promise<{ email: string }> => {
    return { email: 'user@example.com' };
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
    const userId = (await getCurrentUser()).userId;
    const email = (await fetchUserAttributes()).email;

    return {
        userId,
        email,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        address: {
            street: '123 Main St',
            city: 'Anytown',
            stateProvince: 'Anystate',
            country: 'Anycountry',
        },
        avatar: 'https://via.placeholder.com/150',
        bio: 'This is a short bio.',
    };
};
