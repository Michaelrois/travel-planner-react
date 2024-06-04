import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {MainScreen} from "./screens/MainScreen";
import {TripEditorScreen} from "./screens/TripEditorScreen";
import NavigationBar from "./components/NavigationBar";
import {TripProvider} from "./context/TripContext";
import styled from "styled-components";
import {Amplify} from 'aws-amplify';
import {Authenticator, View, useTheme, Image, Heading, Text, Button, useAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import {UserProfileScreen} from "./screens/UserProfileSreen";
import {CreateProfileScreen} from "./screens/CreateProfileScreen";

Amplify.configure(awsExports);


// Define your custom components
const components = {
    Header() {
        const {tokens} = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Image
                    alt="Travel Planner Logo"
                    src="./logo128.png"
                />
            </View>
        );
    },

    Footer() {
        const {tokens} = useTheme();

        return (
            <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.neutral[80]}>
                    Travel Planner &copy; All Rights Reserved 2024 AEC Développement d'applications Web
                </Text>
            </View>
        );
    },

    SignIn: {
        Header() {
            const {tokens} = useTheme();

            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Sign in to your account
                </Heading>
            );
        },
        Footer() {
            const {toForgotPassword} = useAuthenticator();

            return (
                <View textAlign="center">
                    <Button
                        fontWeight="normal"
                        onClick={toForgotPassword}
                        size="small"
                        variation="link"
                    >
                        Reset Password
                    </Button>
                </View>
            );
        },
    },

    SignUp: {
        Header() {
            const {tokens} = useTheme();

            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Create a new account
                </Heading>
            );
        },
        Footer() {
            const {toSignIn} = useAuthenticator();

            return (
                <View textAlign="center">
                    <Button
                        fontWeight="normal"
                        onClick={toSignIn}
                        size="small"
                        variation="link"
                    >
                        Back to Sign In
                    </Button>
                </View>
            );
        },
    },
    ConfirmSignUp: {
        Header() {
            const {tokens} = useTheme();
            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Enter Information:
                </Heading>
            );
        },
        Footer() {
            return <Text>Footer Information</Text>;
        },
    },
    SetupTotp: {
        Header() {
            const {tokens} = useTheme();
            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Enter Information:
                </Heading>
            );
        },
        Footer() {
            return <Text>Footer Information</Text>;
        },
    },
    ConfirmSignIn: {
        Header() {
            const {tokens} = useTheme();
            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Enter Information:
                </Heading>
            );
        },
        Footer() {
            return <Text>Footer Information</Text>;
        },
    },
    ForgotPassword: {
        Header() {
            const {tokens} = useTheme();
            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Enter Information:
                </Heading>
            );
        },
        Footer() {
            return <Text>Footer Information</Text>;
        },
    },
    ConfirmResetPassword: {
        Header() {
            const {tokens} = useTheme();
            return (
                <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                >
                    Enter Information:
                </Heading>
            );
        },
        Footer() {
            return <Text>Footer Information</Text>;
        },
    },
};

// Define your custom form fields
const formFields = {
    signIn: {
        username: {
            placeholder: 'Enter your email',
        },
    },
    signUp: {
        password: {
            label: 'Password:',
            placeholder: 'Enter your Password:',
            isRequired: false,
            order: 2,
        },
        confirm_password: {
            label: 'Confirm Password:',
            order: 1,
        },
    },
    forceNewPassword: {
        password: {
            placeholder: 'Enter your Password:',
        },
    },
    forgotPassword: {
        username: {
            placeholder: 'Enter your email:',
        },
    },
    confirmResetPassword: {
        confirmation_code: {
            placeholder: 'Enter your Confirmation Code:',
            label: 'New Label',
            isRequired: false,
        },
        confirm_password: {
            placeholder: 'Enter your Password Please:',
        },
    },
    setupTotp: {
        QR: {
            totpIssuer: 'test issuer',
            totpUsername: 'amplify_qr_test_user',
        },
        confirmation_code: {
            label: 'New Label',
            placeholder: 'Enter your Confirmation Code:',
            isRequired: false,
        },
    },
    confirmSignIn: {
        confirmation_code: {
            label: 'New Label',
            placeholder: 'Enter your Confirmation Code:',
            isRequired: false,
        },
    },
};

// Define your routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainScreen/>,
    },
    {
        path: "/edit",
        element: <TripEditorScreen/>,
    },
    {
        path: "/profile",
        element: <UserProfileScreen/>,
    },
    {
        path: "/createProfile",
        element: <CreateProfileScreen/>,
    },
]);

const Footer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    color: #ffffff;
    background-color: #0a7ecf;
    border: 0.2px black solid;
`;

// Render the application
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <NavigationBar/>
            <TripProvider>
                <Authenticator.Provider>
                    <Authenticator
                        formFields={formFields}
                        components={components}
                        signUpAttributes={['email']}
                    >
                        {({signOut, user}) => (
                            <View>
                                <RouterProvider router={router}/>
                            </View>
                        )}
                    </Authenticator>
                </Authenticator.Provider>
            </TripProvider>
        <Footer>Travel Planner &copy; All Rights Reserved 2024 AEC Développement d'applications Web </Footer>
    </React.StrictMode>
);

reportWebVitals();
