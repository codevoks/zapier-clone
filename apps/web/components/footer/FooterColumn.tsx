import { FooterHeading } from './FooterHeading'
import { FooterLink } from './FooterLink'
import { footerColumn, columnEntry } from '../../types'

export const FooterColumn = ({ heading, entries }: footerColumn) => {
  return (
    <div className="footer-column">
      <FooterHeading title={heading} />
      {entries.map((entry: columnEntry) => (
        <FooterLink
          key={entry.title}
          title={entry.title}
          path={entry.path}
        ></FooterLink>
      ))}
    </div>
  )
}
