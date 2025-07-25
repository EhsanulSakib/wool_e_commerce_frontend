import PrimaryButton from '@/components/shared/Button/PrimaryButton';
import React from 'react';

const Banner = () => {
  return (
    <section className='w-full flex flex-col md:flex-row items-center justify-between px-4 py-4 md:py-8 lg:py-12 gap-4 lg:gap-12 xl:gap-16'>
      <section className='w-full'>
          <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>

          <PrimaryButton title="Shop Now" type='button' href='/products' style='mt-4 lg:mt-8 w-24 lg:w-44 rounded-full cursor-pointer'/>
      </section>

      <section className='w-full'>

      </section>

      
    </section>
  );
};

export default Banner;