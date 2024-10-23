# Polkadot balances indexer

### Testing
```
pnpm i
tsx src/index.ts

curl -X POST http://localhost:3456/api/balances/1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7
curl -X POST http://localhost:3456/api/balances/12xtAYsRUrmbniiWQqJtECiBQrMn8AypQcXhnQAc6RB6XkLW

curl http://localhost:3456/api/balances/1qnJN7FViy3HZaxZK9tGAA71zxHSBeUweirKqCaox4t8GT7/23089737
```
