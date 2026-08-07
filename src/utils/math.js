export const calculateCompoundInterest = (principal, monthlyContribution, rateAnnual, years) => {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  let total = principal;
  const breakdown = [];

  for (let i = 1; i <= n; i++) {
    total = total * (1 + r) + monthlyContribution;
    if (i % 12 === 0) {
      breakdown.push({
        year: i / 12,
        balance: Math.round(total),
        contributions: Math.round(principal + monthlyContribution * i),
        interest: Math.round(total - (principal + monthlyContribution * i))
      });
    }
  }

  return { finalBalance: Math.round(total), breakdown };
};