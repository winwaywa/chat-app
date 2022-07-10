import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useRecipient } from "../hooks";
import { Conversation, IMessage } from "../types";
import RecipientAvatar from "./RecipientAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    convertFirestoreTimestampToString,
    generateQueryGetMessage,
    transformMessage,
} from "../utils/getMessagesInConversation";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { InsertEmoticon, Send, Mic } from "@mui/icons-material";
import {
    serverTimestamp,
    setDoc,
    doc,
    addDoc,
    collection,
} from "firebase/firestore";
import {
    KeyboardEventHandler,
    MouseEventHandler,
    useRef,
    useState,
} from "react";

const StyledRecipientHeader = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    align-items: center;
    padding: 11px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const StyledHeaderInfo = styled.div`
    flex-grow: 1;
    > h3 {
        margin-top: 0;
        margin-bottom: 3px;
    }
    > span {
        font-size: 14px;
        color: gray;
    }
`;

const StyledH3 = styled.h3`
    word-break: break-all;
`;

const StyledHeaderIcons = styled.div`
    display: flex;
`;

const StyledMessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const StyledInputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const StyledInput = styled.input`
    flex-grow: 1;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 15px;
    margin-left: 15px;
    margin-right: 15px;
`;

const EndOfMessagesForAutoScroll = styled.div`
    margin-bottom: 30px;
`;

interface Props {
    conversation: Conversation;
    messages: IMessage[];
}
export const ConversationScreen = ({ conversation, messages }: Props) => {
    const [newMessage, setNewMessage] = useState("");
    const [loggedInUser, loading, error] = useAuthState(auth);
    const conversationUsers = conversation.users;

    const { recipient, recipientEmail } = useRecipient(conversationUsers);

    const router = useRouter();
    const conversationId = router.query.id;
    const queryGetMessages = generateQueryGetMessage(conversationId as string);

    // useCollection giúp connect đến firestore
    // Nếu data trên firestore thay đổi nó sẽ cập nhật messagesSnapshot lại
    const [messagesSnapshot, messagesLoading, __error] =
        useCollection(queryGetMessages);

    const showMessage = () => {
        // Nếu messagesLoading đang load thì return messages từ props
        if (messagesLoading) {
            return messages.map((message) => (
                <Message key={message.id} message={message} />
            ));
        }

        //messagesLoading hết thì
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message key={message.id} message={transformMessage(message)} />
            ));
        }
    };

    const addMessageToDbAndUpdateLastSeen = async () => {
        // Cập nhật last seen users collection
        await setDoc(
            doc(db, "users", loggedInUser?.uid as string),
            {
                lastSeen: serverTimestamp(),
            },
            {
                merge: true,
            }
        );

        // Thêm message vào collection
        await addDoc(collection(db, "messages"), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: loggedInUser?.email,
        });

        //reset input field
        setNewMessage("");

        scrollToBottom();
    };

    const sendMessageOnEnter: KeyboardEventHandler<HTMLInputElement> = (
        event
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!newMessage) return;
            addMessageToDbAndUpdateLastSeen();
        }
    };
    const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (
        event
    ) => {
        event.preventDefault();
        if (!newMessage) return;
        addMessageToDbAndUpdateLastSeen();
    };

    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <>
            <StyledRecipientHeader>
                <RecipientAvatar
                    recipient={recipient}
                    recipientEmail={recipientEmail}
                />
                <StyledHeaderInfo>
                    <h3>{recipientEmail}</h3>
                    {recipient && (
                        <span>
                            Lần đăng nhập cuối:
                            {convertFirestoreTimestampToString(
                                recipient.lastSeen
                            )}
                        </span>
                    )}
                </StyledHeaderInfo>

                <StyledHeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </StyledHeaderIcons>
            </StyledRecipientHeader>

            <StyledMessageContainer>
                {showMessage()}
                <EndOfMessagesForAutoScroll
                    ref={endOfMessagesRef}
                ></EndOfMessagesForAutoScroll>
            </StyledMessageContainer>

            <StyledInputContainer>
                <InsertEmoticon />
                <StyledInput
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={sendMessageOnEnter}
                />
                <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
                    <Send />
                </IconButton>
                <IconButton>
                    <Mic />
                </IconButton>
            </StyledInputContainer>
        </>
    );
};
