import Image from 'next/image';
import { club } from '@/content/club';

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/ranheim-esport-logo.png"
      alt={club.name}
      width={1046}
      height={207}
      className={className}
      priority={priority}
    />
  );
}
