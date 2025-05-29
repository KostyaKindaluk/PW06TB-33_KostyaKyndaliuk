class EquipmentCalculator {
  constructor(equipmentData) {
    this.equipmentData = equipmentData;
  }

  calculateCurrents() {
    return this.equipmentData.map(equipment => {
      const PnTotal = equipment.n * equipment.Pn;
      const Ip = this.round(PnTotal / (Math.sqrt(3) * equipment.U * equipment.cos_phi * equipment.eta), 1);
      return {
        name: equipment.name,
        Ip: Ip
      };
    });
  }

  calculateSummary() {
    let sumPn = 0;
    let sumKvPn = 0;
    let sumKvPnTgphi = 0;
    let sumPn2 = 0;

    this.equipmentData.forEach(equipment => {
      const PnTotal = equipment.n * equipment.Pn;
      sumPn += PnTotal;
      sumKvPn += PnTotal * equipment.Kv;
      sumKvPnTgphi += PnTotal * equipment.Kv * equipment.tg_phi;
      sumPn2 += equipment.n * equipment.Pn * equipment.Pn;
    });

    const Kv = this.round(sumKvPn / sumPn, 4);
    
    const ne = Math.ceil((sumPn * sumPn) / sumPn2);
    
    const Kp = this.getKpCoefficient(Kv, ne);
    
    const Pp = this.round(Kp * sumKvPn, 2);
    
    const Qp = this.round(1.0 * sumKvPnTgphi, 2);
    
    const Sp = this.round(Math.sqrt(Pp * Pp + Qp * Qp), 2);
    
    const Ip = this.round(Pp / 0.38, 2);

    return { Kv, ne, Kp, Pp, Qp, Sp, Ip };
  }

  getKpCoefficient(Kv, ne) {
    if (Kv <= 0.25 && ne >= 10) {
      return 1.25;
    } else if (Kv > 0.25 && Kv <= 0.5) {
      return 1.1;
    } else if (Kv > 0.5) {
      return 1.0;
    } else {
      return 1.5;
    }
  }

  round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }
}

export { EquipmentCalculator };