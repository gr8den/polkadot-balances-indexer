import { ApiPromise, WsProvider } from '@polkadot/api';
import { sleep } from './utils';
import { startApiServer } from './api';
import { targetAddresses } from './state';
import { updateBalances } from './update-balances';


async function main() {
  startApiServer();

  const providers = [
    await ApiPromise.create({ provider: new WsProvider('wss://polkadot-rpc.dwellir.com') }),
    await ApiPromise.create({ provider: new WsProvider('wss://rpc.polkadot.io') }),
  ];
  const providerForSubs = providers[0];

  // todo: resubscribe
  // todo: use as event to update finalized chain height. update sequentially by block number in other task
  const _unsubscribe = await providerForSubs.rpc.chain.subscribeFinalizedHeads(async (header) => {
    console.log(`Finalized block: #${header.number}`);

    try {
      const addresses = Array.from(targetAddresses);
      await updateBalances(providers, header, addresses);
      console.log(`balances updated at ${header.number}/${header.hash} for ${addresses.length} addresses`);
    } catch(err) {
      console.error(`unable to update balances at ${header.number}/${header.hash}: ${err}`);
    }
  });

  for(;;) {
    await sleep(1000);
  }
}

main()
  .then(() => {
    console.log('programm exited');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
