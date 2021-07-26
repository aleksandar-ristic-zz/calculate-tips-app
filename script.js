'use strict'

//* Selectors
const inputTotal = document.querySelector('.total-input')
const inputPercent = Array.from(
	document.querySelectorAll('input[name=tip-percent]')
)
const inputCustom = document.querySelector('.custom-input')
const inputPeople = document.querySelector('.people-input')

const errorTotal = document.querySelector('.total-error')
const errorCustom = document.querySelector('.custom-error')
const errorPeople = document.querySelector('.people-error')

const tipAmount = document.querySelector('.tip-amount')
const totalAmount = document.querySelector('.total-amount')

const btnReset = document.querySelector('.reset-btn')

let totalBill = 0
let tipPercent = 0
let peopleAmount = 0

//* Event Listeners
inputTotal.addEventListener('input', e => {
	totalBill = +parseFloat(e.target.value).toFixed(2)
	addVar(totalBill, tipPercent, peopleAmount)
})
inputPercent.forEach(radio => {
	radio.addEventListener('click', e => {
		//! remove from all, then add to target
		inputPercent.forEach(radio => {
			radio.parentElement.classList.remove('checked')
		})
		e.target.parentElement.classList.add('checked')

		tipPercent = parseInt(e.target.value)
		inputCustom.value = ''
		addVar(totalBill, tipPercent, peopleAmount)
	})
})
inputCustom.addEventListener('input', e => {
	inputPercent.forEach(radio => {
		radio.parentElement.classList.remove('checked')
	})

	tipPercent = +parseFloat(e.target.value).toFixed(2)
	addVar(totalBill, tipPercent, peopleAmount)
})
inputPeople.addEventListener('input', e => {
	peopleAmount = parseFloat(e.target.value)

	addVar(totalBill, tipPercent, peopleAmount)
})
btnReset.addEventListener('click', resetAll)

//* Functions
// Serves as checker for vars
function addVar(total, tip, people) {
	if (!tip && !people) return
	if (isNaN(total) || isNaN(tip) || isNaN(people)) return

	if (total <= 0) {
		sendError(errorTotal, "Can't be zero.")
		return
	}
	if (tip <= 0) {
		sendError(errorCustom, "Can't be zero.")
		return
	}
	if (people <= 0) {
		sendError(errorPeople, "Can't be zero.")
		return
	}
	if (!Number.isInteger(people)) {
		people = 0
		inputPeople.value = ''

		sendError(errorPeople, "Can't be body part.")
		return
	}

	btnReset.disabled = false
	calculate(total, tip, people)
}
// Sends and removes errors
function sendError(error, text) {
	const textNode = document.createTextNode(text)
	const input = error.classList[0].split('-')[0] + '-input'

	document.querySelector(`.${input}`).classList.add('error')
	error.innerText = ''
	error.classList.add('active')
	error.append(textNode)

	setTimeout(() => {
		error.innerText = ''
		error.classList.remove('active')
		document.querySelector(`.${input}`).classList.remove('error')
	}, 5000)
}
// Calculates tips and shows them
function calculate(total = 1, tip = 1, people = 1) {
	tipAmount.innerText = ''
	totalAmount.innerText = ''
	tipAmount.classList.remove('active')
	totalAmount.classList.remove('active')

	const tipFull = (total / 100) * tip
	const tipPerPerson = (tipFull / people).toFixed(2)
	const totalPerPerson = ((total + tipFull) / people).toFixed(2)

	const textTip = document.createTextNode(tipPerPerson || '$0.00')
	const textTotal = document.createTextNode(totalPerPerson || '$0.00')
	tipAmount.append(textTip)
	totalAmount.append(textTotal)
	tipAmount.classList.add('active')
	totalAmount.classList.add('active')
}
// Resets whole page
function resetAll() {
	inputTotal.value = ''
	inputPercent.forEach(radio => {
		if (radio.checked) {
			radio.checked = false
		}
	})

	inputPeople.value = ''
	inputCustom.value = ''

	tipAmount.innerText = '$0.00'
	totalAmount.innerText = '$0.00'

	btnReset.disabled = true
}
