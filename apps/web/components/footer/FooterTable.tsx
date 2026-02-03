import { FooterColumn } from './FooterColumn'
import { footerColumn, footerColumns } from '../../types'

export const FooterTable = ({ columns }: { columns: footerColumns }) => {
  return (
    <div className="footer-table">
      <div className="flex">
        {columns.map((column: footerColumn) => (
          <FooterColumn
            key={column.heading}
            heading={column.heading}
            entries={column.entries}
          ></FooterColumn>
        ))}
      </div>
    </div>
  )
}
