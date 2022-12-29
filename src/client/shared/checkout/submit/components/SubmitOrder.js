import React from 'react'
import SubmitButton from './SubmitButton'

export default (props) => {
  const { t, format, link: formatTermsAndConditionsLink, has3pSellers, sellersTermsConditionsLink } = props
  const formattedFormat = format.charAt(0).toUpperCase() + format.slice(1).toLowerCase()

  const renderDefaultTermsConditions = () => {
    return (
      <>
        {t('termsAndConditions_1')}
        <label>
          <a href={formatTermsAndConditionsLink} target="_blank" rel="noreferrer">
            {t('termsAndConditions_2')}
          </a>
        </label>
        {t('termsAndConditions_3')}
      </>
    )
  }

  const renderTermsConditionsForSellers = () => {
    return (
      <>
        {t('termsAndConditions_1')}
        <label>
          {t('termsAndConditions_5a')}{' '}
          <a href={formatTermsAndConditionsLink} target="_blank" rel="noreferrer">
            {t('termsAndConditions_5b')} {formattedFormat}
          </a>
        </label>
        ,&nbsp;
        <label>
          {t('termsAndConditions_5a')}{' '}
          <a href={sellersTermsConditionsLink} target="_blank" rel="noreferrer">
            {t('termsAndConditions_5b')} {t('our partners')}
          </a>
        </label>
        {t('termsAndConditions_3')}
      </>
    )
  }

  const renderTermsAndConditions = () => {
    if (has3pSellers === true) {
      return renderTermsConditionsForSellers()
    } else {
      return renderDefaultTermsConditions()
    }
  }

  return (
    <section className="mxd-form-flow-step" data-invalid="">
      <header className="mxd-subpage-header">
        <h2 className="mxd-h-subpage">{t('confirm title')}</h2>
      </header>
      <div className="mxd-collapsible-transition">
        <section className="mxd-form-flow-step" data-form-flow-mode="editing" data-invalid="">
          <div className="mxd-content-section">
            <div className="mdx-form-item" id="airmiles-checkbox-container" />
            <div className="mxd-form-item">
              <SubmitButton {...props} />
            </div>
            <p className="mxd-form-item mxd-helper">{renderTermsAndConditions()}</p>
          </div>
        </section>
      </div>
    </section>
  )
}
