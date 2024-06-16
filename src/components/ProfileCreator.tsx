import React, { useState, useRef } from "react";
import {Typography } from "@mui/material";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import styled from "styled-components";
import { uploadData } from 'aws-amplify/storage';
import { DataStore } from "@aws-amplify/datastore";
import { UserProfile } from "../models";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { useNavigate } from 'react-router-dom';


const DivContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 30vw;
    background-color: -moz-default-background-color;
    border: 3px black double;
    box-shadow: 2px 4px;
    padding: 4px;
`;

const DivHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const closeIconStyle = {
    cursor: "pointer",
    color: "red",
    border: "2px black solid",
    borderRadius: "5px"
}

const modalTitleStyle = {
    textAlign: "center",
    fontWeight: "bold",
    padding: "1rem 0  1rem 9rem",
}

const AddressSubTitle = styled.h2`
    font-weight: bold;
    padding: 1rem 0 1rem 9rem;
`;

const InputStyle = styled.input`
    width: 300px;
    border: none;
    border-bottom: 0.5px black solid;
    margin: 0 2rem 1rem 0;
`;

const LabelStyle = styled.label`
    font-weight: bold;
    width: 35%;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const DivStyledInput = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    padding-left: 1rem;
`;

const TextAreaStyle = styled.textarea`
    width: 300px;
    height: auto;
    margin-left: 2rem;
    border: 0.2px black solid;
    resize: vertical; /* Allows the textarea to be resizable vertically */
`;

const ButtonContainer = styled.div`
    display: flex;
    width: 50%;
    justify-content: space-between;
    padding-top: 10px;
    margin: 0 auto;
`;

interface FormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: {
        street: string;
        city: string;
        stateProvince: string;
        country: string;
    };
    avatar: string | File; // Allow avatar to be either a string or a File
    bio: string;
}

export function ProfileCreator() {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            stateProvince: '',
            country: '',
        },
        avatar: '',
        bio: ''
    });

    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const handleClose = () => setOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "avatar" && e.target instanceof HTMLInputElement && e.target.files) {
            // Handle file input separately
            setFormData({ ...formData, avatar: e.target.files[0] });
        } else if (name.includes("address.")) {
            const addressField = name.split(".")[1];
            setFormData(prevState => ({
                ...prevState,
                address: {
                    ...prevState.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const currentUser = await getCurrentUser();
            const userAttributes = await fetchUserAttributes();

            let avatarUrl = "";
            if (formData.avatar) {
                const avatarFile = formData.avatar as unknown as File;
                try {
                    const result = uploadData({
                        path: `public/avatars/${currentUser.username}/${avatarFile.name}`,
                        data: avatarFile,
                        options: {
                            contentType: avatarFile.type,
                            onProgress: ({transferredBytes, totalBytes}) => {
                                if (totalBytes) {
                                    console.log(`Upload progress ${Math.round((transferredBytes / totalBytes) * 100)} %`);
                                }
                            },
                        },
                    })
                    .result;
                    console.log('Succeeded: ', result);
                } catch (error) {
                    console.log('Error uploading file: ', error);
                }
            }

            const newUserProfile = new UserProfile({
                userId: currentUser.username,
                email: userAttributes.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: {
                    street: formData.address.street,
                    city: formData.address.city,
                    stateProvince: formData.address.stateProvince,
                    country: formData.address.country,
                },
                avatar: avatarUrl,
                bio: formData.bio,
            });

            await DataStore.save(newUserProfile);
            handleClose(); // Close the form on successful submission
            navigate('/profile'); // Redirect to UserProfileScreen
        } catch (error) {
            console.error("Error saving user profile: ", error);
        }
    };

    const handleCancel = () => {
        navigate('/'); // Redirect to MainScreen
    };

    const handleReset = () => {
        formRef.current?.reset();
        setFormData({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: {
                street: '',
                city: '',
                stateProvince: '',
                country: '',
            },
            avatar: '',
            bio: ''
        });
    };

    return (
        <div>
            <DivContainer>
                <DivHeader>
                    <Typography
                        id="form-title"
                        variant="h5"
                        component="h2"
                        sx={modalTitleStyle}
                    >
                        User profile editing
                    </Typography>
                    <CloseTwoToneIcon
                        onClick={handleClose}
                        sx={closeIconStyle}
                    />
                </DivHeader>

                <StyledForm ref={formRef} onSubmit={handleSubmit}>
                    <DivStyledInput>
                        <LabelStyle>First Name:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="firstName"
                            onChange={handleChange}
                            placeholder="Example: Michael"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>Last Name:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="lastName"
                            onChange={handleChange}
                            placeholder="Example: Sirois"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>Phone Number:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="phoneNumber"
                            onChange={handleChange}
                            placeholder="1-(819)-555-5555"
                        />
                    </DivStyledInput>
                    <AddressSubTitle>
                        Enter your full address
                    </AddressSubTitle>
                    <DivStyledInput>
                        <LabelStyle>Street:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="address.street"
                            onChange={handleChange}
                            placeholder="555 Avenue du Peuple"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>City:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="address.city"
                            onChange={handleChange}
                            placeholder="Shawinigan"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>State/Province:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="address.stateProvince"
                            onChange={handleChange}
                            placeholder="Quebec"
                        />
                    </DivStyledInput><DivStyledInput>
                        <LabelStyle>Country:</LabelStyle>
                        <InputStyle
                            type="text"
                            name="address.country"
                            onChange={handleChange}
                            placeholder="Canada"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>Avatar:</LabelStyle>
                        <InputStyle
                            type="file"
                            name="avatar"
                            onChange={handleChange}
                            placeholder="Select an image file"
                        />
                    </DivStyledInput>
                    <DivStyledInput>
                        <LabelStyle>Bio:</LabelStyle>
                        <TextAreaStyle
                            name="bio"
                            onChange={handleChange}
                            placeholder="Tell us more about you."
                        />
                    </DivStyledInput>
                    <ButtonContainer>
                        <button type="submit" title="save">Save</button>
                        <input type="reset" value="Reset" title="Reset" onClick={handleReset}/>
                        <button type="button" title="Cancel" onClick={handleCancel}>Cancel</button>
                    </ButtonContainer>
                </StyledForm>
            </DivContainer>
        </div>
    );
}
