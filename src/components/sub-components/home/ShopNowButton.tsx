import PrimaryButton from '@/components/shared/Button/PrimaryButton';
import { useRouter } from 'next/navigation';
import React from 'react';

const ShopNowButton = () => {
  const router = useRouter();
  return (
   <PrimaryButton title="Shop Now" type='button' style='' onClick={() => {router.push('/products')} }/>
  );
};

export default ShopNowButton;