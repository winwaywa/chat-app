import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { AppUser, Conversation } from "../types";
import { getRecipientEmail } from "../utils/getRecipentEmail";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
    const [loggedInUser, loading, error] = useAuthState(auth);

    //get recipient Email
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);
    //get recipent Avatar
    const queryGetRecipent = query(
        collection(db, "users"),
        where("email", "==", recipientEmail)
    );
    const [conversationsSnapshot, __loading, __error] =
        useCollection(queryGetRecipent);

    // conversationsSnapshot có thể là 1 arr rỗng
    const recipient = conversationsSnapshot?.docs[0]?.data() as
        | AppUser
        | undefined;
    return {
        recipient,
        recipientEmail,
    };
};
