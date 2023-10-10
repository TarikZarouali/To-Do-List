import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Your Page Title</title>
        <meta name="description" content="Your page description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          To do List
        </h1>

        {/* Your content goes here */}
        {/* For example: */}
        <p>This is your Next.js page content.</p>
      </main>

      <footer className={styles.footer}>
        <p>This is your footer.</p>
      </footer>
    </div>
  )
}
