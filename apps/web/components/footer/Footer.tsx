import { FooterTable } from './FooterTable'
import { FooterSocials } from './FooterSocials'
import { FooterColumn } from './FooterColumn'

export const Footer = () => {
  return (
    <div className="footer">
      <FooterTable></FooterTable>
      <FooterSocials></FooterSocials>
    </div>
  )
}
