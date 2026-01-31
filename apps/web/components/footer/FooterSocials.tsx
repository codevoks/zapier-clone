import { socials } from './socials/socials.ts'
export const FooterSocials = () => {
  return (
    <div className="flex">
      <div className="footer-socials">Follow us on -</div>
      <div className="footer-socials-icons">
        {socials.map(({ label, url, icon: Icon }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${label}`}
          >
            <Icon className="social-icon" />
          </a>
        ))}
      </div>
    </div>
  )
}
