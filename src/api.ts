import express from 'express';
import { balances, targetAddresses } from './state';
import { validateAddress } from './parse-address';

export function startApiServer() {
  const app = express();
  const port = 3456;

  app.get('/api/balances/:address/:block_no', (req, res) => {
    const { address: addressRaw, block_no } = req.params;
    const address = validateAddress(addressRaw);

    if(!address) {
      res.status(400).json({ error: 'invalid address' });
      return;
    }

    if(!targetAddresses.has(address)) {
      res.status(404).json({ error: 'address is not monitored' });
      return;
    }

    const balance = balances?.[address]?.[block_no];

    if(typeof balance !== 'string') {
      res.status(202).json({ error: 'not indexed' });
      return;
    }

    res.status(200).json({ balance });
  });

  app.post('/api/balances/:address', (req, res) => {
    const { address: addressRaw } = req.params;
    const address = validateAddress(addressRaw);

    if(!address) {
      res.status(400).json({ error: 'invalid address' });
      return;
    }

    targetAddresses.add(address);
    res.status(200).json({ info: 'address was added' });
  });

  app.listen(port, () => {
    console.log(`API listening on port ${port}`)
  });
}
