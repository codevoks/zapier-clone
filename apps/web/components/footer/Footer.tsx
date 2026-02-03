import { FooterTable } from './FooterTable'
import { FooterSocials } from './FooterSocials'
import { footerColumnData } from './data/footerData'

export const Footer = () => {
  return (
    <div className="footer">
      <FooterTable columns={footerColumnData}></FooterTable>
      <FooterSocials></FooterSocials>
    </div>
  )
}
