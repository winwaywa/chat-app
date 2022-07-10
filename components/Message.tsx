import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/firebase";
import { IMessage } from "../types";

const StyledMessage = styled.p`
    width: fit-content;
    word-break: break-all;
    max-width: 90%;
    min-width: 30%;
    background-color: red;
    padding: 15px 15px 30px;
    border-radius: 10px;
    position: relative;
`;

const StyledSenderMessage = styled(StyledMessage)`
    margin-left: auto;
    background-color: #e0aa70;
`;
const StyledReceiverMessage = styled(StyledMessage)`
    margin-right: auto;
    background-color: whitesmoke;
`;
const StyledTimestap = styled.span`
    color: gray;
    padding: 10px;
    font-size: x-small;
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: left;
`;

interface MessageProps {
    message: IMessage;
}
const Message = ({ message }: MessageProps) => {
    const [loggedInUser, loading, error] = useAuthState(auth);

    const MessageType =
        loggedInUser?.email === message.user
            ? StyledSenderMessage
            : StyledReceiverMessage;
    return (
        <>
            <MessageType>
                {message.text}
                <StyledTimestap>{message.sent_at}</StyledTimestap>
            </MessageType>
        </>
    );
};

export default Message;
