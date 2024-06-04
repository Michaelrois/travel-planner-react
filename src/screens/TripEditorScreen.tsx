import {useEffect} from "react";
import TripsGrid from "../components/TripsGrid";
import styled from "styled-components";

export const TripEditorScreen = () => {
    useEffect(() => {
        document.title = "Travel Planner - Editor"
    }, []);
    return (
        <div>
            <TextStlyleH1>
                Trip Editor
            </TextStlyleH1>
            <TripsGrid />
        </div>
    )
}

const TextStlyleH1 = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 2rem;
    text-align: center;
    text-shadow: 3px 4px 5px black;
`;