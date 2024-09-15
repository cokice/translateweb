// pages/index.js

import Head from 'next/head';
import Translator from '../components/Translator';

export default function Home() {
    return (
        <div>
            <Head>
                <title>翻译</title>
            </Head>
            <Translator />
        </div>
    );
}
