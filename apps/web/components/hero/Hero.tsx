import { HeroMessagePrimary } from './HeroMessagePrimary'
import { HeroMessageSecondary } from './HeroMessageSecondary'
import { HeroVideo } from './HeroVideo'

export const Hero = () => {
  return (
    <div>
      <HeroMessagePrimary></HeroMessagePrimary>
      <HeroMessageSecondary></HeroMessageSecondary>
      <HeroVideo></HeroVideo>
    </div>
  )
}
