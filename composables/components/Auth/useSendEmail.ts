import { resetPassword } from '@aws-amplify/auth'

export const useSendEmail = () => {
  const sendEmail = async (email: string) => {
    const output = await resetPassword({
      username: email,
    })
    const { nextStep } = output
    if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      const codeDeliveryDetails = nextStep.codeDeliveryDetails
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`,
      )
    }
  }

  return {
    sendEmail,
  }
}
