type Props = { src: string; alt: string; className?: string; square?: boolean; desktopSrc?: string };

// Shared lazy imagery: the mobile source keeps its existing optimized asset.
export function MobileSectionImage({ src, alt, className = "", square = false, desktopSrc }: Props) {
  return (
    <picture className={`m-section-image ${className}`}>
      <source media="(max-width: 760px)" srcSet={src} />
      <img
        src={desktopSrc || src}
        alt={alt}
        width={square ? 960 : 768}
        height={square ? 960 : 512}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}
