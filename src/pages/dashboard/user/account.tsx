import { Icon } from '@iconify/react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useGlobalContext } from 'src/hooks/useGlobalContext';
import BankAccountForm from 'src/sections/@dashboard/user/account/billing/BankAccountForm';
import { useRouter } from 'next/router';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import { AccountGeneral } from '../../../sections/@dashboard/user/account';

UserAccountPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();
  const { query } = useRouter();
  const { activeTab, setActiveTab } = useGlobalContext();
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    if (query.tab === 'bankdata') {
      setCurrentTab('bank_account');
    } else {
      setActiveTab('general');
    }
  }, [query, activeTab]);

  const TABS = [
    {
      value: 'general',
      label: 'Perfil',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    {
      value: 'bank_account',
      label: 'Dados Bancários',
      icon: <Icon icon="fa6-solid:credit-card" width="18" height="18" />,
      component: <BankAccountForm />,
    },
  ];

  return (
    <>
      <Head>
        <title> Parceiro | Meu Perfil</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Perfil"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Parceiro' },
            { name: 'Minha Conta' },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
