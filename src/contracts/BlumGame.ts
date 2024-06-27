import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  toNano,
} from "ton-core";

export default class BlumGame implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createForDeploy(code: Cell, initialPrice: number): BlumGame {
    const data = beginCell()
      .storeUint(initialPrice, 64)
      .storeUint(0, 64) // totalBets
      .endCell();
    const workchain = 0;
    const address = contractAddress(workchain, { code, data });
    return new BlumGame(address, { code, data });
  }

  async getGameState(provider: ContractProvider) {
    const { stack } = await provider.get("get_game_state", []);
    return {
      currentPrice: stack.readBigNumber(),
      totalBets: stack.readBigNumber(),
    };
  }

  async placeBet(
    provider: ContractProvider,
    via: Sender,
    betAmount: bigint,
    betUp: boolean
  ) {
    const messageBody = beginCell()
      .storeUint(1, 32) // op (op #1 = place bet)
      .storeUint(0, 64) // query id
      .storeBit(betUp)
      .endCell();

    await provider.internal(via, {
      value: betAmount,
      body: messageBody,
    });
  }

  async updatePrice(provider: ContractProvider, via: Sender, newPrice: bigint) {
    const messageBody = beginCell()
      .storeUint(2, 32) // op (op #2 = update price)
      .storeUint(0, 64) // query id
      .storeUint(newPrice, 64)
      .endCell();

    await provider.internal(via, {
      value: toNano("0.01"),
      body: messageBody,
    });
  }
}
