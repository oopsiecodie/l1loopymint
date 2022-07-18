import { Grid, Stack } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import {  mintPublic, mintWhitelist, sampleNFT } from '@pages/utils/_web3';
import MintNFTCard from './mint-nft-card';
import useSWR from 'swr';
import Web3 from 'web3';

const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;

const MintNFT = () => {
  const web3 = new Web3(Web3.givenProvider)

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { active, account, chainId } = useWeb3React();

  const [whitelistClaimable, setWhitelistClaimable] = useState(NOT_CLAIMABLE);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);


  const [whitelistMintStatus, setWhitelistMintStatus] = useState();
  const [publicMintStatus, setPublicMintStatus] = useState();

  const [numToMint, setNumToMint] = useState(2);



  let whitelistProof = [];
  let whitelistValid = false;
  const whitelistRes = useSWR(active && account ? `/api/whitelistProof?address=${account}` : null, {
    fetcher, revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false });
  if (!whitelistRes.error && whitelistRes.data) {
    const { proof, valid } = whitelistRes.data;
    whitelistProof = proof;
    whitelistValid = valid;
  }

  useEffect(() => {
    if (!active || !whitelistValid) {
      setWhitelistClaimable(NOT_CLAIMABLE);
      return;
    } else if (alreadyClaimed) {
      setWhitelistClaimable(ALREADY_CLAIMED);
      return;
    }
    async function validateClaim() {
      const amount = (numToMint * 0.01).toString();
      const amountToWei = web3.utils.toWei(amount, 'ether');
      sampleNFT.methods.mintWhitelist(numToMint,whitelistProof).call({ from: account, value: amountToWei }).then(() => {
        setWhitelistClaimable(CLAIMABLE);
      }).catch((err) => {
        if (err.toString().includes('claimed')) { setWhitelistClaimable(ALREADY_CLAIMED)}
        else { setWhitelistClaimable(NOT_CLAIMABLE) }
      });
    }
    validateClaim();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whitelistProof])




  const onMintWhitelist = async () => {
    const { success, status } = await mintWhitelist(account, numToMint, whitelistProof);
    console.log(status);
    setWhitelistMintStatus(success);
  };

  const onPublicMint = async () => {
    const { success, status } = await mintPublic(account, numToMint);
    console.log(status);
    setPublicMintStatus(success);
  };

  return (
    <>
      <Stack id="demo">

        <Grid container spacing={4} justifyContent="center" alignItems="center">

  <Grid item> 
            <MintNFTCard
              title={'PreSale Mint'}
              description={'Cost: 0.01ETH/mint'}
              canMint={whitelistClaimable}
              mintStatus={whitelistMintStatus}
              showNumToMint={true}
              setNumToMint={setNumToMint}
              action={onMintWhitelist}
            />
          </Grid>
          <Grid item>
            <MintNFTCard
              title={'Public Mint'}
              description={'0.02 ETH/mint'}
              canMint={active}
              mintStatus={publicMintStatus}
              showNumToMint={true}
              setNumToMint={setNumToMint}
              action={onPublicMint}
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default MintNFT;
