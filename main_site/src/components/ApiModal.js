import React from 'react'
import {Button, Modal, ModalHeader, ModalBody} from 'reactstrap'
import { connect } from 'react-redux'
import {
    toggleOpen
} from '../actions/modal'
import AsyncLoad from '../components/AsyncLoad'
import {showApiKey} from '../services/auth'
import Loading from '../components/Loading'

const mapStateToProps=({modal:{isOpen}, auth:{apiKey}, client})=>({
    isOpen, apiKey, client
})
const mapDispatchToProps=dispatch=>({
    toggleOpen:toggleOpen(dispatch),
    onLoad:showApiKey(dispatch)
})
export const ApiModal=({isOpen, toggleOpen, apiKey, client, onLoad})=>[
    <Button onClick={toggleOpen} key='button'>View API Key</Button>,
    <Modal 
        key='modal' isOpen={isOpen} 
        toggle={toggleOpen} 
    >
        <ModalHeader>API Key</ModalHeader>
        <AsyncLoad requiredObject={apiKey} onLoad={()=>onLoad(client)} loading={Loading} render={()=>(
            <ModalBody>{apiKey}</ModalBody>
        )}/>
    </Modal>
]

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ApiModal)
