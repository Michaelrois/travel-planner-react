import styled from "styled-components";
import {Amplify} from "aws-amplify";
import awsExports from '../aws-exports';
import UserProfileComponent from "../components/UserProfileComponent";
Amplify.configure(awsExports)

const TextStyleH1 = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    padding-bottom: 2rem;
    text-align: center;
    text-shadow: 3px 4px 5px black;
`;
export const UserProfileScreen: React.FC = () => {

    return (
        <div>
            <TextStyleH1>User Profile</TextStyleH1>
            <UserProfileComponent />
        </div>
    )
};