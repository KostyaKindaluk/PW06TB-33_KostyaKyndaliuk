import { EquipmentCalculator } from "./utils.js";

class App {
	constructor() {
		this.equipmentData = [
			{name: "Шліфувальний верстат", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 4, Pn: 20, Kv: 0.15, tg_phi: 1.33},
			{name: "Свердлильний верстат", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 2, Pn: 14, Kv: 0.12, tg_phi: 1.0},
			{name: "Фугувальний верстат", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 4, Pn: 42, Kv: 0.15, tg_phi: 1.33},
			{name: "Циркулярна пила", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 1, Pn: 36, Kv: 0.3, tg_phi: 1.52},
			{name: "Прес", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 1, Pn: 20, Kv: 0.5, tg_phi: 0.75},
			{name: "Полірувальний верстат", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 1, Pn: 40, Kv: 0.2, tg_phi: 1.0},
			{name: "Фрезерний верстат", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 2, Pn: 32, Kv: 0.2, tg_phi: 1.0},
			{name: "Вентилятор", eta: 0.92, cos_phi: 0.9, U: 0.38, n: 1, Pn: 20, Kv: 0.65, tg_phi: 0.75}
		];

		let calculatorForm = document.getElementById("electrical-calculator");
		calculatorForm.addEventListener("submit", (event) => this.calculator_form_submit(event));
		
		let addEquipmentBtn = document.getElementById("add-equipment-btn");
		addEquipmentBtn.addEventListener("click", () => this.add_equipment());
		
		this.renderEquipmentTable();
		this.hide_results();
	}

	renderEquipmentTable() {
		let tableBody = document.getElementById("equipment-table");
		tableBody.innerHTML = '';

		this.equipmentData.forEach((equipment, index) => {
			let row = document.createElement("tr");
			row.innerHTML = `
				<td><input type="text" class="form-control form-control-sm equipment-name" value="${equipment.name}" data-index="${index}" required></td>
				<td><input type="number" step="0.01" class="form-control form-control-sm equipment-eta" value="${equipment.eta}" data-index="${index}" required></td>
				<td><input type="number" step="0.01" class="form-control form-control-sm equipment-cos-phi" value="${equipment.cos_phi}" data-index="${index}" required></td>
				<td><input type="number" step="0.01" class="form-control form-control-sm equipment-u" value="${equipment.U}" data-index="${index}" required></td>
				<td><input type="number" class="form-control form-control-sm equipment-n" value="${equipment.n}" data-index="${index}" required></td>
				<td><input type="number" class="form-control form-control-sm equipment-pn" value="${equipment.Pn}" data-index="${index}" required></td>
				<td><input type="number" step="0.01" class="form-control form-control-sm equipment-kv" value="${equipment.Kv}" data-index="${index}" required></td>
				<td><input type="number" step="0.01" class="form-control form-control-sm equipment-tg-phi" value="${equipment.tg_phi}" data-index="${index}" required></td>
				<td><button type="button" class="btn btn-danger btn-sm" onclick="app.remove_equipment(${index})">Видалити</button></td>
			`;
			tableBody.appendChild(row);
		});
	}

	add_equipment() {
		this.equipmentData.push({
			name: "Нове обладнання",
			eta: 0.92,
			cos_phi: 0.9,
			U: 0.38,
			n: 1,
			Pn: 10,
			Kv: 0.5,
			tg_phi: 0.75
		});
		this.renderEquipmentTable();
	}

	remove_equipment(index) {
		this.equipmentData.splice(index, 1);
		this.renderEquipmentTable();
	}

	collectFormData() {
		let updatedData = [];
		let nameInputs = document.querySelectorAll(".equipment-name");
		
		nameInputs.forEach((input, index) => {
			let etaInput = document.querySelector(`.equipment-eta[data-index="${index}"]`);
			let cosPhiInput = document.querySelector(`.equipment-cos-phi[data-index="${index}"]`);
			let uInput = document.querySelector(`.equipment-u[data-index="${index}"]`);
			let nInput = document.querySelector(`.equipment-n[data-index="${index}"]`);
			let pnInput = document.querySelector(`.equipment-pn[data-index="${index}"]`);
			let kvInput = document.querySelector(`.equipment-kv[data-index="${index}"]`);
			let tgPhiInput = document.querySelector(`.equipment-tg-phi[data-index="${index}"]`);

			updatedData.push({
				name: input.value,
				eta: parseFloat(etaInput.value),
				cos_phi: parseFloat(cosPhiInput.value),
				U: parseFloat(uInput.value),
				n: parseInt(nInput.value),
				Pn: parseFloat(pnInput.value),
				Kv: parseFloat(kvInput.value),
				tg_phi: parseFloat(tgPhiInput.value)
			});
		});

		return updatedData;
	}

	calculator_form_submit(event) {
		event.preventDefault();
		
		let formData = this.collectFormData();
		
		if (formData.some(item => 
			isNaN(item.eta) || isNaN(item.cos_phi) || isNaN(item.U) || 
			isNaN(item.n) || isNaN(item.Pn) || isNaN(item.Kv) || isNaN(item.tg_phi)
		)) {
			alert("Будь ласка, введіть коректні числові значення.");
			return;
		}
		
		let calculator = new EquipmentCalculator(formData);
		let currentResults = calculator.calculateCurrents();
		let summaryResults = calculator.calculateSummary();
		
		this.show_results(currentResults, summaryResults);
	}

	show_results(currentResults, summaryResults) {
		let currentTable = document.getElementById("current-results");
		currentTable.innerHTML = '';
		
		currentResults.forEach(result => {
			let row = document.createElement("tr");
			row.innerHTML = `
				<td>${result.name}</td>
				<td>${result.Ip} А</td>
			`;
			currentTable.appendChild(row);
		});

		document.getElementById("k-v").textContent = summaryResults.Kv;
		document.getElementById("n-e").textContent = summaryResults.ne;
		document.getElementById("k-p").textContent = summaryResults.Kp;
		document.getElementById("p-p").textContent = summaryResults.Pp + " кВт";
		document.getElementById("q-p").textContent = summaryResults.Qp + " квар";
		document.getElementById("s-p").textContent = summaryResults.Sp + " кВА";
		document.getElementById("i-p").textContent = summaryResults.Ip + " А";
		
		document.getElementById("results").style.display = "block";
	}

	hide_results() {
		document.getElementById("results").style.display = "none";
	}
}

export { App };