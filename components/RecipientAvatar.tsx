import { Avatar } from "@mui/material";
import * as React from "react";
import styled from "styled-components";
import { useRecipient } from "../hooks";

type RecipientAvatarProps = ReturnType<typeof useRecipient>; // lấy cái types return hook useRecipient

const StyledAvatar = styled.div`
    margin: 5px 15px 5px 5px;
`;
export default function RecipientAvatar({
    recipient,
    recipientEmail,
}: RecipientAvatarProps) {
    return (
        <StyledAvatar>
            {recipient?.photoURL ? (
                <Avatar src={recipient?.photoURL}></Avatar>
            ) : (
                <Avatar>
                    {recipientEmail && recipientEmail[0].toUpperCase()}
                </Avatar>
            )}
        </StyledAvatar>
    );
}
