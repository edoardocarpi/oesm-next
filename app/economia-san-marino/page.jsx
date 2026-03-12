import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Economia San Marino — Dashboard indicatori | OESM',
  description: 'Dashboard interattiva con i principali indicatori economici di San Marino: PIL, inflazione, disoccupazione, commercio estero, turismo. Serie storiche 2010–2023.',
  keywords: ['economia San Marino', 'indicatori economici San Marino', 'PIL San Marino', 'dashboard economia San Marino'],
  alternates: { canonical: 'https://oesm.net/economia-san-marino' },
};

export default function EconomiaSanMarinoPage() {
  return <DashboardClient />;
}
