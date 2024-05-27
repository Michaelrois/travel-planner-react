// UserProfileComponent.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserProfile, Address } from '../models';
import { fetchUserProfile } from '../data/api';
import { DataStore } from '@aws-amplify/datastore';

const UserProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.h2`
  margin: 0.5rem 0;
`;

const UserDetail = styled.p`
  margin: 0.3rem 0;
  color: #666;
`;

const AddressContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
`;

const UserProfileComponent: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profiles = await DataStore.query(UserProfile);
                if (profiles.length > 0) {
                    setUserProfile(profiles[0]); // Assuming fetching the first profile for demo
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile().then(r => {
            console.log(r);
        });
    }, []);

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <UserProfileContainer>
            <Avatar src={userProfile.avatar || 'https://via.placeholder.com/150'} alt={`${userProfile.firstName} ${userProfile.lastName}`} />
            <UserInfo>
                <UserName>{`${userProfile.firstName} ${userProfile.lastName}`}</UserName>
                <UserDetail>UserID: {userProfile.userId}</UserDetail>
                <UserDetail>Email: {userProfile.email}</UserDetail>
                <UserDetail>First Name: {userProfile.firstName}</UserDetail>
                <UserDetail>Last Name: {userProfile.lastName}</UserDetail>
                <UserDetail>Phone Number: {userProfile.phoneNumber}</UserDetail>
                <UserDetail>Avatar: {userProfile.avatar}</UserDetail>
                <UserDetail>Bio: {userProfile.bio}</UserDetail>
            </UserInfo>
            <AddressContainer>
                <h3>Address</h3>
                <UserDetail>{userProfile.address?.street}</UserDetail>
                <UserDetail>City: {userProfile.address?.city}</UserDetail>
                <UserDetail>State/Province: {userProfile.address?.stateProvince}</UserDetail>
                <UserDetail>Country: {userProfile.address?.country}</UserDetail>
            </AddressContainer>
        </UserProfileContainer>
    );
};

export default UserProfileComponent;