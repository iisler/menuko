import { MEALS_BY_ID } from '../../data/meals';
import { actions, getState, parseStored } from '../app-store';

// babel-jest bu çağrıyı içe aktarmaların üstüne taşır
jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const base = {
  plan: ['sulu-kofte', 'tavuk-sote', 'izgara-levrek', 'nohut-yemegi', 'dana-sote', 'hamsi-tava', 'tavuk-sis'],
  locked: Array(7).fill(false),
  checked: [],
  servings: 3,
  excluded: [],
};

describe('parseStored', () => {
  it('eski kayıtları (gün başına tek tür) listeye çevirir', () => {
    const state = parseStored(
      JSON.stringify({ ...base, pattern: ['dana', 'tavuk', 'balik', 'baklagil', 'dana', 'balik', 'tavuk'] }),
    );
    expect(state?.pattern).toEqual([['dana'], ['tavuk'], ['balik'], ['baklagil'], ['dana'], ['balik'], ['tavuk']]);
  });

  it('yeni kayıtları okur, sırayı düzenler ve tekrarları atar', () => {
    const pattern = [['balik', 'dana', 'dana'], ['tavuk'], ['tavuk'], ['tavuk'], ['tavuk'], ['tavuk'], ['tavuk']];
    expect(parseStored(JSON.stringify({ ...base, pattern }))?.pattern[0]).toEqual(['dana', 'balik']);
  });

  it('boş ya da geçersiz günleri olan kaydı reddeder', () => {
    const ok = ['dana', 'dana', 'dana', 'dana', 'dana', 'dana', 'dana'];
    expect(parseStored(JSON.stringify({ ...base, pattern: [[], ...ok.slice(1)] }))).toBeNull();
    expect(parseStored(JSON.stringify({ ...base, pattern: ['xyz', ...ok.slice(1)] }))).toBeNull();
    expect(parseStored('bozuk')).toBeNull();
  });
});

describe('toggleDayProtein', () => {
  beforeEach(() => actions.reset());

  it('son seçili türü kapatmaz', () => {
    actions.toggleDayProtein(0, 'dana');
    expect(getState().pattern[0]).toEqual(['dana']);
  });

  it('tür ekler ve çıkarır; çıkarılınca günün yemeği yeni türe uyar', () => {
    actions.toggleDayProtein(0, 'balik');
    expect(getState().pattern[0]).toEqual(['dana', 'balik']);
    actions.toggleDayProtein(0, 'dana');
    expect(getState().pattern[0]).toEqual(['balik']);
    expect(MEALS_BY_ID[getState().plan[0]!].protein).toBe('balik');
  });

  it('tür eklemek mevcut yemeği değiştirmez', () => {
    const before = getState().plan[0];
    actions.toggleDayProtein(0, 'baklagil');
    expect(getState().plan[0]).toBe(before);
  });
});
