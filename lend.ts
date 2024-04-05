import { chainView } from "chainview";
import artifactExample from "./chainviewArtifacts/ControllerInfo.json";
const RPC_URL: string = "https://rpc.ankr.com/eth";

type Pos = {
	borrower: string;
	collat: bigint;
	stable: bigint;
	debt: bigint;
	upper: bigint;
	lower: bigint;
	ticks: bigint;
};
type ControllerInfo = { 
	controller: string;
	collat: string;
	decimalsc: bigint;
	symbolc: string;
	borrowed: string;
	decimalsb: bigint;
	symbolb: string;
	total: bigint;
	price: bigint;
	n_loans: bigint;
	positions: Pos[];
};
type ParamCall = [string];
function powa(a: bigint): bigint {
	const b: bigint = BigInt(10);
	return b**a;
}
async function main(controller: string) {
  const CRVUSD: string = "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E";
  const params: ParamCall = [controller];
  const [chainViewResponse] = await chainView<
    ParamCall,
    ControllerInfo[]
  >(artifactExample.abi, artifactExample.bytecode, params, RPC_URL);
  //console.log(`TokenIds for ${chainViewResponse.borrowers}: ${chainViewResponse.exist}`);
  //console.log(`${chainViewResponse}`)
  console.log(`=========LLAMALEND=========`)
  if (chainViewResponse.collat == CRVUSD) {
    console.log(`${chainViewResponse.symbolb}-short Market: (${chainViewResponse.controller})`)
  }
  else
  {
    console.log(`${chainViewResponse.symbolc}-long Market: (${chainViewResponse.controller})`)
  }
  console.log(`There are ${chainViewResponse.n_loans} borrower(s) borrowing a total of ${(chainViewResponse.total / (powa(chainViewResponse.decimalsb)))} ${chainViewResponse.symbolb}`)
  if (chainViewResponse.collat == CRVUSD) {
    console.log(`${chainViewResponse.symbolb} price: ${(10**18)/Number(chainViewResponse.price)} crvUSD`)
  }
  else 
  {
    console.log(`${chainViewResponse.symbolc} price: ${Number(chainViewResponse.price)/(10**18)} crvUSD`)
  }
  console.log()
  console.log(`Positions details:`)
  for (let i = 0; i < chainViewResponse.n_loans; i++) {
    console.log(`Borrower ${i+1} (${chainViewResponse.positions[i].borrower}) is borrowing ${chainViewResponse.positions[i].debt/powa(chainViewResponse.decimalsb)} ${chainViewResponse.symbolb}`)
    console.log(`With ${chainViewResponse.positions[i].collat/powa(chainViewResponse.decimalsc)} ${chainViewResponse.symbolc} as collateral`)
    console.log(`Thus the liquidation range is between ${Number(chainViewResponse.positions[i].upper)/10**18} $ and ${Number(chainViewResponse.positions[i].lower)/10**18} $ over ${chainViewResponse.positions[i].ticks} ticks`)
    console.log()
  }
}
let control: string | undefined = process.argv[2];
if (control === undefined) {
  control = "0xEdA215b7666936DEd834f76f3fBC6F323295110A";//crv-long
}
main(control);
