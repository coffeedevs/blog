import Image from "next/image";

interface HeroProps {
  title?: string;
  featureImage?: string;
  showContent?: boolean;
}

export default function Hero({ title, featureImage, showContent = true }: HeroProps) {
  const defaultTitle = "Café de por medio";
  const defaultDescription = "Un blog de CoffeeDevs";
  const defaultFeatureImage = "/content/images/size/w2000/2018/06/background.jpg";

  return (
    <section className="m-hero with-picture">
      <div className="m-hero__picture">
        <Image
          src={featureImage || defaultFeatureImage}
          alt={title || defaultTitle}
          width={2000}
          height={1280}
          priority
        />
      </div>
      {showContent && (
        <div className="m-hero__content">
          <h1 className="m-hero-title bigger">{title || defaultTitle}</h1>
          <p className="m-hero-description bigger">{defaultDescription}</p>
        </div>
      )}
    </section>
  );
}
