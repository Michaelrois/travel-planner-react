import {useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import {useTripContext} from "../context/TripContext";
import TripsGrid from "../components/TripsGrid";

export const TripEditorScreen = () => {
    const {trips} = useTripContext();
    useEffect(() => {
        document.title = "Travel Planner - Editor"
    }, []);
    return (
        <div>
            <h1>
                TripEditorScreen
            </h1>
            <TripsGrid />
        </div>
    )
}