
interface IAppProps{
      amount:number;
      currency:"USD" | "EUR";
}


export function formatCurrency({amount, currency}:IAppProps) {
      return  new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
      }).format(amount)
}
