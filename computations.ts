import * as medalData from './medals.json';

const medals = Array.from({ ...medalData, length: 2100 });
type Medal = typeof medals[number];
type Ability = Medal['Ability'];
type SelfBuffs = Extract<Ability, { SelfBuffs: any }>['SelfBuffs'];

export function computeDamagePotential(
  medal: Medal, options = {
    includeGeneralAttackUp: false,
    includeAttributeAttackUp: false,
  }) {
  const strength = 'STR' in medal ? medal.STR : 0;
  const specialAttack = 'Multi' in medal ? medal.Multi : 1;
  const guilt = 'Guilt' in medal ? (1 + (medal.Guilt / 100)) : 1;

  const strengthPlus = getStrengthPlus(medal);
  const generalAttackUp = options.includeGeneralAttackUp ? getGeneralAttackUp(medal) : 1;
  const attributeAttackUp = options.includeAttributeAttackUp ? getAttributeAttackUp(medal) : 1;

  const selfBuffs = getSelfBuffs(medal);
  const guiltBuff = 'GuiltBuff' in selfBuffs ? (selfBuffs.GuiltBuff / 100) : 0;
  const attributeBoost = 'AttributeAlways' in selfBuffs ? 1.5 : 1;

  return (strength + strengthPlus)
    * specialAttack
    * (guilt + guiltBuff)
    * generalAttackUp
    * attributeAttackUp
    * attributeBoost;
}

function getStrengthPlus(medal: Medal): number {
  const selfBuffs = getSelfBuffs(medal);
  return 'STRPlus' in selfBuffs ? selfBuffs.STRPlus.Amount : 0;
}

function getGeneralAttackUp(medal: Medal): number {
  const selfBuffs = getSelfBuffs(medal);
  if ('BuffGA' in selfBuffs) {
    return {
      1: 1.2,
      2: 1.35,
      3: 1.5,
      4: 1.6,
      5: 1.7,
      6: 1.8,
      7: 1.9,
      8: 2.0,
      9: 2.1,
      10: 2.2,
      11: 2.3,
      12: 2.4,
      13: 2.5,
      14: 2.6,
      15: 2.7
    }[selfBuffs.BuffGA.BuffCount];
  }
  return 1;
}

const attributeBuffTable = {
  1: 0.25,
  2: 0.55,
  3: 0.9,
  4: 1.1,
  5: 1.3,
  6: 1.5,
  7: 1.7,
  8: 1.9,
  9: 2.1,
  10: 2.3,
  11: 2.5,
  12: 2.7,
  13: 2.9,
  14: 3.1,
  15: 3.3,
  16: 3.5,
  17: 3.7
};

function getAttributeAttackUp(medal: Medal): number {
  const selfBuffs = getSelfBuffs(medal);
  const buffs = ['BuffUA', 'BuffRA', 'BuffPA', 'BuffSA', 'BuffMA']
    .map((buff) => buff in selfBuffs
      ? attributeBuffTable[selfBuffs[buff].BuffCount]
      : 0);
  const attributeVector = [
    medal.Direction === 'Upright' ? 1 : 0,
    medal.Direction === 'Reversed' ? 1 : 0,
    medal.Attribute === 'Power' ? 1 : 0,
    medal.Attribute === 'Speed' ? 1 : 0,
    medal.Attribute === 'Magic' ? 1 : 0,
  ];
  return buffs.map((buff, i) => buff * attributeVector[i]).reduce(sum, 0) || 1;
}

function sum(accumulator: number, value: number): number {
  return accumulator + value;
}

function getSelfBuffs(medal: Medal): SelfBuffs | {} {
  return 'SelfBuffs' in medal.Ability ? medal.Ability.SelfBuffs : {};
}
