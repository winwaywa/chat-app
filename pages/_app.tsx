import "../styles/globals.css";
import type { AppProps } from "next/app";
import Login from "./login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
// import Loading from "../components/Loading";
import { LinearProgress } from "@mui/material";
import { useEffect } from "react";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";

function MyApp({ Component, pageProps }: AppProps) {
    const [loggedInUser, loading, error] = useAuthState(auth);
    console.log(loggedInUser);

    useEffect(() => {
        //Lưu dữ liệu vào firestore
        const setUserInDb = async () => {
            try {
                await setDoc(
                    doc(db, "users", loggedInUser?.uid as string),
                    {
                        email: loggedInUser?.email,
                        lastSeen: serverTimestamp(), //t/gian online
                        photoURL: loggedInUser?.photoURL,
                    },
                    {
                        merge: true, //ktra đã đăng nhập trước đây chưa, nếu có chỉ cập nhật trường lastSeen
                    }
                );
            } catch (err) {
                //ghi lại document trong firebase/firestore
                console.log(err);
            }
        };
        if (loggedInUser) {
            setUserInDb();
        }
    }, [loggedInUser]);

    if (loading) return <LinearProgress />;

    if (!loggedInUser) {
        return <Login />;
    }

    return <Component {...pageProps} />;
}

export default MyApp;
