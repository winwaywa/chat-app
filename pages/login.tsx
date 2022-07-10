import { Button } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import * as React from "react";
import styled from "styled-components";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import Logo from "../assets/chat-app-logo.jpg";
import { auth } from "../config/firebase";

const StyledContainer = styled.div`
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: whitesmoke;
`;
const StyledLoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
        0 4px 6px -4px rgb(0 0 0 / 0.1);
`;
const StyledImageWrapper = styled.div`
    margin-bottom: 50px;
`;

export default function Login() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    const signIn = () => {
        signInWithGoogle();
    };
    return (
        <StyledContainer>
            <Head>
                <title>Login</title>
                <meta name="description" content="Chat App Smart" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <StyledLoginContainer>
                <StyledImageWrapper>
                    <Image
                        src={Logo}
                        alt="Chat-app Logo"
                        height="200px"
                        width="200px"
                    />
                </StyledImageWrapper>
                <Button variant="outlined" onClick={signIn}>
                    Đăng nhập với google
                </Button>
            </StyledLoginContainer>
        </StyledContainer>
    );
}
