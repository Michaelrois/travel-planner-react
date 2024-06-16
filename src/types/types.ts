// types.ts
export interface Address {
    street: string;
    city: string;
    stateProvince: string;
    country: string;
}

export interface UserProfile {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: Address;
    avatar: string;
    bio: string;
}
