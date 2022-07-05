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
const url = (phone, name, message) =>
	`https://api.whatsapp.com/send/?phone=${phone}&text=${name}${message}&app&apsent=0`

const App = () => {
	const [boxMessage, showBoxMessage] = useState({ show: false })
	const [clientInfo, setClientInfo] = useState({ name: '', phone: '' })
	const [message, setMessage] = useState({ text: '' })

	const { name, phone } = clientInfo
	const { show } = boxMessage
	const { text } = message

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

	if (!text) setMessage({ text: localStorage.getItem('message') })

	const clientUrl = () => url(phone, name, text)

	const handlerGoChat = () => {
		window.location = clientUrl()
	}

	const handlerGetClientInfo = e => {
		setClientInfo({ name: normalizeName(e.target.value), phone: normalizePhone(e.target.value) })
	}

	const handlerGetClientMessage = e => {
		setMessage({ text: encodeURIComponent(e.target.value) })
	}

	const handlerSetMessage = () => {
		setMessage({ text: localStorage.setItem('message', text) })
	}

	const handlerShowMessage = () => {
		show ? showBoxMessage({ show: false }) : showBoxMessage({ show: true })
	}

	return (
		<FormStyled>
			<Form.Group className='mb-3'>
				<Form.Label>Данные клиента</Form.Label>
				<Form.Control onChange={handlerGetClientInfo} type='text' placeholder='Введите имя и телефон' />
			</Form.Group>

			<Form.Group className={`mb-3 ${boxMessage.show ? '' : 'hide'}`}>
				<Form.Label>Текст сообщения</Form.Label>
				<Form.Control
					onChange={handlerGetClientMessage}
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
					className={boxMessage.show ? '' : 'hide'}
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
