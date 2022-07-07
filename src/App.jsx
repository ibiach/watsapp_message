import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const FormStyled = styled.form`
	max-width: 350px;
	margin: 0 auto;
	margin-top: 10%;
`
const ButtonsText = styled.div`
	display: flex;
	flex-direction: row;
	margin-bottom: 10px;
`
const url = (name, phone, message) =>
	`https://api.whatsapp.com/send/?phone=${phone}&text=${name}${message}&app&apsent=0`

const App = () => {
	const [boxMessage, showBoxMessage] = useState({ show: false })
	const [clientInfo, setClientInfo] = useState('')
	const [message, setMessage] = useState('')

	const { show } = boxMessage

	const normalizeName = name => {
		const regexpChars = /([а-яё]+|[a-z]+)/gi
		const searchName = String(name.match(regexpChars)).split(',').join('')

		const firstChar = searchName.slice(0, 1).toUpperCase()
		const otherChars = searchName.slice(1).toLowerCase()

		return firstChar + otherChars
	}

	const normalizePhone = phone => {
		const regexpNums = /([0-9])+/gi
		const searchPhone = String(phone.match(regexpNums)).split(',').join('')

		return searchPhone.length >= 11 ? searchPhone : '8' + searchPhone
	}

	const isShownMessage = () => (boxMessage.show ? '' : 'hide')

	const handlerShowMessage = () => (show ? showBoxMessage({ show: false }) : showBoxMessage({ show: true }))

	const handlerGetClientInfo = e => setClientInfo(e.target.value)

	const handlerGetClientMessage = e => setMessage(e.target.value)

	const handlerSetMessage = () => {
		localStorage.setItem('message', encodeURI(message))
		setMessage('')
	}

	const handlerGoChat = () => {
		const normalizeNameClient = normalizeName(clientInfo)
		const normalizePhoneClient = normalizePhone(clientInfo)
		const encodeMessage = encodeURI(message) ? encodeURI(message) : localStorage.getItem('message')

		setClientInfo('')

		window.location = url(normalizeNameClient, normalizePhoneClient, encodeMessage)
	}

	return (
		<FormStyled>
			<Form.Group className='mb-3'>
				<Form.Label>Данные клиента </Form.Label>
				<Form.Control
					onChange={handlerGetClientInfo}
					value={clientInfo}
					type='text'
					placeholder='Введите имя и телефон'
				/>
			</Form.Group>

			<Form.Group className={`mb-3 ${isShownMessage()}`}>
				<Form.Label>Текст сообщения</Form.Label>
				<Form.Control
					onChange={handlerGetClientMessage}
					value={message}
					as='textarea'
					placeholder='Введите сообщение'
					style={{ height: '100px' }}
				/>
			</Form.Group>

			<ButtonsText>
				<Button
					onClick={handlerShowMessage}
					style={{
						maxWidth: '350px',
						width: '100%',
						marginRight: '3px',
						fontSize: '15px',
					}}
					variant='primary'
					type='button'
				>
					ТЕКСТ
				</Button>
				<Button
					onClick={handlerSetMessage}
					className={isShownMessage()}
					style={{
						maxWidth: '350px',
						width: '100%',
						marginLeft: '3px',
						fontSize: '15px',
					}}
					variant='primary'
					type='button'
				>
					ИЗМЕНИТЬ ТЕКСТ
				</Button>
			</ButtonsText>

			<Button
				onClick={handlerGoChat}
				style={{
					maxWidth: '350px',
					width: '100%',
					marginLeft: '3px',
					margin: '0',
				}}
				variant='primary'
				type='button'
			>
				ОТПРАВИТЬ
			</Button>
		</FormStyled>
	)
}
export default App
