import { CircularProgress } from "@mui/material";
import Image from "next/image";
import * as React from "react";
import styled from "styled-components";
import Logo from "../assets/chat-app-logo.jpg";

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

export default function Loading() {
    return (
        <StyledContainer>
            <StyledLoginContainer>
                <StyledImageWrapper>
                    <Image
                        src={Logo}
                        alt="Chat-app Logo"
                        height="200px"
                        width="200px"
                    />
                </StyledImageWrapper>
                <CircularProgress />
            </StyledLoginContainer>
        </StyledContainer>
    );
}
