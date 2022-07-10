import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import SideBar from "../components/SideBar";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Chat App</title>
                <meta name="description" content="Chat App Smart" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SideBar />
        </div>
    );
};

export default Home;
