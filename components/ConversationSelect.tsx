import styled from "styled-components";
import { Conversation } from "../types";
import { useRecipient } from "../hooks";
import { Avatar } from "@mui/material";
import RecipientAvatar from "./RecipientAvatar";
import { useRouter } from "next/router";
const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-all;

    :hover {
        background-color: whitesmoke;
    }
`;

export interface ConversationSelectProps {
    id: string;
    conversationUsers: Conversation["users"];
}
const ConversationSelect = ({
    id,
    conversationUsers,
}: ConversationSelectProps) => {
    const { recipient, recipientEmail } = useRecipient(conversationUsers);
    const router = useRouter();

    const onSelectConversation = () => {
        router.push(`/conversations/${id}`);
    };

    return (
        <StyledContainer onClick={onSelectConversation}>
            <RecipientAvatar
                recipient={recipient}
                recipientEmail={recipientEmail}
            />
            {recipientEmail}
        </StyledContainer>
    );
};

export default ConversationSelect;
