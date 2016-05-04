// https://www.npmjs.com/package/react-modal-bootstrap

import _ from 'messages'
import React, { Component } from 'react'
import {
  Modal as ReactModal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap'

export default class Modal extends Component {
  constructor (props) {
    super(props)
    this.state = { isOpen: false }
  }

  open = () => {
    this.setState({
      isOpen: true
    })
  }

  hide = () => {
    this.setState({
      isOpen: false
    })
  }

  render () {
    const {
      title,
      footer,
      children
    } = this.props

    return (
      <ReactModal isOpen={this.state.isOpen} onRequestHide={this.hide}>
        <ModalHeader>
          <ModalClose onClick={this.hide} />
          <ModalTitle>
            {_(title)}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
        {
          footer &&
            <ModalFooter>
              {footer}
            </ModalFooter>
        }
      </ReactModal>
    )
  }

}
