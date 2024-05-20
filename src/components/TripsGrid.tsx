import * as React from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import {useTripContext} from "../context/TripContext";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef, GridEventListener,
    GridRowEditStopReasons,
    GridRowId, GridRowModel,
    GridRowModes,
    GridRowModesModel, GridRowsProp, GridSlots, GridToolbarContainer
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import {useEffect, useState} from "react";
import {DataStore} from "@aws-amplify/datastore";
import {UserTrip} from "../models";
import Button from "@mui/material/Button";

interface TripRow {
    id: string;
    name: string | null | undefined;
    description: string | null | undefined;
    location: string | null | undefined;
    date: string | null | undefined;
    image: string | null | undefined;
    isNew?: boolean;
    title: string | null | undefined;
    tooltipText: string | null | undefined;
}

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

const CustomButton = styled(Button)`
    && {
        color: #ffffff;  // Customize the color here
        font-size: 1.1rem;
    }
`;

const StyledBox = styled(Box)`
    height: 430px;
    width: 100%;
    border: 0.5px solid black;


    .MuiDataGrid-row {
        background-color: rgba(10, 126, 207, 0.25);
        border-top: 0.2px black solid;
        border-bottom: 0.2px black solid;
    }

    .MuiDataGrid-row:hover {
        color: #0a7ecf;
    }

    .MuiDataGrid-cell {
        border-right: 0.2px black solid;

    }

    .MuiDataGrid-toolbarContainer {
        background-color: #0a7ecf;
        border-bottom: black 0.3px double;
    }
`;

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    //const CustomButton =

    return (
        <GridToolbarContainer>
            <CustomButton startIcon={<AddIcon />} onClick={handleClick}>
                Add record
            </CustomButton>
        </GridToolbarContainer>
    );
}

export default function TripsGrid() {
    const {trips} = useTripContext();
    const [rows, setRows] = useState<TripRow[]>([]);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    useEffect(() => {
        const initialRows: TripRow[] = trips.map(trip => ({
            id: trip.id,
            name: trip.name,
            description: trip.description,
            location: trip.location,
            date: trip.date,
            image: trip.image,
            title: trip.title,
            tooltipText: trip.tooltipText
        }));
        setRows(initialRows);
    }, [trips,  setRows]);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 320,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            editable: true,
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 150,
            editable: true,
        },
        {
            field: 'date',
            headerName: 'Date',
            editable: true,
            width: 220,
        },
        {
            field: 'image',
            headerName: 'Image',
            editable: true,
            width: 150,
        },
        {
            field: 'title',
            headerName: 'Title',
            editable: true,
            width: 200,
        },
        {
            field: 'tooltipText',
            headerName: 'TooltipText',
            editable: true,
            width: 278,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({id}) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon/>}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon/>}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon/>}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon/>}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const handleEditClick = (id: GridRowId) =>  () => {

        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.Edit}});
    };

    const handleSaveClick = (id: GridRowId) => async () => {


        setRowModesModel({...rowModesModel, [id]: {mode: GridRowModes.View}});
    };

    const handleDeleteClick = (id: GridRowId) => async () => {
        const toDelete = await DataStore.query(UserTrip, id.toString());
        if (toDelete) {
            DataStore.delete(toDelete);
        }
        setRows(rows.filter((row) => row.id !== id));
    };

    const addOrUpdateTrip = async (newRow: GridRowModel) => {
        const id = newRow.id.toString();

        try {
            if (newRow.isNew) {
                delete newRow.isNew;
                const userTrip = await DataStore.save(new UserTrip(newRow));
                console.log(userTrip);
            } else {
                const original = await DataStore.query(UserTrip, id.toString());
                const updatedRow = rows.find((row) => row.id === id);

                if (original) {
                    const updatedUserTrip = await DataStore.save(
                        UserTrip.copyOf(original, updated => {
                            updated.image = updatedRow?.image;
                            updated.name = updatedRow?.name;
                            updated.description = updatedRow?.description;
                            updated.location = updatedRow?.location;
                            updated.date = updatedRow?.date;
                            // updated._version = updatedRow?._version;
                        })
                    );

                    console.log(updatedUserTrip);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    const processRowUpdate = async  (newRow: GridRowModel) => {
        await addOrUpdateTrip(newRow);

        const updatedRow = {...newRow, isNew: false} as TripRow;
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: {mode: GridRowModes.View, ignoreModifications: true},
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    }

    return (
        <StyledBox>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </StyledBox>
    );
}