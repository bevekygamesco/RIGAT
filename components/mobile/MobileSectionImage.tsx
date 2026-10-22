type Props = { src: string; alt: string; className?: string; square?: boolean };

// A mobile source avoids downloading decorative section images on desktop.
export function MobileSectionImage({ src, alt, className = "", square = false }: Props) {
  return (
    <picture className={`m-section-image ${className}`}>
      <source media="(max-width: 760px)" srcSet={src} />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        alt={alt}
        width={square ? 960 : 768}
        height={square ? 960 : 512}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
