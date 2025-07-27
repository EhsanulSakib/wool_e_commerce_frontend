import Counter from "@/components/animations/Counter";
import GSAPAnimationWrapper from "@/components/animations/GsapAnimationWrapper";
import PrimaryButton from "@/components/shared/Button/PrimaryButton";
import Image from "next/image";
import React from "react";

const Banner = () => {
  return (
    <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between px-4 py-4 md:py-8 lg:py-12 gap-4 lg:gap-12 xl:gap-16 overflow-x-hidden">
      <GSAPAnimationWrapper>
        <section className="w-full">
          <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
          <p>
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          <PrimaryButton
            title="Shop Now"
            type="button"
            href="/products"
            style="mt-4 lg:mt-8 w-44 rounded-full cursor-pointer"
          />

          <section className="flex items-center gap-4 mt-4">
            <div className="w-full pr-6 border-r border-foreground/80 space-y-1">
              <Counter targetValue='50+' duration={1000} />
              International Brands
            </div>

            <div className="w-full pr-6 border-r border-foreground/80 space-y-1">
              <Counter targetValue='2000+' duration={1000} />
              Quality Products
            </div>

            <div className="w-full pr-6 border-foreground/80 space-y-1">
              <Counter targetValue='30,000+' duration={1000} />
              Happy Customers
            </div>
          </section>
        </section>
      </GSAPAnimationWrapper>

      <GSAPAnimationWrapper>
        <section className="w-full relative flex justify-center md:justify-end items-center min-h-[500px]">
          <Image
            src="/images/banner/banner-1.png"
            alt="banner"
            width={500}
            height={500}
            className="w-full max-w-[450px] md:max-w-[500px] max-h-[450px] md:max-h-[500px] object-contain object-center z-10 absolute top-1/2 left-1/2 xl:left-1/3 transform -translate-x-1/2 xl:-translate-x-0 xl:-ml-12 -translate-y-1/2"
          />
          <section className="w-[350px] md:w-[400px] h-[350px] md:h-[400px] rounded-full bg-foreground/80 absolute top-1/2 left-1/2 xl:left-1/3 transform -translate-x-1/2 xl:-translate-x-0 -translate-y-1/2 -z-10" />
        </section>
      </GSAPAnimationWrapper>
    </section>
  );
};

export default Banner;
