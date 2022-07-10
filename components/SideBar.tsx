import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import * as React from "react";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid whitesmoke;
`;
const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    position: sticky;
    top: 0;
    border-bottom: 1px solid whitesmoke;
    background-color: #fff;
    z-index: 1;
`;
const StyledSearch = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-radius: 2px;
`;

const StyledUserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const StyledSearchInput = styled.input`
    outline: none;
    border: none;
    flex: 1;
`;

const StyledSidebarButton = styled(Button)`
    width: 100%;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
`;

export default function SideBar() {
    const [loggedInUser, loading, error] = useAuthState(auth);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <Tooltip
                    title={loggedInUser?.displayName as string}
                    placement="right"
                >
                    <StyledUserAvatar
                        alt={loggedInUser?.displayName as string}
                        src={loggedInUser?.photoURL as string}
                    />
                </Tooltip>
                <div>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    <IconButton onClick={logout}>
                        <LogoutIcon />
                    </IconButton>
                </div>
            </StyledHeader>
            <StyledSearch>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <StyledSearchInput placeholder="Search..."></StyledSearchInput>
            </StyledSearch>
            <StyledSidebarButton>Start a new conversation</StyledSidebarButton>
            List of coversations
        </StyledContainer>
    );
}
