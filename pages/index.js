import Head from 'next/head';
import styles from '../styles/Home.module.css';
import MuiNextLink from '@components/core-components/MuiNextLink';
import { Container, Stack } from '@mui/material';
import GetStarted from '@components/GetStarted';
import MintNFT from '@components/web3/mint-nft';

export default function Home() {
  return (
    <Container>
       
      <Head id="home">
      <div style={{  
    }}> 
       </div>
        <title>L1L</title>
        <meta name="description" content="NFT" />
        <link rel="icon" href="/favicon.ico" />
   
      </Head>

      <main className={styles.main}>
        <h1 style="color:pink" >
          Layer1Loopys
        </h1>

        
        <GetStarted />
        <MintNFT />
      </main>
    </Container>
  )
}
