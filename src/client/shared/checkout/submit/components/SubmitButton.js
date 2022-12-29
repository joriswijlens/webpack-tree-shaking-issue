import React from 'react'

export default (props) => {
  const { t, disableSubmit, handleSubmit } = props
  return (
    <button
      type="button"
      className="mxd-button mxd-button-l mxd-button-primary"
      disabled={disableSubmit}
      onClick={() => handleSubmit(props)}>
      {t('submit')}
    </button>
  )
}
