const c = require('./correctarium.js');

test('0 символов', () => {
    expect(c.calc_minutesNeeded(0, 'eng', 'kekw')).toStrictEqual(60)
});

test('333 символов eng', () => {
    expect(c.calc_minutesNeeded(333, 'eng', 'doc')).toStrictEqual(90)
});

test('До рабочего времени', () => {
    expect(c.calc_deadline(90, '2022-07-19T03:24:52')).toStrictEqual(new Date('2022-07-19T11:30:00'))
});

test('После рабочего времени', () => {
    expect(c.calc_deadline(60,  '2022-07-19T21:24:52')).toStrictEqual(new Date('2022-07-20T11:00:00'))
});

test('В рабочее время, хватает времени до конца дня, хватает минут до часа', () => {
    expect(c.calc_deadline(90, '2022-07-19T16:10:00')).toStrictEqual(new Date('2022-07-19T17:40:00'))
});

test('В рабочее время, хватает времени до конца дня, не хватает минут до часа', () => {
    expect(c.calc_deadline(110, '2022-07-19T16:12:00')).toStrictEqual(new Date('2022-07-19T18:02:00'))
});

test('В рабочее время, не хватает времени до конца дня', () => {
    expect(c.calc_deadline(630, '2022-07-19T16:10:00')).toStrictEqual(new Date('2022-07-20T17:40:00'))
});

test('Не успевает к концу рабочей недели (пт)', () => {
    expect(c.calc_deadline(60, '2022-07-22T18:10:00')).toStrictEqual(new Date('2022-07-25T10:10:00'))
});

test('Не успевает к концу рабочей недели (вт)', () => {
    expect(c.calc_deadline(1620+60, '2022-07-19T18:10:00')).toStrictEqual(new Date('2022-07-25T10:10:00'))
});

test('Запрос в выходной', () => {
    expect(c.calc_deadline(60, '2022-07-23T18:10:00')).toStrictEqual(new Date('2022-07-25T11:00:00'))
});
