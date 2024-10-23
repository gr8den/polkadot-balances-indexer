import { ApiPromise } from '@polkadot/api';
import { Header } from '@polkadot/types/interfaces';
import { balances } from './state';


let nextProviderIdx = 0;

async function updateBalance(providers: ApiPromise[], header: Header, address: string) {
  // todo: heap/least_conn instead of roundrobin
  const api = providers[nextProviderIdx];
  nextProviderIdx = (nextProviderIdx + 1) % providers.length;

  const apiAt = await api.at(header.hash);
  const balanceData = await apiAt.query.system.account(address);

  // todo: fix types
  const balance = (balanceData as any)?.data?.free.toString();

  if(!(address in balances)) {
    balances[address] = {};
  }

  const blockNumber = header.number.toString();
  balances[address][blockNumber] = balance;
}

export async function updateBalances(providers: ApiPromise[], header: Header, addresses: string[]) {
  // todo: retry
  // todo: timeout
  await Promise.all(addresses.map(address => updateBalance(providers, header, address)));
}
