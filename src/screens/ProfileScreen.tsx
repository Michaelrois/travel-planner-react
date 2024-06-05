import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {DataStore} from "@aws-amplify/datastore";
import {UserProfile} from "../models";
import {getCurrentUser} from "aws-amplify/auth";

export const ProfileScreen = () => {
    const [userId, setUserId] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

    useEffect(() => {
        getCurrentUser().then(async ({userId}) => {
            setUserId(userId);

            await setUserProfileInfo(userId);
        })
    }, []);

    const setUserProfileInfo = async (userId: string) => {
        const userProfile = await getLastUserProfile(userId);
        if (userProfile) {
            setFirstName(userProfile.firstName ? userProfile.firstName : '');
            setLastName(userProfile.lastName ? userProfile.lastName : '');
        }
    }

    const getLastUserProfile = async (userId: string): Promise<UserProfile | null> => {
        const userProfiles  = await DataStore.query(UserProfile, (c) => c.userId.eq(userId));
        return userProfiles.length > 0 ? userProfiles[userProfiles.length - 1] : null;
    }

    const handleSubmit = async () => {
        const original = await getLastUserProfile(userId);
        if (original) {
            await DataStore.save(
                UserProfile.copyOf(original, updated => {
                    updated.firstName = firstName;
                    updated.lastName = lastName;
                })
            );
        } else {
            await DataStore.save(new UserProfile({userId: userId, firstName: firstName, lastName: lastName}));
        }
        alert('Profile updated successfully!');
    };

    return (
        <Container>
            <h1>Your Profile</h1>
            <Form>
                <Input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <Button type="submit" onClick={handleSubmit}>Save</Button>
            </Form>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100vh;
    background-color: #f8f9fa;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #0056b3;
    }
`;