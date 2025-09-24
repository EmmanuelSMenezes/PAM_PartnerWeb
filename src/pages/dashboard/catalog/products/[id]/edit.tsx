import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// redux
import { useGlobalContext } from 'src/hooks/useGlobalContext';

import { PATH_DASHBOARD } from '../../../../../routes/paths';
// layouts
import DashboardLayout from '../../../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../../../components/settings';
import CustomBreadcrumbs from '../../../../../components/custom-breadcrumbs';
// sections
import ProductNewEditForm from '../../../../../sections/@dashboard/e-commerce/ProductNewEditForm';

// ----------------------------------------------------------------------

EcommerceProductEditPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage() {
  const { themeStretch } = useSettingsContext();
  const { products, isActiving } = useGlobalContext();

  const {
    query: { id },
  } = useRouter();

  const currentProduct = products.products?.find(
    (product: any) => paramCase(product.product_id) === id
  );

  return (
    <>
      <Head>
        <title> Parceiro | Edição do Produto </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edição de Item"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: currentProduct?.name }]}
        />

        <ProductNewEditForm isEdit isActiving={isActiving} currentProduct={currentProduct} />
      </Container>
    </>
  );
}
