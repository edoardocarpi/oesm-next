import DashboardClientEN from './DashboardClientEN';

export const metadata = {
  title: 'San Marino Economy Dashboard — Macroeconomic Indicators | OESM',
  description: 'Interactive dashboard of San Marino\'s macroeconomic indicators. GDP, unemployment, inflation, trade and more. Data 2010–2023.',
  alternates: { canonical: 'https://oesm.net/en/economy-san-marino', languages: { 'it': 'https://oesm.net/economia-san-marino', 'en': 'https://oesm.net/en/economy-san-marino' } },
};

export default function DashboardPageEN() {
  return <DashboardClientEN />;
}
