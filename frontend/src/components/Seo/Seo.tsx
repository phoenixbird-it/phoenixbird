import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME } from '../../utils/company';

interface SeoProps {
  title: string;
  description: string;
  /** Pass false on the home page, where the title is already complete. */
  appendBrand?: boolean;
  noIndex?: boolean;
}

export default function Seo({ title, description, appendBrand = true, noIndex = false }: SeoProps) {
  const fullTitle = appendBrand ? `${title} | ${COMPANY_NAME}` : title;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {noIndex ? <meta name="robots" content="noindex" /> : null}
    </Helmet>
  );
}
