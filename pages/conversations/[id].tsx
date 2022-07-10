import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { ConversationScreen } from "../../components/ConversationScreen";
import SideBar from "../../components/SideBar";
import { auth, db } from "../../config/firebase";
import { Conversation, IMessage } from "../../types";
import {
    generateQueryGetMessage,
    transformMessage,
} from "../../utils/getMessagesInConversation";
import { getRecipientEmail } from "../../utils/getRecipentEmail";

const StyledContainer = styled.div`
    display: flex;
`;
const StyledConversationContainer = styled.div`
    flex-grow: 1;
    overflow: scroll;

    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
`;

interface Props {
    conversation: Conversation;
    messages: IMessage[];
}
const Conversation = ({ conversation, messages }: Props) => {
    const [loggedInUser, loading, error] = useAuthState(auth);
    return (
        <StyledContainer>
            <Head>
                <title>
                    Đang chat với{" "}
                    {getRecipientEmail(conversation.users, loggedInUser)}
                </title>
            </Head>
            <SideBar />

            <StyledConversationContainer>
                <ConversationScreen
                    conversation={conversation}
                    messages={messages}
                ></ConversationScreen>
            </StyledConversationContainer>
        </StyledContainer>
    );
};

export default Conversation;

// viết SSR return lại props cho component trên
// Props: kiểu trả về của props
export const getServerSideProps: GetServerSideProps<
    Props,
    { id: string }
> = async (context) => {
    // Lấy params từ url
    const conversationId = context.params?.id;
    //Lấy cuộc hội thoại từ db
    const conversationRef = doc(db, "conversations", conversationId as string);
    const conversationSnapshot = await getDoc(conversationRef);

    // Lấy tất cả messages trong cuộc hội thoại
    const queryMessages = generateQueryGetMessage(conversationId);
    const messagesSnapshot = await getDocs(queryMessages);
    const messages = messagesSnapshot.docs.map((message) =>
        transformMessage(message)
    );

    return {
        props: {
            conversation: conversationSnapshot.data() as Conversation,
            messages,
        },
    };
};
