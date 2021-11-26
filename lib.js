const order = [
  '1s', '2s', '2p',
  '3s', '3p', '4s',
  '3d', '4p', '5s',
  '4d', '5p', '6s',
  '4f', '5d', '6p',
  '7s', '5f', '6d',
  '7p', '6f', '7d',
  '7f'
].map(item => {
  return {
    kulit: parseInt(item.split('')[0]),
    subkulit: item.split('')[1]
  }
});

function getMaxFromSub(n) {
  return 2 + 'spdf'.split('').indexOf(n) * 4;
}

module.exports = class Atom {
  constructor(e) {
    if (isNaN(e)) {
      throw new Error('Not a number!');
    }

    if (e < 0 || e > 105) {
      throw new Error('Invalid atomic number!');
    }

    this.e = e;
  }
  konfigurasiKuantum(args = { clean: false }) {
    let el = this.e;
    let arr = [];

    for (let item of order) {
      let max = getMaxFromSub(item.subkulit);

      if (el - max >= 0) {
        el -= max;
        arr.push({
          kulit: item.kulit,
          subkulit: item.subkulit,
          elektron: max
        });

        if (el == 0) {
          break;
        }
      } else if (el - max < 0) {
        arr.push({
          kulit: item.kulit,
          subkulit: item.subkulit,
          elektron: el
        });
        break;
      }
    }

    if (args.clean == true) {
      arr = arr.map(item => {
        return `${item.kulit}${item.subkulit}${item.elektron}`
      });
    }

    return arr;
  }
  konfigurasiElektron() {
    let arr = [];

    this.konfigurasiKuantum().forEach(args => {
      if (arr[args.kulit - 1] == undefined) {
        arr.push(args.elektron);
      } else {
        arr[args.kulit - 1] += args.elektron;
      }
    });

    return arr;
  }
  periode() {
    return this.konfigurasiElektron().length;
  }
  golongan() {
    if (57 <= this.e && this.e <= 70) {
      return 'Lantanida';
    }

    if (89 <= this.e && this.e <= 102) {
      return 'Aktinida';
    }

    let konf = this.konfigurasiKuantum()
    let sub = konf[konf.length - 1].subkulit;
    let e = konf[konf.length - 1].elektron;

    if (sub == 's') {
      switch (e) {
        case 1:
          return 'I-A';
        case 2:
          return 'II-A';
      }
    }

    if (sub == 'p') {
      switch (e) {
        case 1:
          return 'III-A';
        case 2:
          return 'IV-A';
        case 3:
          return 'V-A';
        case 4:
          return 'VI-A';
        case 5:
          return 'VII-A';
        case 6:
          return 'VIII-A';
      }
    }

    if (sub == 'd') {
      switch (e) {
        case 1:
          return 'III-B';
        case 2:
          return 'IV-B';
        case 3:
          return 'V-B';
        case 4:
          return 'VI-B';
        case 5:
          return 'VII-B';
        case 6:
        case 7:
        case 8:
          return 'VIII-B';
        case 9:
          return 'I-B';
        case 10:
          return 'II-B';
      }
    }
  }
  valensi() {
    let konf = this.konfigurasiElektron();
    return konf[konf.length - 1];
  }
  nilaiKuantum() {
    let konf = this.konfigurasiKuantum();
    let kval = konf[konf.length - 1];
    let { subkulit, elektron } = kval;

    let obj = {}
    let l = ['s', 'p', 'd', 'f'];
    let formatKotak = {
      s: [0],
      p: [-1, 0, 1],
      d: [-2, -1, 0, 1, 2],
      f: [-3, -2, -1, 0, 1, 2, 3]
    }

    obj.n = konf[konf.length - 1].kulit;
    obj.l = l.indexOf(subkulit);

    let jumlahKotak = 2 * obj.l + 1;
    let indexElektron = jumlahKotak * 2 - 1;

    // Temporary
    obj.m = [];

    if (elektron <= jumlahKotak) {
      for (let j = 1; j <= jumlahKotak; j++) {
        if (j <= elektron) {
          obj.m.push('↑');
        } else {
          obj.m.push('');
        }      
      }

      obj.s = "+ 1/2";
    } else {
      let selisih = elektron - jumlahKotak;

      for (let j = 1; j <= jumlahKotak; j++) {
        if (j <= selisih) {
          obj.m.push('↑↓');
        } else {
          obj.m.push('↑');
        }
      }

      obj.s = "- 1/2";
    }

    return obj;
  }
}
