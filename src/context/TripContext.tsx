import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserTrip } from '../models'; // Assuming you have a type definition for UserTrip
import { DataStore } from '@aws-amplify/datastore'; // Assuming you're using AWS Amplify

interface TripContextType {
    trips: UserTrip[];
    loadTrips: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
    const context = useContext(TripContext);
    if (context === undefined) {
        throw new Error('useTripContext must be used within a TripProvider');
    }
    return context;
};
interface TripProviderProps {
    children: React.ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
    const [trips, setTrips] = useState<UserTrip[]>([]);

    const loadTrips = async () => {
        const userTrips = await DataStore.query(UserTrip);
        setTrips(userTrips);
    };

    useEffect(() => {
        loadTrips();
    }, []);

    return (
        <TripContext.Provider value={{ trips, loadTrips }}>
            {children}
        </TripContext.Provider>
    );
};