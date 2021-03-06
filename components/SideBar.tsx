import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
} from "@mui/material";
import * as React from "react";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";
import { Conversation } from "../types";
import ConversationSelect from "./ConversationSelect";

const StyledContainer = styled.div`
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid whitesmoke;

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
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
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [openDialog, setOpenDialog] = React.useState(false);
    console.log(recipientEmail);

    const toggleDialog = () => {
        setRecipientEmail("");
        setOpenDialog(!openDialog);
    };
    const handleChangeInput = (e: React.ChangeEvent<any>) => {
        setRecipientEmail(e.target.value);
    };

    //L???y conversations c?? email c???a ng?????i d??ng hi???n t???i
    const queryGetConversationForCurrentUser = query(
        collection(db, "conversations"),
        where("users", "array-contains", loggedInUser?.email) //ktra email c??  t???n t???i trong arr users
    );
    const [conversationsSnapshot, __loading, __error] = useCollection(
        queryGetConversationForCurrentUser
    );
    console.log("Danh s??ch c??c cu???c h???i tho???i:", conversationsSnapshot?.docs);

    // ktra 2 ng?????i ???? t???o 1 cu???c h???i tho???i n??o ch??a
    const isConversationAlreadyExists = (recipientEmail: string) =>
        conversationsSnapshot?.docs.find((conversation) =>
            (conversation.data() as Conversation).users.includes(recipientEmail)
        );

    //T???o cu???c h???i tho???i m???i
    const createConversation = async () => {
        if (!recipientEmail) return;
        const isInvintingSelf = recipientEmail === loggedInUser?.email;

        if (
            EmailValidator.validate(recipientEmail) &&
            !isInvintingSelf &&
            !isConversationAlreadyExists(recipientEmail)
        ) {
            console.log("Th??m v??o db");
            // Th??m v??o db
            await addDoc(collection(db, "conversations"), {
                users: [loggedInUser?.email, recipientEmail],
            });
            toggleDialog();
        }
    };

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
            <StyledSidebarButton onClick={toggleDialog}>
                T???o cu???c h???i tho???i m???i
            </StyledSidebarButton>
            {/* List of coversations */}
            {conversationsSnapshot?.docs.map((conversation) => (
                <ConversationSelect
                    key={conversation.id}
                    id={conversation.id}
                    conversationUsers={
                        (conversation.data() as Conversation).users
                    }
                />
            ))}

            {/* dialog */}
            <Dialog open={openDialog} onClose={toggleDialog}>
                <DialogTitle>T???o cu???c h???i tho???i m???i</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Nh???p Email c???a ng?????i b???n mu???n tr?? chuy???n !
                    </DialogContentText>
                    <TextField
                        autoFocus
                        id="name"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={recipientEmail}
                        onChange={handleChangeInput}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleDialog}>Hu???</Button>
                    <Button
                        disabled={!recipientEmail}
                        onClick={createConversation}
                    >
                        Th??m
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledContainer>
    );
}
