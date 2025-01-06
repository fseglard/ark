import { QrCode } from '@ark-ui/react/qr-code'

export const ErrorCorrection = () => {
  return (
    <QrCode.Root value="http://ark-ui.com" encoding={{ ecc: 'H' }}>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  )
}
