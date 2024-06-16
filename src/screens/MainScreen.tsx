import styled from "styled-components";
import {ListTripEntry} from "../components/ListTripEntry";
import {Box, Modal, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
//import {DataStore} from "@aws-amplify/datastore";
import {UserTrip} from "../models";
import {Amplify} from "aws-amplify";
import awsConfig from "../amplifyconfiguration.json";
import {useTripContext} from "../context/TripContext";
import {getCurrentUser} from "aws-amplify/auth";
Amplify.configure(awsConfig)

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 465,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const closeIconStyle = {
    position: "relative",
    top: "-28px",
    right: "-400px",
    cursor: "pointer",
    color: "red",
    border: "2px black solid",
    borderRadius: "5px"
}

const modalTitleStyle = {
    position: "relative",
    textAlign: "center",
    top: "-55px",
    color: "black",
    fontWeight: "bold",
}

export const MainScreen = () => {
    const {trips} = useTripContext();
    const [open, setOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<UserTrip | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        getCurrentUser().then(({userId}) => {
            setUserId(userId);
        })
    }, []);

    const handleOpen = (trip: UserTrip) => {
        setSelectedTrip(trip);
        setOpen(true)
    };
    const handleClose = () => setOpen(false);


    return (
        <div>
            <TripTitle>My Planned Trips</TripTitle>

            <ListTrips>
                {trips.map((trip: UserTrip) => (
                    <ListTripEntry
                        key={trip.id}
                        id={trip.id.toString()}
                        description={trip.description}
                        handleOpenModal={() => handleOpen(trip)}
                        name={trip.name}
                        image={trip.image}
                        tooltipText={trip.tooltipText}
                    />
                ))}
            </ListTrips>
            <Modal
                open={open}
                /*onClose={handleClose}*/
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CloseTwoToneIcon
                        onClick={handleClose}
                        sx={closeIconStyle}
                    />
                    <Typography
                        id="modal-modal-title"
                        variant="h5"
                        component="h2"
                        sx={modalTitleStyle}
                    >
                        {selectedTrip?.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        {selectedTrip?.description}
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

const ListTrips = styled.div
    `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `

const TripTitle = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 2rem;
    text-align: center;
    text-shadow: 3px 4px 5px black;
`;