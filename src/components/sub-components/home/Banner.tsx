import Counter from '@/components/animations/Counter';
import PrimaryButton from '@/components/shared/Button/PrimaryButton';
import Image from 'next/image';

/*
 * The hero is the page's Largest Contentful Paint (LCP), so it must be visible
 * on first paint: no scroll-triggered fade-in here (module 07 adds
 * animations that don't hide it), and the image is preloaded.
 */
const Banner = () => {
  return (
    <section className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-x-hidden px-4 py-4 md:flex-row md:py-8 lg:gap-12 lg:py-12 xl:gap-16">
      <div className="w-full">
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

        <div className="mt-4 flex items-center gap-4">
          <div className="w-full space-y-1 border-r border-foreground/80 pr-6">
            <Counter targetValue="50+" duration={1000} />
            International Brands
          </div>

          <div className="w-full space-y-1 border-r border-foreground/80 pr-6">
            <Counter targetValue="2000+" duration={1000} />
            Quality Products
          </div>

          <div className="w-full space-y-1 border-foreground/80 pr-6">
            <Counter targetValue="30,000+" duration={1000} />
            Happy Customers
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[500px] w-full items-center justify-center md:justify-end">
        <Image
          src="/images/banner/banner-1.png"
          alt="Model wearing a knit outfit from the new collection"
          width={500}
          height={500}
          preload
          sizes="(min-width: 768px) 500px, 90vw"
          className="absolute top-1/2 left-1/2 z-10 max-h-[450px] w-full max-w-[450px] -translate-x-1/2 -translate-y-1/2 transform object-contain object-center md:max-h-[500px] md:max-w-[500px] xl:left-1/3 xl:-ml-12 xl:-translate-x-0"
        />
        <div className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-foreground/80 md:h-[400px] md:w-[400px] xl:left-1/3 xl:-translate-x-0" />
      </div>
    </section>
  );
};

export default Banner;
